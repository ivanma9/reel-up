import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Logger } from "@/utils/logger"

const logger = new Logger("s3")

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION
})

export async function uploadVideoToS3(buffer: Buffer, filename: string, contentType: string, userId: string, title: string) {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `videos/${filename}`,
            Body: buffer,
            ContentType: contentType,
            StorageClass: 'STANDARD',
            ServerSideEncryption: 'AES256',
            Metadata: {
                'user-id': userId,
                'upload-date': new Date().toISOString(),
                'original-name': filename,
                title,
            }
        });

        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${filename}`;
        
        logger.info(`Uploaded video to S3: ${filename}`);
        
        return {
            success: true,
            fileUrl,
            filename,
            metadata: {
                userId,
                title,
                contentType,
                uploadDate: new Date().toISOString()
            }
        };
    } catch (error) {
        logger.error('Error uploading video to S3:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to upload video');
    }
}

export function validateVideoFile(contentType: string, size: number) {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(contentType)) {
        throw new Error('Invalid file type. Please upload MP4, MOV, or AVI');
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (size > maxSize) {
        throw new Error('File too large. Maximum size is 100MB');
    }

    return true;
}

export async function listS3Videos(): Promise<string[]> {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Prefix: 'videos/'
        });

        const response = await s3Client.send(command);
        
        const videoUrls = await Promise.all(
            response.Contents?.filter(object => 
                object.Key !== 'videos/' && object.Key?.endsWith('.mp4')
            ).map(async (object) => {
                const getObjectCommand = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: object.Key,
                    ResponseContentType: 'video/mp4',
                });
                return getSignedUrl(s3Client, getObjectCommand, { 
                    expiresIn: 3600,
                });
            }) || []
        );

        logger.info(`Listed ${videoUrls.length} videos from S3`);
        return videoUrls;
    } catch (error) {
        logger.error('Error listing videos from S3:', error);
        throw error;
    }
}