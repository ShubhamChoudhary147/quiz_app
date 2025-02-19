import { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import QuizHistory from './components/QuizHistory';
import { quizQuestions } from './data/quizData';

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleQuizComplete = (attempt) => {
    setLastAttempt(attempt);
    setQuizComplete(true);
  };

  const startNewQuiz = () => {
    setQuizComplete(false);
    setLastAttempt(null);
  };

  return (
    <div className="min-h-screen bg-gray-200 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-12 animate-slide-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-10">
           Quiz Challenge
          </h1>
          <div className="inline-flex space-x-4 bg-white p-2 rounded-xl shadow-lg">
            <button
              onClick={() => setShowHistory(false)}
              className={`px-6 py-3 text-lg rounded-lg font-semibold transition-all duration-300 ${
                !showHistory
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Take Quiz
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`px-6 py-3 text-lg rounded-lg font-semibold transition-all duration-300 ${
                showHistory
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              View History
            </button>
          </div>
        </header>

        {showHistory ? (
          <QuizHistory />
        ) : quizComplete ? (
          <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center animate-slide-in">
            <div className="mb-8">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {lastAttempt.score}/{lastAttempt.totalQuestions}
                  </p>
                  <p className="text-gray-600">Total Score</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((lastAttempt.score / lastAttempt.totalQuestions) * 100)}%
                  </p>
                  <p className="text-gray-600">Percentage</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {lastAttempt.stats.correct}
                  </p>
                  <p className="text-gray-600">Correct</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-red-600">
                    {lastAttempt.stats.incorrect}
                  </p>
                  <p className="text-gray-600">Incorrect</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <h3 className="text-xl font-semibold mb-2">Performance Analysis</h3>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div 
                      className="bg-green-500 transition-all duration-1000"
                      style={{ width: `${(lastAttempt.stats.correct / lastAttempt.totalQuestions) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500 transition-all duration-1000"
                      style={{ width: `${(lastAttempt.stats.incorrect / lastAttempt.totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mt-2 text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                    Correct
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                    Incorrect
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={startNewQuiz}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold transform transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Take Another Quiz
            </button>
          </div>
        ) : !quizStarted ? (
          <div className="flex justify-center items-center h-64">
            <button
              onClick={() => setQuizStarted(true)}
              className="px-10 py-5 md:px-12 md:py-6 lg:px-16 lg:py-8 text-xl md:text-2xl lg:text-3xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95"
            >
              🚀 Start Quiz
            </button>
          </div>
        ) : (
          <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
        )}
      </div>
    </div>
  );
}

export default App;