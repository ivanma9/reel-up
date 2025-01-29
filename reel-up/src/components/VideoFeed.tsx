'use client';

import React, { useState, useEffect } from 'react';
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
`;

interface VideoFeedProps {
  initialVideos: Video[];
}

export default function VideoFeed({ initialVideos }: VideoFeedProps) {
  const [videos] = useState<Video[]>(initialVideos);

  useEffect(() => {
    console.log('VideoFeed received videos:', initialVideos);
  }, [initialVideos]);

  return (
    <FeedContainer>
      {videos.length === 0 ? (
        <div style={{ color: 'white' }}>No videos found</div>
      ) : (
        videos.map((video) => (
          <VideoContainer key={video.id}>
            <video
              src={video.videoUrl}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <h2>{video.username}</h2>
            <p>{video.caption}</p>
          </VideoContainer>
        ))
      )}
    </FeedContainer>
  );
} 