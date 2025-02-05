'use server'

import { auth } from "@clerk/nextjs/server";
import { Logger } from "@/utils/logger";
import { uploadVideoToS3 } from "@/lib/s3";
import getVideoTranscription from "@/lib/video-transcription";
import getVideoAnalysis from "@/lib/video-analysis";
import generateTags from "@/lib/video-tags";
import getVideoEmbedding from "@/lib/video-embedding";
import { insertVideo } from "@/db/queries/insert";

const logger = new Logger("video-actions");

interface CreateVideoParams {
    file: FormData;
    filename: string;
    title: string;
    description: string;
    contentType: string;
}

export async function createVideo({ file, filename, title, description, contentType }: CreateVideoParams) {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) {
        logger.error('User not authenticated');
        throw new Error('User not authenticated');
    }

    try {
        if (!file || !filename || !title) {
            logger.error('Missing required fields');
            throw new Error('Missing required fields');
        }

        // Convert FormData to Buffer
        const formDataFile = file.get('file') as File;
        const buffer = Buffer.from(await formDataFile.arrayBuffer());

        // Generate a unique filename
        const uniqueFilename = `${userId}-${Date.now()}-${filename}`;
        logger.info(`Generated unique filename: ${uniqueFilename}`);

        // Upload video to S3 with the new signature
        const { fileUrl, metadata } = await uploadVideoToS3(
            buffer,
            uniqueFilename,
            contentType,
            userId,
            title
        );

        logger.info(`File URL: ${fileUrl}`);
        logger.info(`Metadata: ${metadata}`);

        // Use Metadata and contents of video and audio transcript to generate proper metadata
        const [audioTranscript, videoAnalysis] = await Promise.all([
            getVideoTranscription(fileUrl),
            getVideoAnalysis(fileUrl)
        ]);

        // Generate tags based off the audio and video
        const tags = await generateTags(audioTranscript, videoAnalysis);

        // Generate embedding
        const embeddingValues = await getVideoEmbedding(videoAnalysis)


        logger.info(`userId: ${userId}`)
        //Add embedding and metadata to neon
        await insertVideo({
            id: uniqueFilename,
            title: title,
            caption: description,
            summary: videoAnalysis,
            userId: userId,
            embedding: embeddingValues,
            categories: tags,
        });


        // Return metadata and file URL
        return {
            success: true,
            fileUrl,
            metadata: {
                ...metadata,
                description // Adding the description from the input params
            }
        };
    } catch (error) {
        logger.error(`Error creating video: ${error}`);
        throw error;
    }
}