import fs from "fs";
import Groq from "groq-sdk";
import { Logger } from "@/utils/logger";

const logger = new Logger("video-transcription");

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.WHISPER_API_KEY,
});

const getVideoTranscription = async (fileUrl: string): Promise<string> => {
  logger.info("Downloading file from S3");
  
  // Download the file from S3
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const file = new File([blob], 'audio.mp4', { type: response.headers.get('content-type') || 'video/mp4' });

  // Create a transcription job
  logger.info("Starting transcription job");
  const transcriptionResponse = await groq.audio.transcriptions.create({
    file: file,
    model: "whisper-large-v3-turbo",
    response_format: "text",
    language: "en",
    temperature: 0.0,
  });
  //handle error
  if (!transcriptionResponse) {
    logger.error(`Error: No transcription response`);
    throw new Error("No transcription response");
  }
  // Log the transcribed text
  logger.info(`Transcription response: ${transcriptionResponse}`);
  return String(transcriptionResponse);
  
}

export default getVideoTranscription;
