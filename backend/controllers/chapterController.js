const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');
const youtube = google.youtube('v3');
const Course = require('../models/Course');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateChapterContent = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Process each chapter sequentially
        for (const chapter of course.chapters) {
            // Construct a more specific search query
            const searchQuery = `${course.topic} ${chapter.title} programming tutorial -gaming -gameplay`;
            
            const searchResult = await youtube.search.list({
                key: process.env.YOUTUBE_API_KEY,
                part: ['snippet'],
                q: searchQuery,
                type: ['video'],
                maxResults: 3,
                relevanceLanguage: 'en',
                videoDuration: 'medium',
                order: 'relevance',
                safeSearch: 'strict',
                topicId: '/m/01k8wb'  // Computer Programming topic
            });

            const videoPromises = searchResult.data.items.map(async (item) => {
                const videoData = await youtube.videos.list({
                    key: process.env.YOUTUBE_API_KEY,
                    part: ['snippet', 'statistics', 'contentDetails'],
                    id: [item.id.videoId]
                });

                const videoDetails = videoData.data.items[0].snippet;
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                const prompt = `Create a JSON object for this educational programming video about "${chapter.title}". Return ONLY a valid JSON object:
                {
                    "summary": "Technical summary focusing on ${chapter.title}",
                    "codeBlocks": [{"language": "language name", "code": "code here", "explanation": "explanation here"}],
                    "keyPoints": ["point1", "point2"]
                }

                Video: "${videoDetails.title}"
                Description: ${videoDetails.description}

                Rules:
                1. Focus only on ${chapter.title} related content
                2. Include only relevant code examples
                3. Return valid JSON only`;

                const result = await model.generateContent(prompt);
                let content = await result.response.text();
                content = content.replace(/```json|```/g, '').trim();
                
                try {
                    const parsedContent = JSON.parse(content);
                    return {
                        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                        videoTitle: videoDetails.title,
                        ...parsedContent
                    };
                } catch (parseError) {
                    console.error(`JSON parsing error for chapter ${chapter.title}:`, content);
                    return {
                        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                        videoTitle: videoDetails.title,
                        summary: "Failed to generate content",
                        codeBlocks: [],
                        keyPoints: []
                    };
                }
            });

            const videoContents = await Promise.all(videoPromises);
            chapter.content = videoContents;
        }

        await course.save();
        res.json(course);
    } catch (error) {
        console.error('Course content generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate course content',
            details: error.message
        });
    }
};

module.exports = {
    generateChapterContent
};