import { GenerateContentRequest, VertexAI, Part } from '@google-cloud/vertexai';
import { Logger } from '@/utils/logger';

const logger = new Logger("video-analysis");

const getVideoAnalysis = async (fileUrl: string): Promise<string> => {
    logger.info(`Starting video analysis for ${fileUrl}`);
    try {
        // Initialize Vertex AI with your project details
        const vertexAI = new VertexAI({
            project: process.env.GOOGLE_CLOUD_PROJECT_ID,
            location: 'us-east1'
        });

        // Get the Gemini model
        const generativeModel = vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash-001',
        });

        // Prepare the video file part
        const filePart : Part = {
            fileData: {
                fileUri: fileUrl, // Your S3 URL needs to be accessible by Vertex AI
                mimeType: 'video/mp4',
            },
        };

        // Prepare the prompt
        const textPart : Part = {
            text: `
            Provide a detailed description of the video content.
            Include these elements:
            - Visual elements and actions
            - Any important dialogue or speech
            - Key moments or highlights
            - Overall context and purpose of the video
            - Gather the subjects and the background of the video

            Please condense this into a summary of the video.
            `,
        };

        // Create the request
        const request: GenerateContentRequest = {
            contents: [{
                role: 'user',
                parts: [filePart, textPart]
            }],
        };

        // Generate the content
        const response = await generativeModel.generateContent(request);
        const contentResponse = await response.response;
        const text = contentResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
        logger.info(`Video analysis: ${text}`);
        return text;
    } catch (error) {
        console.error('Error analyzing video:', error);
        throw error;
    }
};

export default getVideoAnalysis;