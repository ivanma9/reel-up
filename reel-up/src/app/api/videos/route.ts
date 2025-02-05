import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Logger } from "@/utils/logger"
import { NextRequest } from 'next/server'

const logger = new Logger("videos-api")

// POST /api/videos - Save video metadata after S3 upload
export async function POST(request: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            logger.error('Unauthorized')
            return NextResponse.json(
                { error: 'Unauthorized' }, 
                { status: 401 }
            )
        }

        const { title, description, fileUrl, filename } = await request.json()

        if (!fileUrl || !title) {
            logger.error('Missing required fields:', { fileUrl, title })
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            )
        }

        // TODO: Save video metadata to database
        // const video = await db.videos.create({
        //     data: {
        //         userId,
        //         title,
        //         description,
        //         fileUrl,
        //         filename,
        //         createdAt: new Date()
        //     }
        // })
        logger.info('Video metadata saved successfully')

        return NextResponse.json({ 
            success: true,
            message: 'Video metadata saved successfully'
        })
    } catch (error) {
        logger.error('Error saving video metadata:', error)
        return NextResponse.json(
            { error: 'Failed to save video metadata' }, 
            { status: 500 }
        )
    }
}

// GET /api/videos - Get list of videos
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' }, 
                { status: 401 }
            )
        }

        // TODO: Fetch videos from your database
        // You might want to implement pagination here
        // const videos = await db.videos.findMany({...})

        return NextResponse.json({ 
            success: true,
            videos: [] // Replace with actual videos from database
        })
    } catch (error) {
        logger.error('Error fetching videos:', error)
        return NextResponse.json(
            { error: 'Failed to fetch videos' }, 
            { status: 500 }
        )
    }
} 