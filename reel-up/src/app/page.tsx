import { Video } from '@/types/video'
import VideoFeed from '../components/VideoFeed'
import { promises as fs } from 'fs'
import path from 'path'
import { auth } from '@clerk/nextjs/server'
import { listS3Videos } from '@/lib/s3'

export default async function Home() {
  const videoUrls = await listS3Videos()
  
  const videos = videoUrls.map((videoUrl, index) => ({
    id: index.toString(),
    videoUrl: videoUrl,
    username: 'test',
    caption: 'test'
  }))

  return (
    <div className="pl-20">  {/* Add padding-left to account for sidebar width */}
      <VideoFeed videos={videos} />
    </div>
  )
}