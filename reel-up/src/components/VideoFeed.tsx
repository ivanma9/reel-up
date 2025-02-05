'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Video } from '../types/video';

const FeedContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  background-color: black;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


interface VideoFeedProps {
  videos: Video[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  return (
    <FeedContainer>
      {videos.length === 0 ? (
        <div style={{ color: 'white' }}>No videos found</div>
      ) : (
        videos.map((video) => (
          <VideoContainer key={video.id}>
            <video 
              style={{ width: '100%', maxWidth: '500px', height: '100%', aspectRatio: '9/16' }}
              src={video.videoUrl} 
              autoPlay
              muted={true}
              playsInline
              loop
              onPlay={() => {setIsPlaying(true)}}
              onPause={() => {setIsPlaying(false)}}
              onClick={() => {setIsPlaying(!isPlaying)}}
            />
            
          </VideoContainer>
        ))
      )}
    </FeedContainer>
  );
} 