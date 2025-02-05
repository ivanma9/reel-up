import { GoogleGenerativeAI } from "@google/generative-ai";
import { Logger } from "@/utils/logger";

const logger = new Logger("video-embedding");

const getVideoEmbedding = async (videoSummary: string) => {
    try {
        logger.info("Starting video embedding")
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
        const model = genAI.getGenerativeModel({
            model: 'text-embedding-004'
        })
        const embedding = await model.embedContent(videoSummary)

        logger.info(`Embedding length: ${embedding?.embedding?.values.length}`)
        return embedding.embedding.values
    } catch (error) {
        logger.error('Error generating embedding:', error)
        throw error
    }
}

export default getVideoEmbedding;