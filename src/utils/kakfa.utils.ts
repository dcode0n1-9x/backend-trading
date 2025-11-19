import { getKafkaProducer } from "../config/kafka/kafka.config";
import { TopicName } from "../config/kafka/topic_defination";


export async function sendMessage(
    topic: TopicName,
    key: string,
    value: object,
    headers?: Record<string, string>
) {
    const producer = getKafkaProducer();
    try {
        await producer.send({
            topic,
            messages: [{
                key,
                value: JSON.stringify(value),
                headers: headers ?
                    Object.entries(headers).reduce((acc, [k, v]) => ({
                        ...acc,
                        [k]: Buffer.from(v)
                    }), {}) : undefined,
            }],
            // acks: -1 is automatically set by idempotent=true
            // compression: CompressionTypes.Snappy,
        });
    } catch (error) {
        console.error(`❌ Failed to send message to ${topic}:`, error);
        throw error;
    }
}