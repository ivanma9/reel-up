import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '../route'
import { GET as GET_VIDEO_ID, DELETE as DELETE_VIDEO_ID } from '../[videoId]/route'
import { uploadToS3 } from '@/app/actions/s3'
import { auth } from '@clerk/nextjs/server'
import type { Mock } from 'vitest'

// Mock auth
vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(() => ({
        userId: 'test-user-id'
    }))
}))

// Mock S3 upload
vi.mock('@/app/actions/s3', () => ({
    uploadToS3: vi.fn(() => 'https://test-bucket.s3.region.amazonaws.com/test-file')
}))

describe('Videos API Routes', () => {
    describe('GET /api/videos', () => {
        it('should return empty videos array', async () => {
            const { req } = createMocks({
                method: 'GET'
            })

            const response = await GET()
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toHaveProperty('videos')
            expect(Array.isArray(data.videos)).toBe(true)
        })
    })

    describe('POST /api/videos', () => {
        it('should handle video upload', async () => {
            // Create test file
            const testFile = new File(['test video content'], 'test.mp4', {
                type: 'video/mp4'
            })

            // Create FormData with file
            const formData = new FormData()
            formData.append('file', testFile)
            formData.append('title', 'Test Video')

            const { req } = createMocks({
                method: 'POST',
                body: formData
            })

            const response = await POST(req)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.fileUrl).toBeDefined()
            expect(uploadToS3).toHaveBeenCalled()
        })

        it('should return 401 if not authenticated', async () => {
            // Update the type casting to use Vitest's Mock type
            (auth as Mock).mockImplementationOnce(() => ({ userId: null }))

            const { req } = createMocks({
                method: 'POST',
                body: new FormData()
            })

            const response = await POST(req)
            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data.error).toBe('Unauthorized')
        })

        it('should return 400 if missing required fields', async () => {
            const { req } = createMocks({
                method: 'POST',
                body: new FormData() // Empty form data
            })

            const response = await POST(req)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe('Missing required fields')
        })
    })
})

describe('Video ID API Routes', () => {
    describe('GET /api/videos/[videoId]', () => {
        it('should return video details', async () => {
            const { req } = createMocks({
                method: 'GET'
            })

            const response = await GET_VIDEO_ID(req, {
                params: { videoId: 'test-video-id' }
            })
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toHaveProperty('video')
            expect(data.video.id).toBe('test-video-id')
        })
        it('should return 401 if not authenticated', async () => {
            // Update the type casting to use Vitest's Mock type
            (auth as Mock).mockImplementationOnce(() => ({ userId: null }))

            const { req } = createMocks({
                method: 'GET'
            })

            const response = await GET_VIDEO_ID(req, {
                params: { videoId: 'test-video-id' }
            })
            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data.error).toBe('Unauthorized')
        })
    })

    describe('DELETE /api/videos/[videoId]', () => {
        it('should delete video', async () => {
            const { req } = createMocks({
                method: 'DELETE'
            })

            const response = await DELETE_VIDEO_ID(req, {
                params: { videoId: 'test-video-id' }
            })
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
        })
    })
}) 