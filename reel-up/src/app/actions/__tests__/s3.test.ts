import { uploadToS3, listS3Videos } from '../s3'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3', () => ({
    S3Client: vi.fn(() => ({
        send: vi.fn().mockImplementation((command) => {
            if (command.constructor.name === 'ListObjectsV2Command') {
                return Promise.resolve({
                    Contents: [
                        { Key: 'videos/test1.mp4' },
                        { Key: 'videos/test2.mp4' },
                        { Key: 'videos/' }, // This should be filtered out
                    ]
                });
            }
            return Promise.resolve({});
        })
    })),
    PutObjectCommand: vi.fn(),
    ListObjectsV2Command: vi.fn(),
    GetObjectCommand: vi.fn(),
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: vi.fn().mockImplementation(() => 
        Promise.resolve('https://fake-signed-url.com/video.mp4')
    )
}));

describe('S3 Operations Tests', () => {
    // Test video file path
    const testVideoPath = path.join(__dirname, 'test-assets', 'video1.mp4')
    let testVideoBuffer: Buffer

    beforeAll(() => {
        // Read test video file into buffer
        testVideoBuffer = fs.readFileSync(testVideoPath)
    })

    it('should list videos from S3', async () => {
        const videos = await listS3Videos()

        expect(videos).toBeDefined()
        expect(Array.isArray(videos)).toBe(true)
        expect(videos.length).toBe(2) // Should only get 2 videos, not the directory
        expect(videos[0]).toContain('https://fake-signed-url.com')
    })

    it('should generate upload URL', async () => {
        const testParams = {
            buffer: testVideoBuffer,
            filename: 'test/test-upload.mp4',
            contentType: 'video/mp4'
        }

        const result = await uploadToS3(testParams)

        expect(result).toBeDefined()
        expect(result.uploadUrl).toBeDefined()
        expect(result.fileUrl).toBeDefined()
        expect(result.fileUrl).toContain(process.env.AWS_BUCKET_NAME)
        expect(result.fileUrl).toContain('test/test-upload.mp4')
    })
}) 