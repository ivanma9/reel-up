export interface VideoMetadata {
  caption: string;
  username: string;
}

export interface VideoMetadataMap {
  [filename: string]: VideoMetadata;
}

export interface Video {
  id: string;
  videoUrl: string;
  caption: string;
  username: string;
} 