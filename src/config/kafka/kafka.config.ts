import { Kafka, Producer, Admin, logLevel, CompressionTypes } from "kafkajs";
import { config } from "../generalconfig";
import { TOPIC_DEFINITIONS } from "./topic_defination";

export const kafka = new Kafka({
    clientId: config.KAFKA.CLIENT_ID,
    brokers: config.KAFKA.BROKERS,
    logLevel: config.BUN_ENV === "production" ? logLevel.WARN : logLevel.INFO,

    // Production retry configuration with exponential backoff
    retry: {
        initialRetryTime: 100,
        retries: 8,
        maxRetryTime: 30000,
        multiplier: 2,
        factor: 0.2,
    },

    // Connection timeouts
    connectionTimeout: 10000,
    requestTimeout: 30000,

    // Enable SASL/SSL for production
    ...(config.BUN_ENV === "production" && {
        ssl: true,
        sasl: {
            mechanism: 'scram-sha-256',
            username: process.env.KAFKA_USERNAME || '',
            password: process.env.KAFKA_PASSWORD || '',
        },
    }),
});

let producer: Producer | null = null;
let admin: Admin | null = null;

// Initialize admin client
async function getAdmin(): Promise<Admin> {
    if (!admin) {
        admin = kafka.admin();
        await admin.connect();
    }
    return admin;
}

// Topic initialization with batch creation
export async function initializeKafkaTopics() {
    const adminClient = await getAdmin();

    try {
        console.log("🔍 Checking existing Kafka topics...");
        const existingTopics = await adminClient.listTopics();

        const topicsToCreate = TOPIC_DEFINITIONS.filter(
            (topicDef) => !existingTopics.includes(topicDef.topic)
        );

        if (topicsToCreate.length === 0) {
            console.log("✅ All Kafka topics already exist");
            return;
        }

        // Batch create topics
        await adminClient.createTopics({
            topics: topicsToCreate.map((topicDef) => ({
                topic: topicDef.topic,
                numPartitions: topicDef.numPartitions,
                // replicationFactor: topicDef.replicationFactor,
                // configEntries: Object.entries(topicDef.config || {}).map(
                //     ([name, value]) => ({ name, value })
                // ),
            })),
            waitForLeaders: true,
            timeout: 10000,
        });

        console.log(`✅ Created ${topicsToCreate.length} Kafka topics:`,
            topicsToCreate.map(t => t.topic).join(", ")
        );
    } catch (error: any) {
        // Ignore "Topic already exists" errors
        if (error.type !== 'TOPIC_ALREADY_EXISTS') {
            console.error("❌ Kafka topic initialization failed:", error);
            throw error;
        }
    }
}

// Producer initialization with production configs
export async function connectKafkaProducer() {
    if (producer) {
        console.warn("⚠️ Producer already connected");
        return producer;
    }

    producer = kafka.producer({
        // CRITICAL: Enable idempotence for exactly-once semantics
        idempotent: true,

        // REQUIRED: acks must be -1/'all' for idempotent producer
        allowAutoTopicCreation: false,

        // Transactional settings
        transactionTimeout: 60000,

        // Max in-flight must be ≤5 for idempotence
        maxInFlightRequests: 5,
        // Retry configuration (idempotent producer handles duplicates)
        retry: {
            retries: Number.MAX_SAFE_INTEGER, // Retry indefinitely
            initialRetryTime: 100,
            maxRetryTime: 30000,
            multiplier: 2,
            restartOnFailure: async (error) => {
                console.error("❌ Producer restart triggered:", error);
                return true; // Always restart
            },
        },
    });

    try {
        await producer.connect();
        console.log("✅ Kafka Producer Connected (idempotent, acks=all)");

        // Error event handlers
        producer.on('producer.disconnect', () => {
            console.warn("⚠️ Producer disconnected - will auto-reconnect");
        });

        producer.on('producer.network.request_timeout', (payload) => {
            console.error("❌ Producer request timeout:", payload);
        });

        return producer;
    } catch (err) {
        console.error("❌ Kafka Producer connection error:", err);
        producer = null;
        throw err;
    }
}

// Get producer instance with validation
export function getKafkaProducer(): Producer {
    if (!producer) {
        throw new Error("Kafka producer not initialized. Call connectKafkaProducer() first.");
    }
    return producer;
}

// Graceful shutdown with proper cleanup order
export async function disconnectKafka() {
    const errors: Error[] = [];

    // Disconnect producer first (flush pending messages)
    if (producer) {
        try {
            await producer.disconnect();
            console.log("✅ Kafka Producer Disconnected");
            producer = null;
        } catch (error) {
            console.error("❌ Error disconnecting producer:", error);
            errors.push(error as Error);
        }
    }

    // Disconnect admin last
    if (admin) {
        try {
            await admin.disconnect();
            console.log("✅ Kafka Admin Disconnected");
            admin = null;
        } catch (error) {
            console.error("❌ Error disconnecting admin:", error);
            errors.push(error as Error);
        }
    }

    if (errors.length > 0) {
        throw new AggregateError(errors, "Failed to disconnect Kafka cleanly");
    }
}

// Health check
export async function checkKafkaHealth(): Promise<boolean> {
    try {
        const adminClient = await getAdmin();
        await adminClient.listTopics();
        return true;
    } catch (error) {
        console.error("❌ Kafka health check failed:", error);
        return false;
    }
}

// Application initialization sequence
export async function initializeKafka() {
    try {
        await initializeKafkaTopics();
        await connectKafkaProducer();
        console.log("✅ Kafka initialization complete (idempotent producer, acks=all)");
    } catch (error) {
        console.error("❌ Kafka initialization failed:", error);
        throw error;
    }
}

// Graceful shutdown handler
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down Kafka gracefully...');
    await disconnectKafka();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received, shutting down Kafka gracefully...');
    await disconnectKafka();
    process.exit(0);
});
