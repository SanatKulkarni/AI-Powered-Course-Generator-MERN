# AI-Powered Course Generator

This project is a full-stack web application that leverages AI to automatically generate comprehensive online courses on various topics. Users can specify a course topic, desired difficulty, duration, and chapter count, and the application uses Google's Gemini AI and the YouTube Data API to create a structured course complete with chapter breakdowns, summaries, key points, code examples, and relevant video resources.

Developed by Sanat Kulkarni.

DEMO VIDEO: https://drive.google.com/file/d/1rKK6UNsVo0a5dQ0R1NxA9_CZ1L1z5lIp/view?usp=sharing

# Key Features

AI-Driven Course Structuring: Utilizes Google Gemini AI to generate a logical course structure including chapter titles, summaries, and estimated durations based on user inputs (topic, difficulty, length).

AI-Generated Chapter Content: Employs Google Gemini AI to create detailed content for each chapter, including:

In-depth summaries of the chapter topic.

Key learning points.

Relevant code examples (where applicable).

Integrated YouTube Video Resources: Automatically searches and embeds relevant YouTube tutorial videos for each chapter using the YouTube Data API, providing diverse learning materials.

Multi-Resource Learning: Each chapter can contain multiple resources (video, AI-generated text, code examples) to offer comprehensive coverage.

User Authentication & Authorization: Secure user sign-up and login functionality using JWT (JSON Web Tokens) for session management. Passwords are securely hashed using bcryptjs.

Course Customization: Users can define the course topic, provide details/objectives, select difficulty (Beginner, Intermediate, Advanced), set course duration, and specify the number of chapters.

Review & Edit Structure: Provides an interface for users to review and edit the AI-generated course structure (chapter titles, summaries, durations) before generating the final detailed content.

Course Dashboard: Displays all available courses (including user-created ones) in an easy-to-browse card format.

Interactive Course Viewing: Allows users to navigate through chapters and the multiple resources within each chapter sequentially.

MERN Stack Implementation: Built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

# Tech Stack

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

AI: Google Gemini AI API

Video Search: YouTube Data API v3

Authentication: JWT (JSON Web Tokens), bcryptjs (for password hashing)

Setup and Installation

Clone the repository:

git clone https://github.com/SanatKulkarni/AI-Powered-Course-Generator-MERN/
cd ai-powered-course-generator

# Install Backend Dependencies:

cd server # or your backend folder name
npm install


# Install Frontend Dependencies:

cd ../client # or your frontend folder name
npm install


# Environment Variables:

Create a .env file in the server (backend) directory.

Add the following required variables:

MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
GEMINI_API_KEY=<your_google_gemini_api_key>
YOUTUBE_API_KEY=<your_youtube_data_api_key>


Ensure you have obtained API keys from Google Cloud Platform for Gemini and YouTube Data API.

Run the application:

Start Backend Server:
npm start


Start Frontend Development Server:
cd ../client
npm start


Open your browser and navigate to http://localhost:3000 (or the port specified by React).

Usage

Sign Up / Sign In: Create a new account or log in with existing credentials.

Create Course: Navigate to the "Create Course" section.

Input Details: Fill in the course topic, details, difficulty level, duration, and number of chapters.

Generate Structure: Click "Create Course". The AI will generate the initial course structure.

Review & Edit: Review the generated chapters. You can modify titles, summaries, and durations on this screen if needed. Click "Save Course".

Generate Content: On the course overview page, click "Generate Course Content". The application will now use AI and YouTube API to populate each chapter with detailed content and video resources. This may take some time.

View Course: Once content generation is complete, click "View Chapter Content" for any chapter to start learning. Navigate through resources within a chapter using "Next Resource" and move between chapters using "Next Chapter".

Show Courses: View all created courses on the main dashboard.

Logout: End your session securely.
