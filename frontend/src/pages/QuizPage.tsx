import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, AlertCircle, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert } from '../components/ui/alert';

// Types
interface QuizQuestion {
  id: number;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | number;
  points: number;
  explanation?: string;
}

interface Quiz {
  id: number;
  lessonId: number;
  courseId: number;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  questions: QuizQuestion[];
  attempts: number;
  maxAttempts?: number;
}

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  // State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string | number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Mock quiz data (replace with API call)
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await api.get(API.QUIZ.GET_BY_ID(quizId));
        
        // Mock data
        const mockQuiz: Quiz = {
          id: parseInt(quizId || '1'),
          lessonId: 1,
          courseId: 1,
          title: 'Introduction to React Hooks',
          description: 'Test your knowledge of React Hooks including useState, useEffect, and custom hooks.',
          timeLimit: 30,
          passingScore: 70,
          attempts: 0,
          maxAttempts: 3,
          questions: [
            {
              id: 1,
              question: 'What is the primary purpose of the useState hook in React?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'To fetch data from an API',
                'To manage component state',
                'To handle side effects',
                'To optimize performance'
              ],
              correctAnswer: 1,
              points: 10,
              explanation: 'useState is used to add state management to functional components. It returns a state value and a function to update it.'
            },
            {
              id: 2,
              question: 'When does the useEffect hook run by default?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'Only on component mount',
                'Only on component unmount',
                'After every render',
                'Only when dependencies change'
              ],
              correctAnswer: 2,
              points: 10,
              explanation: 'By default, useEffect runs after every render. You can control this behavior using the dependency array.'
            },
            {
              id: 3,
              question: 'React Hooks can only be called at the top level of a component.',
              type: 'TRUE_FALSE',
              options: ['True', 'False'],
              correctAnswer: 0,
              points: 10,
              explanation: 'This is one of the Rules of Hooks. Hooks must be called at the top level, not inside loops, conditions, or nested functions.'
            },
            {
              id: 4,
              question: 'Which hook would you use to access the previous value of a state or prop?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'useState',
                'useEffect',
                'useRef',
                'useMemo'
              ],
              correctAnswer: 2,
              points: 15,
              explanation: 'useRef can store a mutable value that persists across renders without causing re-renders, making it perfect for tracking previous values.'
            },
            {
              id: 5,
              question: 'What does the cleanup function in useEffect do?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'It prevents memory leaks',
                'It runs before the component unmounts',
                'It cancels subscriptions or timers',
                'All of the above'
              ],
              correctAnswer: 3,
              points: 15,
              explanation: 'The cleanup function in useEffect runs before the component unmounts and before the effect runs again, helping prevent memory leaks and clean up resources.'
            },
            {
              id: 6,
              question: 'Custom hooks must start with the word "use".',
              type: 'TRUE_FALSE',
              options: ['True', 'False'],
              correctAnswer: 0,
              points: 10,
              explanation: 'This is a convention that React uses to identify hooks. It allows React to automatically check for violations of the Rules of Hooks.'
            },
            {
              id: 7,
              question: 'Which hook is used to optimize expensive calculations?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'useCallback',
                'useMemo',
                'useEffect',
                'useReducer'
              ],
              correctAnswer: 1,
              points: 15,
              explanation: 'useMemo is used to memoize expensive calculations so they only re-run when dependencies change, improving performance.'
            },
            {
              id: 8,
              question: 'The useContext hook is used for state management.',
              type: 'TRUE_FALSE',
              options: ['True', 'False'],
              correctAnswer: 1,
              points: 10,
              explanation: 'useContext is used to access context values, not directly for state management. However, it can be combined with useState or useReducer for global state management.'
            },
            {
              id: 9,
              question: 'What does useCallback return?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'A memoized value',
                'A memoized function',
                'A state value',
                'A ref object'
              ],
              correctAnswer: 1,
              points: 10,
              explanation: 'useCallback returns a memoized version of the callback function that only changes if one of the dependencies has changed.'
            },
            {
              id: 10,
              question: 'Can you call hooks conditionally?',
              type: 'TRUE_FALSE',
              options: ['True', 'False'],
              correctAnswer: 1,
              points: 5,
              explanation: 'No, hooks cannot be called conditionally. This is one of the fundamental Rules of Hooks to ensure hooks are called in the same order on every render.'
            }
          ]
        };

        setQuiz(mockQuiz);
        if (mockQuiz.timeLimit) {
          setTimeRemaining(mockQuiz.timeLimit * 60); // Convert to seconds
        }
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev !== null && prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // Handle answer selection
  const handleAnswerChange = (questionId: number, answer: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Calculate score
  const calculateScore = (): number => {
    if (!quiz) return 0;
    
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
        earnedPoints += question.points;
      }
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    const finalScore = calculateScore();

    setScore(finalScore);
    setIsSubmitted(true);

    // TODO: Submit to backend
    // try {
    //   await api.post(API.QUIZ.SUBMIT, {
    //     quizId: quiz.id,
    //     answers,
    //     score: finalScore,
    //     passed: finalScore >= quiz.passingScore,
    //     startTime: new Date(),
    //     endTime: new Date()
    //   });
    // } catch (err) {
    //   setError('Failed to submit quiz. Please try again.');
    // }
  };

  // Navigate questions
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if answer is correct
  const isAnswerCorrect = (questionId: number): boolean => {
    const question = quiz?.questions.find((q) => q.id === questionId);
    return question ? answers[questionId] === question.correctAnswer : false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error || 'Quiz not found'}</p>
          </Alert>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  // Results view
  if (isSubmitted && score !== null) {
    const passed = score >= quiz.passingScore;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center">
              {passed ? (
                <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-20 w-20 text-orange-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold mb-2">
                {passed ? 'Congratulations! 🎉' : 'Quiz Completed'}
              </h1>
              <p className="text-gray-600 mb-6">
                {passed
                  ? `You passed with a score of ${score}%!`
                  : `You scored ${score}%. Keep practicing!`}
              </p>

              {/* Score Display */}
              <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">{score}%</div>
                  <div className="text-sm text-gray-500 mt-1">Your Score</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-400">{quiz.passingScore}%</div>
                  <div className="text-sm text-gray-500 mt-1">Passing Score</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(answers).filter((_, idx) => 
                      isAnswerCorrect(quiz.questions[idx].id)
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {quiz.questions.length - Object.values(answers).filter((_, idx) => 
                      isAnswerCorrect(quiz.questions[idx].id)
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {quiz.questions.length}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>

              {/* Retry info */}
              {!passed && quiz.maxAttempts && quiz.attempts < quiz.maxAttempts && (
                <Alert variant="warning" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <p>
                    You have {quiz.maxAttempts - quiz.attempts} attempt(s) remaining.
                  </p>
                </Alert>
              )}
            </div>
          </div>

          {/* Review Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Review Your Answers</h2>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = isAnswerCorrect(question.id);

                return (
                  <div
                    key={question.id}
                    className={`p-6 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            Question {index + 1}: {question.question}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {question.points} pts
                          </span>
                        </div>

                        {/* Options display */}
                        {question.options && (
                          <div className="space-y-2 mt-4">
                            {question.options.map((option, optionIndex) => {
                              const isUserAnswer = userAnswer === optionIndex;
                              const isCorrectAnswer = question.correctAnswer === optionIndex;

                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    isCorrectAnswer
                                      ? 'border-green-500 bg-green-100'
                                      : isUserAnswer
                                      ? 'border-red-500 bg-red-100'
                                      : 'border-gray-200 bg-white'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {isCorrectAnswer && (
                                      <span className="text-xs text-green-700 font-medium">
                                        Correct Answer
                                      </span>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <span className="text-xs text-red-700 font-medium">
                                        Your Answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">
                              Explanation:
                            </h4>
                            <p className="text-blue-800 text-sm">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Back to Lesson
            </button>
            {!passed && quiz.maxAttempts && quiz.attempts < quiz.maxAttempts && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">{quiz.description}</p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <span
                  className={`font-mono font-bold ${
                    timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span>
                {answeredCount} / {quiz.questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {currentQuestion.question}
            </h2>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {currentQuestion.points} points
            </span>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(currentQuestion.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentQuestion.id] === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQuestion.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`aspect-square rounded-lg font-medium text-sm transition ${
                  currentQuestionIndex === index
                    ? 'bg-blue-600 text-white'
                    : answers[quiz.questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={answeredCount < quiz.questions.length}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Warning if not all answered */}
        {answeredCount < quiz.questions.length && (
          <Alert variant="warning" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <p>
              You have {quiz.questions.length - answeredCount} unanswered question
              {quiz.questions.length - answeredCount !== 1 ? 's' : ''}. Make sure to
              answer all questions before submitting.
            </p>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
