import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Logger } from "@/utils/logger";

const logger = new Logger("s3");

// Initialize S3 client
const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export interface UploadParams {
    buffer: Buffer;
    filename: string;
    contentType: string;
}

export async function uploadToS3({ buffer, filename, contentType }: UploadParams) {
    try {
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: filename,
            Body: buffer,
            ContentType: contentType,
        });

        logger.info(`Uploading video to S3: ${filename}`);

        const response = await s3Client.send(uploadCommand);
        logger.info(`Uploaded video to S3 successfully: ${filename}`);

        // Return the URL of the uploaded file
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}
