import { auth } from "@clerk/nextjs/server";
import { Video } from "../../types/video";
import { Logger } from "@/utils/logger";
import path from "path";
import { tmpdir } from "os";
import { writeFile } from "fs/promises";
import { uploadToS3 } from './s3';

const logger = new Logger("video actions");

export async function createVideo(videoFormData: FormData) {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) {
        throw new Error('User not authenticated');
    }
    const file = videoFormData.get('file') as File;
    const caption = videoFormData.get('caption') as string;
    const username = videoFormData.get('username') as string;

    if (!file || !caption || !username) {
        throw new Error('Invalid form data');
    }
    // Verify file is a video type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validVideoTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Must be one of: ${validVideoTypes.join(', ')}`);
    }

    const metadataFilename = `${userId}-User-${caption}-${file.name}`;

    try {
        logger.info(`Uploading video ${file.name} with metadata ${metadataFilename}`);

        // Save file to temp direction to get duration
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempDir = path.join(tmpdir(), 'reel-up');
        const tempFilePath = path.join(tempDir, file.name);
        await writeFile(tempFilePath, buffer);

        // Get duration of video
        const duration = await getVideoDuration(tempFilePath);

        // Upload video to S3
        const videoUrl = await uploadToS3({
            buffer,
            filename: metadataFilename,
            contentType: file.type,
        });

    } catch (error) {
        logger.error(`Error uploading video ${file.name}: ${error}`);
        throw new Error(`Error uploading video ${file.name}: ${error}`);
    }
}