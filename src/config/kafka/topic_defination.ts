


export type TopicName = "instrument.create" | "instrument.delete" | "alert.created" | "alert.updated" | "alert.deleted" | "order.created" | "order.updated" | "order.cancelled" | "order.filled" | "notification.outbound" | "kyc.layer.completed" | "holding.updated" | "alert.triggered" | "audit.trail";
    
// Topic definitions with configs
interface TopicConfig {
    topic: TopicName;
    numPartitions: number;
    // replicationFactor: number;
    config?: Record<string, string>;
}



export const TOPIC_DEFINITIONS: TopicConfig[] = [
    {
        topic : "alert.created",
        numPartitions: 3,
        // replicationFactor: 3,
        config: {
            "retention.ms": "2592000000", // 30 days
           //  "compression.type": "snappy",
            "min.insync.replicas": "1",
        },
    },
    {
        topic: "alert.updated",
        numPartitions: 3,
        // replicationFactor: 3,
        config: {
            "retention.ms": "2592000000", // 30 days
           //  "compression.type": "snappy",
            "min.insync.replicas": "1",
        },
    },
    {
        topic: "alert.deleted",
        numPartitions: 3,
        // replicationFactor: 3,
        config: {
            "retention.ms": "2592000000", // 30 days
           //  "compression.type": "snappy",
            "min.insync.replicas": "1",
        },
    },
    {
        topic: "order.created",
        numPartitions: 6,
        // replicationFactor: 3,
        config: {
            "retention.ms": "2592000000", // 30 days
           //  "compression.type": "snappy",
            "min.insync.replicas": "2", // Requires 2 replicas for acks=all
        },
    },
    {
        topic: "order.updated",
        numPartitions: 6,
        // replicationFactor: 3,
        config: {
            "retention.ms": "2592000000",
           //  "compression.type": "snappy",
            "min.insync.replicas": "2",
        },
    },
    {
        topic: "order.cancelled",
        numPartitions: 6,
        // replicationFactor: 3,
        config: {
            "retention.ms": "2592000000",
           //  "compression.type": "snappy",
            "min.insync.replicas": "2",
        },
    },
    {
        topic: "order.filled",
        numPartitions: 6,
        // replicationFactor: 3,
        config: {
            "retention.ms": "7776000000", // 90 days for audit
           //  "compression.type": "snappy",
            "min.insync.replicas": "2",
        },
    },
    {
        topic: "notification.outbound",
        numPartitions: 3,
        // replicationFactor: 2,
        config: {
            "retention.ms": "604800000", // 7 days
           //  "compression.type": "snappy",
            "min.insync.replicas": "1",
        },
    },
    {
        topic: "kyc.layer.completed",
        numPartitions: 3,
        // replicationFactor: 3,
        config: {
            "retention.ms": "31536000000", // 1 year for compliance
            "compression.type": "gzip", // Better compression for compliance data
            "min.insync.replicas": "2",
        },
    },
    {
        topic: "holding.updated",
        numPartitions: 6,
        // replicationFactor: 3,
        config: {
            "retention.ms": "7776000000", // 90 days
           //  "compression.type": "snappy",
            "min.insync.replicas": "2",
        },
    },
    {
        topic: "alert.triggered",
        numPartitions: 3,
        // replicationFactor: 2,
        config: {
            "retention.ms": "2592000000", // 30 days
           //  "compression.type": "snappy",
            "min.insync.replicas": "1",
        },
    },
    {
        topic: "audit.trail",
        numPartitions: 3,
        // replicationFactor: 3,
        config: {
            "retention.ms": "157680000000", // 5 years for regulatory compliance
            "compression.type": "gzip",
            "min.insync.replicas": "2",
        },
    },
    {
        topic : "instrument.create",
        numPartitions: 3,
        // replicationFactor: 2,
        config: {
            "retention.ms": "2592000000", // 30 days
              //  "compression.type": "snappy",
            "min.insync.replicas": "1",
        },
    }
];
