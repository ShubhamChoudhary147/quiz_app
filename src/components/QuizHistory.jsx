import { useState, useEffect } from 'react';
import { getAttempts } from '../utils/db';
import { format } from 'date-fns';

function QuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    const loadAttempts = async () => {
      const history = await getAttempts(); // Fetch quiz attempt history from database
      setAttempts(history.reverse());  // Reverse the order to show the latest attempt first
    };
    loadAttempts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-in">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Quiz History</h2>
        {attempts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl animate-pulse">
            <p className="text-xl text-gray-500">No attempts yet. Take a quiz to see your history!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {attempts.map((attempt, index) => (
              <div
                key={index}
                onClick={() => setSelectedAttempt(selectedAttempt === attempt ? null : attempt)}
                className="group cursor-pointer transform transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 p-3 rounded-full">
                        <span className="text-2xl">
                          {attempt.score === attempt.totalQuestions ? '🏆' : '📝'}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          {attempt.score}/{attempt.totalQuestions}
                          <span className="ml-2 text-lg font-normal text-gray-500">
                            ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%)
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(attempt.timestamp), 'PPpp')}
                        </span>
                      </div>
                    </div>
                    <div className="transform transition-transform duration-300 group-hover:rotate-180">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {selectedAttempt === attempt && (
                    <div className="mt-4 animate-slide-in">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 p-4 rounded-xl">
                          <p className="text-2xl font-bold text-green-600">{attempt.stats.correct}</p>
                          <p className="text-md text-gray-600">Correct</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl">
                          <p className="text-2xl font-bold text-red-600">{attempt.stats.incorrect}</p>
                          <p className="text-md text-gray-600">Incorrect</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div 
                              className="bg-green-500 transition-all duration-1000"
                              style={{ width: `${(attempt.stats.correct / attempt.totalQuestions) * 100}%` }}
                            />
                            <div 
                              className="bg-red-500 transition-all duration-1000"
                              style={{ width: `${(attempt.stats.incorrect / attempt.totalQuestions) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-center space-x-4 mt-2 text-xs">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Correct
                          </span>
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            Incorrect
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizHistory;