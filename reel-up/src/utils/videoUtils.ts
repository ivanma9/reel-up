import fs from 'fs';
import path from 'path';
import videoMetadata from '../data/videoMetadata.json';
import { Video, VideoMetadataMap } from '../types/video';

// Type assertion for the imported JSON
const typedVideoMetadata = videoMetadata as VideoMetadataMap;

export function getVideosFromPublic(): Video[] {
  const videosDirectory = path.join(process.cwd(), 'public/videos');
  console.log('Looking for videos in:', videosDirectory);
  
  try {
    const videoFiles = fs.readdirSync(videosDirectory);
    console.log('Found video files:', videoFiles);
    
    const videos = videoFiles.map((filename, index) => ({
      id: String(index + 1),
      videoUrl: `/videos/${filename}`,
      caption: typedVideoMetadata[filename]?.caption || `Video ${index + 1}`,
      username: typedVideoMetadata[filename]?.username || `@user${index + 1}`,
    }));
    
    console.log('Processed videos:', videos);
    return videos;
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return [];
  }
} 