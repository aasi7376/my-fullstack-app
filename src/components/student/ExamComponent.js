// src/components/student/ExamComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ExamComponent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeExam, setActiveExam] = useState(null);
  const [examInProgress, setExamInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [filterOption, setFilterOption] = useState('upcoming');
  const [confirmStart, setConfirmStart] = useState(false);
  const timerRef = useRef(null);
  
  // Fetch exams - in a real app, this would be an API call
  useEffect(() => {
    setTimeout(() => {
      const sampleExams = [
        {
          id: 1,
          title: 'Algebra Mid-Term',
          subject: 'Mathematics',
          description: 'This exam covers algebraic expressions, equations, inequalities, and functions.',
          duration: 60, // in minutes
          totalQuestions: 25,
          passingScore: 70,
          startDate: '2025-06-05T09:00:00',
          endDate: '2025-06-05T11:00:00',
          status: 'upcoming',
          questions: [
            {
              id: 1,
              question: 'Solve for x: 2x + 5 = 13',
              type: 'multiple-choice',
              options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
              answer: 'x = 4',
              points: 1
            },
            {
              id: 2,
              question: 'Factor the expression: x² - 9',
              type: 'multiple-choice',
              options: ['(x + 3)(x - 3)', '(x + 9)(x - 1)', '(x + 4.5)(x - 2)', '(x - 4.5)(x - 2)'],
              answer: '(x + 3)(x - 3)',
              points: 1
            },
            {
              id: 3,
              question: 'If f(x) = 3x² - 2x + 1, what is f(2)?',
              type: 'multiple-choice',
              options: ['7', '9', '11', '13'],
              answer: '9',
              points: 1
            },
            {
              id: 4,
              question: 'Solve the inequality: 3x - 7 > 5',
              type: 'multiple-choice',
              options: ['x > 4', 'x < 4', 'x > 5', 'x < 5'],
              answer: 'x > 4',
              points: 1
            },
            {
              id: 5,
              question: 'Which of the following represents a linear function?',
              type: 'multiple-choice',
              options: ['y = x²', 'y = 3x + 2', 'y = 1/x', 'y = √x'],
              answer: 'y = 3x + 2',
              points: 1
            }
          ]
        },
        {
          id: 2,
          title: 'Physics Final Exam',
          subject: 'Physics',
          description: 'Comprehensive exam covering mechanics, thermodynamics, waves, optics, and electromagnetism.',
          duration: 90, // in minutes
          totalQuestions: 30,
          passingScore: 65,
          startDate: '2025-06-10T13:00:00',
          endDate: '2025-06-10T15:30:00',
          status: 'upcoming',
          questions: [
            {
              id: 1,
              question: 'A 2 kg object is pushed with a force of 10 N. What is its acceleration?',
              type: 'multiple-choice',
              options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'],
              answer: '5 m/s²',
              points: 1
            },
            {
              id: 2,
              question: 'Which law states that for every action, there is an equal and opposite reaction?',
              type: 'multiple-choice',
              options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Conservation of Energy'],
              answer: 'Newton\'s Third Law',
              points: 1
            }
          ]
        },
        {
          id: 3,
          title: 'Literature Analysis Quiz',
          subject: 'Literature',
          description: 'Quiz on literary devices, character analysis, and theme identification.',
          duration: 45, // in minutes
          totalQuestions: 20,
          passingScore: 60,
          startDate: '2025-06-03T10:00:00',
          endDate: '2025-06-03T11:00:00',
          status: 'completed',
          result: {
            score: 85,
            totalPoints: 100,
            passedStatus: 'passed',
            completedAt: '2025-06-03T10:45:00',
            correctAnswers: 17,
            incorrectAnswers: 3,
            timeSpent: '40:15' // mm:ss
          }
        },
        {
          id: 4,
          title: 'Chemistry Quiz',
          subject: 'Chemistry',
          description: 'Quiz covering atomic structure, periodic table, and basic chemical reactions.',
          duration: 30, // in minutes
          totalQuestions: 15,
          passingScore: 70,
          startDate: '2025-06-01T14:00:00',
          endDate: '2025-06-01T15:00:00',
          status: 'completed',
          result: {
            score: 60,
            totalPoints: 100,
            passedStatus: 'failed',
            completedAt: '2025-06-01T14:28:00',
            correctAnswers: 9,
            incorrectAnswers: 6,
            timeSpent: '28:10' // mm:ss
          }
        }
      ];
      
      setExams(sampleExams);
      setLoading(false);
    }, 1000);
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Format timer function (convert seconds to mm:ss format)
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Check if an exam is currently available
  const isExamAvailable = (exam) => {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    return now >= startDate && now <= endDate;
  };
  
  // Start exam function
  const startExam = () => {
    if (!activeExam) return;
    
    setExamInProgress(true);
    setConfirmStart(false);
    setCurrentQuestion(0);
    setUserAnswers({});
    setTimeLeft(activeExam.duration * 60); // Convert minutes to seconds
    setExamCompleted(false);
    setExamResult(null);
  };
  
  // Submit exam function
  const submitExam = () => {
    if (!activeExam) return;
    
    // Clear the timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    
    activeExam.questions.forEach(question => {
      totalPoints += question.points;
      if (userAnswers[question.id] === question.answer) {
        correctAnswers += 1;
      }
    });
    
    const score = Math.round((correctAnswers / activeExam.questions.length) * 100);
    const passedStatus = score >= activeExam.passingScore ? 'passed' : 'failed';
    
    // Create result object
    const result = {
      score,
      totalPoints,
      passedStatus,
      completedAt: new Date().toISOString(),
      correctAnswers,
      incorrectAnswers: activeExam.questions.length - correctAnswers,
      timeSpent: formatTimer((activeExam.duration * 60) - timeLeft) // mm:ss
    };
    
    setExamResult(result);
    setExamCompleted(true);
    setExamInProgress(false);
    
    // Update exams list (in a real app, this would be an API call)
    const updatedExams = exams.map(exam => {
      if (exam.id === activeExam.id) {
        return {
          ...exam,
          status: 'completed',
          result
        };
      }
      return exam;
    });
    
    setExams(updatedExams);
  };
  
  // Timer functionality for exam
  useEffect(() => {
    if (examInProgress && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (examInProgress && timeLeft === 0) {
      // Time's up, submit the exam automatically
      submitExam();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [examInProgress, timeLeft]);
  
  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestion < activeExam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  // Navigate to previous question
  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  // Confirm exam submission
  const confirmSubmitExam = () => {
    if (window.confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
      submitExam();
    }
  };
  
  // Filter exams based on the selected filter
  const getFilteredExams = () => {
    return exams.filter(exam => exam.status === filterOption);
  };
  
  const filteredExams = getFilteredExams();
  
  // Render exam list
  const renderExamsList = () => {
    return (
      <div className="exams-container">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterOption === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilterOption('upcoming')}
          >
            Upcoming Exams
          </button>
          <button 
            className={`filter-tab ${filterOption === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterOption('completed')}
          >
            Completed Exams
          </button>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading exams...</div>
        ) : filteredExams.length === 0 ? (
          <div className="no-exams-message">
            No {filterOption} exams found.
          </div>
        ) : (
          <div className="exams-list">
            {filteredExams.map(exam => (
              <div 
                key={exam.id}
                className="exam-card"
                onClick={() => {
                  if (exam.status === 'upcoming' && isExamAvailable(exam)) {
                    setActiveExam(exam);
                    setConfirmStart(true);
                  } else if (exam.status === 'completed') {
                    setActiveExam(exam);
                    setExamResult(exam.result);
                    setExamCompleted(true);
                  }
                }}
              >
                <div className="exam-header">
                  <div className="exam-title">{exam.title}</div>
                  <div className="exam-subject">{exam.subject}</div>
                </div>
                <div className="exam-description">{exam.description}</div>
                <div className="exam-details">
                  <div className="exam-detail">
                    <span className="detail-label">Questions:</span>
                    <span className="detail-value">{exam.totalQuestions}</span>
                  </div>
                  <div className="exam-detail">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{exam.duration} mins</span>
                  </div>
                  <div className="exam-detail">
                    <span className="detail-label">Passing Score:</span>
                    <span className="detail-value">{exam.passingScore}%</span>
                  </div>
                </div>
                
                {exam.status === 'upcoming' ? (
                  <div className="exam-schedule">
                    <div className="schedule-item">
                      <span className="schedule-label">Date:</span>
                      <span className="schedule-value">{formatDate(exam.startDate)}</span>
                    </div>
                    <div className="schedule-item">
                      <span className="schedule-label">Time:</span>
                      <span className="schedule-value">{formatTime(exam.startDate)} - {formatTime(exam.endDate)}</span>
                    </div>
                    <div className="exam-availability">
                      {isExamAvailable(exam) ? (
                        <span className="available">Available Now</span>
                      ) : (
                        <span className="not-available">Not Yet Available</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="exam-result-preview">
                    <div className={`result-status ${exam.result.passedStatus}`}>
                      {exam.result.passedStatus === 'passed' ? 'Passed' : 'Failed'}
                    </div>
                    <div className="result-score">
                      <span className="score-label">Score:</span>
                      <span className="score-value">{exam.result.score}%</span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className="score-progress"
                        style={{ width: `${exam.result.score}%` }}
                      ></div>
                      <div 
                        className="passing-line"
                        style={{ left: `${exam.passingScore}%` }}
                      ></div>
                    </div>
                    <div className="completion-date">
                      Completed on {formatDate(exam.result.completedAt)}
                    </div>
                  </div>
                )}
                
                <button 
                  className="exam-action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (exam.status === 'upcoming' && isExamAvailable(exam)) {
                      setActiveExam(exam);
                      setConfirmStart(true);
                    } else if (exam.status === 'completed') {
                      setActiveExam(exam);
                      setExamResult(exam.result);
                      setExamCompleted(true);
                    }
                  }}
                >
                  {exam.status === 'upcoming' 
                    ? (isExamAvailable(exam) ? 'Start Exam' : 'View Details') 
                    : 'View Results'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render exam start confirmation
  const renderConfirmStart = () => {
    if (!activeExam) return null;
    
    return (
      <div className="confirm-start-container">
        <div className="confirm-start-card">
          <h2 className="confirm-title">{activeExam.title}</h2>
          <div className="confirm-subject">{activeExam.subject}</div>
          
          <div className="exam-instructions">
            <h3>Exam Instructions</h3>
            <ul>
              <li>This exam contains {activeExam.totalQuestions} questions.</li>
              <li>You have {activeExam.duration} minutes to complete the exam.</li>
              <li>The passing score is {activeExam.passingScore}%.</li>
              <li>You can navigate between questions using the navigation buttons.</li>
              <li>Your answers are automatically saved as you proceed.</li>
              <li>You can review your answers before submission.</li>
              <li>Once submitted, you cannot retake the exam.</li>
            </ul>
          </div>
          
          <div className="confirm-actions">
            <button 
              className="cancel-button"
              onClick={() => {
                setActiveExam(null);
                setConfirmStart(false);
              }}
            >
              Cancel
            </button>
            <button 
              className="start-button"
              onClick={startExam}
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render exam in progress
  const renderExamInProgress = () => {
    if (!activeExam || !examInProgress) return null;
    
    const currentQ = activeExam.questions[currentQuestion];
    const totalQuestions = activeExam.questions.length;
    
    // Check if the current question has been answered
    const isAnswered = userAnswers[currentQ.id] !== undefined;
    
    return (
      <div className="exam-in-progress">
        <div className="exam-header">
          <div className="exam-title">{activeExam.title}</div>
          <div className="exam-timer">
            <span className={`timer-value ${timeLeft < 60 ? 'warning' : ''}`}>
              <span className="timer-icon">⏱️</span>
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>
        
        <div className="exam-progress">
          <div className="progress-text">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-completed"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="question-container">
          <h3 className="question-text">{currentQ.question}</h3>
          
          <div className="answer-options">
            {currentQ.type === 'multiple-choice' && currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`answer-option ${userAnswers[currentQ.id] === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQ.id, option)}
              >
                <div className="option-selector">
                  {userAnswers[currentQ.id] === option && (
                    <div className="selector-filled"></div>
                  )}
                </div>
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="question-navigation">
          <div className="nav-buttons">
            <button
              className="nav-button prev"
              onClick={goToPrevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            {currentQuestion < totalQuestions - 1 ? (
              <button
                className="nav-button next"
                onClick={goToNextQuestion}
              >
                Next
              </button>
            ) : (
              <button
                className="nav-button submit"
                onClick={confirmSubmitExam}
              >
                Submit Exam
              </button>
            )}
          </div>
          
          <div className="question-dots">
            {activeExam.questions.map((_, index) => (
              <div
                key={index}
                className={`question-dot ${index === currentQuestion ? 'active' : ''} ${userAnswers[activeExam.questions[index].id] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render exam result
  const renderExamResult = () => {
    if (!activeExam || !examResult) return null;
    
    const isPassed = examResult.passedStatus === 'passed';
    
    return (
      <div className="exam-result">
        <button
          className="back-button"
          onClick={() => {
            setActiveExam(null);
            setExamResult(null);
            setExamCompleted(false);
            setFilterOption('completed');
          }}
        >
          ← Back to Exams
        </button>
        
        <div className="result-header">
          <div className="exam-icon">
            {isPassed ? '🏆' : '📝'}
          </div>
          
          <div className="result-info">
            <h2 className="result-title">{activeExam.title}</h2>
            <div className="result-subject">{activeExam.subject}</div>
            <div className="completion-date">
              Completed on {formatDate(examResult.completedAt)}
            </div>
          </div>
          
          <div className="result-score-display">
            <div className={`result-status ${examResult.passedStatus}`}>
              {isPassed ? 'Passed' : 'Failed'}
            </div>
            <div className="score-circle">
              <div className="score-value">
                {examResult.score}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="result-details">
          <div className="result-stats">
            <div className="stat-card">
              <div className="stat-icon correct">✓</div>
              <div className="stat-info">
                <span className="stat-label">Correct Answers</span>
                <span className="stat-value">{examResult.correctAnswers}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon incorrect">✗</div>
              <div className="stat-info">
                <span className="stat-label">Incorrect Answers</span>
                <span className="stat-value">{examResult.incorrectAnswers}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <span className="stat-label">Time Spent</span>
                <span className="stat-value">{examResult.timeSpent}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <span className="stat-label">Passing Score</span>
                <span className="stat-value">{activeExam.passingScore}%</span>
              </div>
            </div>
          </div>
          
          <div className="score-visualization">
            <h3>Score Breakdown</h3>
            <div className="score-bar large">
              <div 
                className="score-progress"
                style={{ 
                  width: `${examResult.score}%`,
                  backgroundColor: isPassed ? '#4caf50' : '#f44336'
                }}
              ></div>
              <div 
                className="passing-line"
                style={{ left: `${activeExam.passingScore}%` }}
              >
                <span className="passing-label">Pass</span>
              </div>
            </div>
            <div className="score-labels">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="result-feedback">
            <h3>Feedback</h3>
            <p>
              {isPassed 
                ? `Congratulations! You have successfully passed the ${activeExam.title}. You demonstrated good understanding of the ${activeExam.subject} concepts covered in this exam.`
                : `You did not pass the ${activeExam.title} this time. We recommend reviewing the ${activeExam.subject} material and trying again. Focus on improving your understanding of the key concepts.`}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="exam-component">
      <h1 className="section-title">📝 Online Exams</h1>
      
      {examInProgress ? renderExamInProgress() :
       examCompleted ? renderExamResult() :
       confirmStart ? renderConfirmStart() :
       renderExamsList()}
      
      <style jsx="true">{`
        .exam-component {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: white;
        }
        
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #00a5cf;
          border-bottom: 2px solid #00a5cf;
          padding-bottom: 10px;
        }
        
        /* Filter tabs */
        .filter-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(0, 165, 207, 0.3);
        }
        
        .filter-tab {
          padding: 10px 20px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.7;
          transition: all 0.2s ease;
        }
        
        .filter-tab:hover {
          opacity: 1;
        }
        
        .filter-tab.active {
          opacity: 1;
          border-bottom: 2px solid #00a5cf;
          color: #00a5cf;
        }
        
        /* Loading and empty states */
        .loading-message, .no-exams-message {
          padding: 20px;
          text-align: center;
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 8px;
          margin-top: 20px;
        }
        
        /* Exams list */
        .exams-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .exam-card {
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 10px;
          padding: 20px;
          border-left: 3px solid #00a5cf;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .exam-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          background-color: rgba(0, 165, 207, 0.15);
        }
        
        .exam-header {
          margin-bottom: 10px;
        }
        
        .exam-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #00a5cf;
        }
        
        .exam-subject {
          font-size: 0.9rem;
          opacity: 0.7;
        }
        
        .exam-description {
          font-size: 0.9rem;
          margin-bottom: 15px;
          line-height: 1.4;
        }
        
        .exam-details {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }
        
        .exam-detail {
          background-color: rgba(0, 165, 207, 0.1);
          padding: 5px 10px;
          border-radius: 5px;
        }
        
        .detail-label {
          opacity: 0.7;
          margin-right: 5px;
        }
        
        .detail-value {
          font-weight: bold;
        }
        
        .exam-schedule {
          margin-bottom: 15px;
          font-size: 0.9rem;
        }
        
        .schedule-item {
          margin-bottom: 5px;
        }
        
        .schedule-label {
          opacity: 0.7;
          margin-right: 5px;
        }
        
        .exam-availability {
          margin-top: 10px;
        }
        
        .available {
          color: #4caf50;
          font-weight: bold;
        }
        
        .not-available {
          color: #ff9800;
        }
        
        .exam-result-preview {
          margin-bottom: 15px;
        }
        
        .result-status {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .result-status.passed {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
          border: 1px solid #4caf50;
        }
        
        .result-status.failed {
          background-color: rgba(244, 67, 54, 0.1);
          color: #f44336;
          border: 1px solid #f44336;
        }
        
        .result-score {
          margin-bottom: 10px;
        }
        
        .score-label {
          opacity: 0.7;
          margin-right: 5px;
        }
        
        .score-value {
          font-weight: bold;
          color: #00a5cf;
        }
        
        .score-bar {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          position: relative;
          margin-bottom: 10px;
        }
        
        .score-progress {
          height: 100%;
          border-radius: 3px;
          background-color: #00a5cf;
        }
        
        .passing-line {
          position: absolute;
          top: -5px;
          width: 2px;
          height: 16px;
          background-color: #ff9800;
          z-index: 1;
        }
        
        .completion-date {
          font-size: 0.8rem;
          opacity: 0.7;
        }
        
        .exam-action-button {
          width: 100%;
          padding: 10px;
          background-color: #00a5cf;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 15px;
          transition: all 0.2s ease;
        }
        
        .exam-action-button:hover {
          background-color: #0090b3;
        }
        
        /* Confirm start screen */
        .confirm-start-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        
        .confirm-start-card {
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 10px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
          border-left: 3px solid #00a5cf;
        }
        
        .confirm-title {
          font-size: 1.5rem;
          color: #00a5cf;
          margin-bottom: 5px;
        }
        
        .confirm-subject {
          font-size: 1rem;
          opacity: 0.7;
          margin-bottom: 20px;
        }
        
        .exam-instructions {
          margin-bottom: 30px;
        }
        
        .exam-instructions h3 {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: #00a5cf;
        }
        
        .exam-instructions ul {
          list-style-type: none;
          padding: 0;
        }
        
        .exam-instructions li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        
        .exam-instructions li:before {
          content: "•";
          color: #00a5cf;
          position: absolute;
          left: 0;
          font-size: 1.2rem;
        }
        
        .confirm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
        }
        
        .cancel-button, .start-button {
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        
        .cancel-button {
          background-color: transparent;
          border: 1px solid #00a5cf;
          color: #00a5cf;
        }
        
        .cancel-button:hover {
          background-color: rgba(0, 165, 207, 0.1);
        }
        
        .start-button {
          background-color: #00a5cf;
          border: none;
          color: white;
        }
        
        .start-button:hover {
          background-color: #0090b3;
        }
        
        /* Exam in progress */
        .exam-in-progress {
          background-color: rgba(0, 165, 207, 0.05);
          border-radius: 10px;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(0, 165, 207, 0.3);
        }
        
        .exam-timer {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .timer-value {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .timer-value.warning {
          color: #f44336;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .exam-progress {
          margin-bottom: 20px;
        }
        
        .progress-text {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }
        
        .progress-bar {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .progress-completed {
          height: 100%;
          border-radius: 3px;
          background-color: #00a5cf;
        }
        
        .question-container {
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .question-text {
          font-size: 1.2rem;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .answer-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .answer-option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background-color: rgba(0, 165, 207, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .answer-option:hover {
          background-color: rgba(0, 165, 207, 0.1);
        }
        
        .answer-option.selected {
          background-color: rgba(0, 165, 207, 0.15);
          border: 1px solid #00a5cf;
        }
        
        .option-selector {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 165, 207, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .selector-filled {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #00a5cf;
        }
        
        .option-text {
          flex: 1;
        }
        
        .question-navigation {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .nav-buttons {
          display: flex;
          justify-content: space-between;
        }
        
        .nav-button {
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
          border: none;
        }
        
        .nav-button.prev {
          background-color: rgba(0, 165, 207, 0.1);
          color: white;
        }
        
        .nav-button.prev:hover {
          background-color: rgba(0, 165, 207, 0.2);
        }
        
        .nav-button.next {
          background-color: #00a5cf;
          color: white;
        }
        
        .nav-button.next:hover {
          background-color: #0090b3;
        }
        
        .nav-button.submit {
          background-color: #4caf50;
          color: white;
        }
        
        .nav-button.submit:hover {
          background-color: #43a047;
        }
        
        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .question-dots {
          display: flex;
          justify-content: center;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .question-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
        }
        
        .question-dot.active {
          background-color: #00a5cf;
          transform: scale(1.2);
        }
        
        .question-dot.answered {
          background-color: rgba(0, 165, 207, 0.5);
        }
        
        /* Exam result */
        .exam-result {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .back-button {
          display: inline-block;
          padding: 8px 15px;
          background-color: transparent;
          border: 1px solid #00a5cf;
          color: #00a5cf;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.2s ease;
        }
        
        .back-button:hover {
          background-color: rgba(0, 165, 207, 0.1);
        }
        
        .result-header {
          display: flex;
          align-items: center;
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 3px solid #00a5cf;
        }
        
        .exam-icon {
          font-size: 2.5rem;
          margin-right: 20px;
        }
        
        .result-info {
          flex: 1;
        }
        
        .result-title {
          font-size: 1.5rem;
          margin: 0 0 5px;
          color: #00a5cf;
        }
        
        .result-subject {
          font-size: 1rem;
          opacity: 0.7;
          margin-bottom: 5px;
        }
        
        .result-score-display {
          text-align: center;
          margin-left: 20px;
        }
        
        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #00a5cf;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          background-color: rgba(0, 165, 207, 0.1);
        }
        
        .score-circle .score-value {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .result-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .result-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 15px;
        }
        
        .stat-card {
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 8px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(0, 165, 207, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .stat-icon.correct {
          background-color: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        
        .stat-icon.incorrect {
          background-color: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
        
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.7;
        }
        
        .stat-value {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .score-visualization {
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 10px;
          padding: 20px;
        }
        
        .score-visualization h3 {
          margin-bottom: 15px;
          color: #00a5cf;
        }
        
        .score-bar.large {
          height: 15px;
          margin-bottom: 10px;
        }
        
        .score-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          opacity: 0.7;
        }
        
        .passing-line {
          position: absolute;
          top: -5px;
          width: 2px;
          height: 25px;
          background-color: #ff9800;
        }
        
        .passing-line .passing-label {
          position: absolute;
          top: -20px;
          left: -15px;
          font-size: 0.8rem;
          color: #ff9800;
        }
        
        .result-feedback {
          background-color: rgba(0, 165, 207, 0.1);
          border-radius: 10px;
          padding: 20px;
        }
        
        .result-feedback h3 {
          margin-bottom: 15px;
          color: #00a5cf;
        }
        
        .result-feedback p {
          line-height: 1.6;
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .exam-header, .result-header {
            flex-direction: column;
            text-align: center;
          }
          
          .exam-icon, .result-score-display {
            margin: 0 0 15px;
          }
          
          .nav-buttons {
            flex-direction: column;
            gap: 10px;
          }
          
          .nav-button {
            width: 100%;
          }
          
          .exams-list {
            grid-template-columns: 1fr;
          }
          
          .result-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ExamComponent;