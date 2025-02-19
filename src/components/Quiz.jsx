import { useState, useEffect, useRef } from 'react';
import { saveAttempt } from '../utils/db';

const QUESTION_TIMEOUT = 30; // seconds per question
const WARNING_TIME = 10; // seconds when timer turns red

function Quiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMEOUT);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= WARNING_TIME) {
            setIsTimeWarning(true);
          }
          if (newTime <= 0) {
            handleAnswerTimeout();
            clearInterval(timerRef.current);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, timerActive]);

  const handleAnswerTimeout = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      setTimerActive(false);
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = {
        questionId: questions[currentQuestion].id,
        selectedAnswer: null,
        isCorrect: false,
        skipped: false
      };
      setAnswers(newAnswers);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return;
    
    setTimerActive(false);
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion].id,
      selectedAnswer: answerIndex,
      isCorrect,
      skipped: false
    };
    setAnswers(newAnswers);
  };

  const handleNavigateQuestion = (direction) => {
    const nextIndex = direction === 'next' 
      ? currentQuestion + 1 
      : currentQuestion - 1;

    if (nextIndex >= 0 && nextIndex < questions.length) {
      setCurrentQuestion(nextIndex);
      setSelectedAnswer(answers[nextIndex]?.selectedAnswer ?? null);
      setShowFeedback(answers[nextIndex] !== null);
      setTimeLeft(QUESTION_TIMEOUT);
      setIsTimeWarning(false);
      setTimerActive(!answers[nextIndex]);
    } else if (nextIndex >= questions.length) {
      const stats = calculateQuizStats();
      const attempt = {
        score,
        totalQuestions: questions.length,
        answers,
        timestamp: new Date().toISOString(),
        stats
      };
      saveAttempt(attempt);
      onComplete(attempt);
    }
  };

  const calculateQuizStats = () => {
    const attempted = answers.filter(a => a && !a.skipped).length;
    const correct = answers.filter(a => a?.isCorrect).length;
    const incorrect = attempted - correct;

    return {
      attempted,
      unattempted: questions.length - attempted,
      correct,
      incorrect
    };
  };

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl animate-slide-in">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold bg-blue-50 px-4 py-2 rounded-full">
            Question {currentQuestion + 1}/{questions.length}
          </span>
          <span className={`text-xl font-semibold px-4 py-2 rounded-full ${
            isTimeWarning ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'
          }`}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isTimeWarning ? 'animate-pulse-red' : 'bg-blue-500'
            }`}
            style={{ width: `${(timeLeft / QUESTION_TIMEOUT) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{question.question}</h2>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              className={`w-full p-6 text-left rounded-xl transition-all duration-300 transform hover:scale-[1.01] ${
                showFeedback
                  ? index === question.correctAnswer
                    ? 'bg-green-50 border-green-500 border-2 animate-bounce-once'
                    : index === selectedAnswer
                    ? 'bg-red-50 border-red-500 border-2 animate-shake'
                    : 'bg-gray-50 border border-gray-200'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-blue-300'
              } ${
                selectedAnswer === index ? 'ring-2 ring-blue-300' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className="mb-8 transform transition-all duration-300 animate-slide-in">
          <div className={`p-6 rounded-xl ${
            selectedAnswer === question.correctAnswer
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <p className="text-xl font-semibold mb-2">
              {selectedAnswer === question.correctAnswer
                ? '✨ Correct!'
                : '❌ Incorrect!'}
            </p>
            <p className="text-gray-700">{question.explanation}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <p className="text-xl font-semibold text-gray-700">
            Score: {score}/{questions.length}
          </p>
          {showFeedback && (
            <button
              onClick={() => handleNavigateQuestion('next')}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold transform transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 animate-slide-in"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;