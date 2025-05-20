# AURA-LMS: Smart Course Generation and Learning Platform 

AURA-LMS is an innovative learning platform designed to make education more accessible, efficient, and personalized. It leverages Generative AI to automatically create comprehensive courses, provide interactive coding environments, and offer AI-driven interview practice, empowering users to learn smarter and faster.

![Screenshot 2025-05-20 214648](https://github.com/user-attachments/assets/e9a38173-c4da-434f-91d6-00d2332e5614)
![image](https://github.com/user-attachments/assets/b02c13e9-f716-4521-83d0-94b3acb14e2c)


## Key Features

*   **AI-Powered Course Generation:**
    *   Users can input a course topic, desired details (description, difficulty, duration, number of chapters).
    *   AURA-LMS utilizes Google Generative AI to create a structured course outline, including chapter titles, summaries, and estimated durations.
    *   Users can review and edit the AI-generated course structure before finalization.
*   **Interactive Course Content:**
    *   For each chapter, the AI curates relevant YouTube video resources.
    *   It also generates a textual summary, key learning points, and practical code examples related to the chapter's content.
    *   Users can navigate through multiple curated resources for each topic.
*   **Online Code Compiler:**
    *   Integrated compiler supporting multiple programming languages (Python, JavaScript, Java, C++).
    *   Allows users to practice coding directly within the platform, run their code, and see the output.
*   **AI Interview Practice:**
    *   Users can upload their resume (PDF format).
    *   The AI analyzes the resume using PDF.js and Generative AI to understand skills and experience.
    *   It then generates personalized interview questions (technical, behavioral, project-specific).
    *   Users can engage in a mock interview, providing answers via voice recording.
    *   The AI provides comprehensive feedback on responses, including an overall score, communication style analysis, and areas for improvement.
*   **Secure Authentication:**
    *   User registration and login system.
    *   Passwords hashed using bcrypt for security.
    *   JWT (JSON Web Tokens) for managing user sessions and authorization.
*   **User-Friendly Dashboard:**
    *   Displays all available courses, created by the user or others.
    *   Easy navigation to create new courses, access the code compiler, or start interview practice.

## Tech Stack

**Frontend (Client):**
*   **Framework/Build Tool:** React.js with Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **API Communication:** Axios
*   **Animations:** Framer Motion
*   **PDF Processing:** PDF.js (for resume analysis)

**Backend (Server):**
*   **Runtime/Framework:** Node.js & Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens), bcrypt (for password hashing)

**AI & Services:**
*   **Core AI:** Google Generative AI (for course generation, content creation, interview practice)
*   **Video Curation:** (Implicitly) YouTube Data API or similar for fetching video resources.

## Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
*   Node.js (v18.x or later recommended)
*   npm or yarn
*   MongoDB instance (local or cloud-based like MongoDB Atlas)

**Installation:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/aura-lms.git
    cd aura-lms
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_very_strong_jwt_secret
    GOOGLE_API_KEY=your_google_generative_ai_api_key
    # YOUTUBE_API_KEY=your_youtube_data_api_key (if used directly)
    PORT=5000 # Or your preferred port
    ```
    Start the backend server:
    ```bash
    npm start
    # or for development with nodemon
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```
    If your backend is running on a different port than the default proxy target in `vite.config.js`, update it accordingly.
    Start the frontend development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port Vite is running on).

## Usage

1.  **Sign Up / Sign In:** Create a new account or log in with existing credentials.
2.  **Create a Course:**
    *   Navigate to "Create Course".
    *   Fill in the course topic, details, difficulty, desired duration, and number of chapters.
    *   Click "Create Course" to let the AI generate the initial structure.
    *   Review and edit the chapter titles, summaries, and durations as needed.
    *   Save the course structure.
    *   Click "Generate Course Content" to populate chapters with videos, summaries, key points, and code examples.
3.  **View Courses:**
    *   Go to "Show Courses" to see all available courses.
    *   Click "View Course" on any course card to see its chapters.
    *   Click "View Chapter Content" to access the learning materials for a specific chapter.
4.  **Code Compiler:**
    *   Navigate to "Code Compiler".
    *   Select the programming language.
    *   Write your code in the editor.
    *   Provide any necessary input.
    *   Click "Run Code" to see the output.
5.  **AI Interview Practice:**
    *   Navigate to "Interview Practice".
    *   Upload your resume (PDF).
    *   Click "Analyze Resume". The AI will provide an initial analysis and potential question areas.
    *   Click "Start Interview Practice".
    *   The AI will ask questions one by one. Click "Start Recording" to record your answer using your microphone.
    *   Click "Stop Recording" when done, then "Next Question".
    *   After all questions, the AI will provide a detailed analysis of your performance.


## Acknowledgements

*   Google Generative AI
*   React Community
*   Node.js Community
*   MongoDB
*   And all the creators of the libraries and tools used in this project!
