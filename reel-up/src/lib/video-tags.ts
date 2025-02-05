import Groq from 'groq-sdk';
import { Logger } from '@/utils/logger';

const logger = new Logger("video-tags");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateTags = async (audioTranscript: string, videoAnalysis: string): Promise<string[]> => {
    logger.info(`Generating tags for video`);

    const response = await groq.chat.completions.create({
        model: 'llama-3.2-3b-preview',
        messages: [
            {
                role: "user",
                content: 
                `Generate tags or categories for the following video. You will be given the audio transcript and video summary analysis.
                Here are some example tags that are broken down by category with some subcategories in them.
                Let's categorize based on these categories:

    Dance/Music: Dance Challenges, Dance Videos, Hip Hop, Pop Music, Singing, Music Lovers, Dancers, Singers
    Beauty/Fashion: Makeup, Beauty Hacks, Fashion, Outfit Ideas, Skincare, Hair Tutorials, Glow Ups, Style Inspiration
    Food/Cooking: Foodies, Recipes, Cooking, Food TikTok, Food Lovers, Baking, Easy Meals, Food Photography
    Fitness/Health: Fitness, Workouts, Gym, Healthy Lifestyle, Yoga, Weight Loss, Fitness Motivation, Fitness Tips
    Gaming: Gaming, Gamers, Fortnite, Minecraft, Gaming Community, Call of Duty, Valorant, Gaming Clips
    Pets/Animals: Pets, Dogs of TikTok, Cats of TikTok, Cute Animals, Pet Lovers, Animals of TikTok, Pet Life, Dog Training
    Travel/Lifestyle: Travel, Wanderlust, Travel Photography, Adventure, Vacation, Travel Hacks, Bucket List, Explore More
    Comedy/Memes: Comedy, Funny Videos, Memes, Laugh Out Loud, Hilarious, Jokes, Sarcasm, Relatable Content
    Art/Creativity: Art, Artists, Drawing, Painting, Creative, DIY, Crafts, Design
    Education/Learning: Learn on TikTok, Education, Study Tips, Life Hacks, How-To Guides, Knowledge Sharing, Tutorials

        Here is the video summary analysis: ${videoAnalysis}
        Here is the audio transcript: ${audioTranscript}

        Let's categorize the video based on the categories and subcategories in json format.
        
        Example output:
        {
            "categories": ["Dance/Music", "Beauty/Fashion","Pets/Animals", "Travel/Lifestyle", "Comedy/Memes", "Art/Creativity", "Education/Learning"]
        }

        Rules:
        Return max 3 categories.
        Ensure tags fit the content of the video.
        keep categories short and concise.
        `,
            },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.0
    });

    logger.info(`Generated tags`, { categories: response.choices[0].message.content });
    const tags = JSON.parse(response.choices[0].message.content || '{}');
    return tags.categories || [];
}

export default generateTags;