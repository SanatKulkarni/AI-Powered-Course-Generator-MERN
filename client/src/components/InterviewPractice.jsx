import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker correctly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const InterviewPractice = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewAnalysis, setInterviewAnalysis] = useState(null);

  const convertPdfToImage = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      return canvas.toDataURL('image/png').split(',')[1];
    } catch (error) {
      console.error('PDF conversion error:', error);
      throw new Error('Failed to convert PDF to image');
    }
  };

  const analyzeResume = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const imageBase64 = await convertPdfToImage(file);
      
      const genAI = new GoogleGenerativeAI('AIzaSyAzJno6phNweWn4MMU4j6LUgcqDfTW_cDk');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png'
        }
      };

      const prompt = "Analyze this resume and provide: 1. Key skills and experiences 2. Potential interview questions based on the resume 3. Suggested areas to focus on during the interview";

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      setAnalysis(response.text());
    } catch (err) {
      setError('Error analyzing resume. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const startRecording = async () => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        const newAnswers = [...answers];
        newAnswers[currentQuestion] = transcript;
        setAnswers(newAnswers);
      };

      recognition.start();
      setRecognition(recognition);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      setRecognition(null);
    }
  };

  const generateQuestions = async (resumeAnalysis) => {
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyAzJno6phNweWn4MMU4j6LUgcqDfTW_cDk');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Generate exactly 5 interview questions based on this resume analysis. Return ONLY a JSON object in this exact format without any additional text:
        {
          "questions": [
            {
              "id": 1,
              "type": "technical",
              "question": "...",
              "category": "..."
            }
          ]
        }

        Resume Analysis:
        ${resumeAnalysis}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanedResponse = response.text().trim().replace(/^```json\n|\n```$/g, '');
      const questionsData = JSON.parse(cleanedResponse);
      setQuestions(questionsData.questions);
    } catch (err) {
      console.error('Question generation error:', err);
      setError('Error generating questions. Please try again.');
    }
  };

  const analyzeInterview = async () => {
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyAzJno6phNweWn4MMU4j6LUgcqDfTW_cDk');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Analyze these interview responses and provide:
        1. Overall Score (out of 100)
        2. Detailed feedback for each answer
        3. Communication style analysis
        4. Specific improvement tips
        5. Areas of strength
        
        Questions and Answers:
        ${questions.map((q, i) => `
          Question: ${q.question}
          Answer: ${answers[i] || 'No answer provided'}
        `).join('\n')}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setInterviewAnalysis(response.text());
    } catch (err) {
      setError('Error analyzing interview. Please try again.');
      console.error(err);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeInterview();
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    generateQuestions(analysis);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {!interviewStarted ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                AI Interview Practice
              </h1>
              {!analysis ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">
                      Upload your resume to start a personalized interview practice session
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200"
                    >
                      Upload Resume (PDF)
                    </label>
                  </div>
                  {file && (
                    <div className="text-center">
                      <button
                        onClick={analyzeResume}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        {loading ? 'Analyzing...' : 'Analyze Resume'}
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="text-red-500 text-center">{error}</div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
                    <div className="prose max-w-none">
                      {analysis.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={startInterview}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Start Interview Practice
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              {!interviewAnalysis ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Question {currentQuestion + 1} of {questions.length}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                          isRecording
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white transition duration-200`}
                      >
                        {isRecording ? (
                          <>
                            <span>Stop Recording</span>
                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                          </>
                        ) : (
                          <>
                            <span>Start Recording</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </>
                        )}
                      </button>
                      <button
                        onClick={nextQuestion}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        Next Question
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">
                      {questions[currentQuestion]?.question}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Type: {questions[currentQuestion]?.type}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Your Answer:</h3>
                    <p className="text-gray-700">
                      {answers[currentQuestion] || 'No answer recorded yet'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Interview Analysis</h2>
                  <div className="prose max-w-none">
                    {interviewAnalysis.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewPractice;