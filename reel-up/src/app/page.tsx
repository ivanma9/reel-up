import VideoFeed from '../components/VideoFeed'
import { getVideosFromPublic } from '../utils/videoUtils'

export default function Home() {
  // Since this is a server component, we can directly use the getVideosFromPublic function
  const videos = getVideosFromPublic();
  
  return (
    <div className="pl-20">  {/* Add padding-left to account for sidebar width */}
      <VideoFeed initialVideos={videos} />
    </div>
  )
}