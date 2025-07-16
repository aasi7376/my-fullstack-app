// src/components/student/ExamResultsComponent.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PerformanceChart from '../charts/PerformanceChart';
import './ExamResultsComponent.css'; // Import the CSS file

const ExamResultsComponent = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [showAnswers, setShowAnswers] = useState(false);
  
  // Fetch exam results - in a real app, this would be an API call
  useEffect(() => {
    setTimeout(() => {
      const sampleResults = [
        {
          id: 1,
          examId: 3,
          examTitle: 'Literature Analysis Quiz',
          subject: 'Literature',
          description: 'Quiz on literary devices, character analysis, and theme identification.',
          date: '2025-06-03T10:45:00',
          score: 85,
          passingScore: 60,
          passedStatus: 'passed',
          totalQuestions: 20,
          correctAnswers: 17,
          incorrectAnswers: 3,
          timeSpent: '40:15', // mm:ss
          questions: [
            {
              id: 1,
              question: 'Which of the following is a simile?',
              correctAnswer: 'Her eyes were like stars.',
              userAnswer: 'Her eyes were like stars.',
              isCorrect: true,
              explanation: 'A simile is a figure of speech that compares two different things using "like" or "as". The phrase "eyes were like stars" uses "like" to make the comparison.'
            },
            {
              id: 2,
              question: 'Who wrote "To Kill a Mockingbird"?',
              correctAnswer: 'Harper Lee',
              userAnswer: 'Harper Lee',
              isCorrect: true,
              explanation: '"To Kill a Mockingbird" was written by Harper Lee and published in 1960.'
            },
            {
              id: 3,
              question: 'What literary device is used in "The curtain of night fell upon the city"?',
              correctAnswer: 'Metaphor',
              userAnswer: 'Metaphor',
              isCorrect: true,
              explanation: 'This is a metaphor because it directly compares night to a curtain without using "like" or "as".'
            },
            {
              id: 4,
              question: 'Which of the following is an example of alliteration?',
              correctAnswer: 'She sells seashells by the seashore.',
              userAnswer: 'She sells seashells by the seashore.',
              isCorrect: true,
              explanation: 'Alliteration is the repetition of the same sound at the beginning of closely connected words. In this example, the "s" sound is repeated.'
            },
            {
              id: 5,
              question: 'What is the main theme of "Romeo and Juliet"?',
              correctAnswer: 'Tragic love',
              userAnswer: 'Family conflict',
              isCorrect: false,
              explanation: 'While family conflict is present in "Romeo and Juliet," the central theme is tragic love - the doomed romance between the main characters.'
            }
          ],
          strengths: ['Literary devices', 'Author identification', 'Theme analysis'],
          weaknesses: ['Character motivation analysis'],
          recommendations: [
            'Review character analysis techniques',
            'Practice identifying themes in complex narratives'
          ]
        },
        {
          id: 2,
          examId: 4,
          examTitle: 'Chemistry Quiz',
          subject: 'Chemistry',
          description: 'Quiz covering atomic structure, periodic table, and basic chemical reactions.',
          date: '2025-06-01T14:28:00',
          score: 60,
          passingScore: 70,
          passedStatus: 'failed',
          totalQuestions: 15,
          correctAnswers: 9,
          incorrectAnswers: 6,
          timeSpent: '28:10', // mm:ss
          questions: [
            {
              id: 1,
              question: 'What is the atomic number of oxygen?',
              correctAnswer: '8',
              userAnswer: '8',
              isCorrect: true,
              explanation: 'The atomic number of oxygen is 8, which represents the number of protons in the nucleus of an oxygen atom.'
            },
            {
              id: 2,
              question: 'Which of the following is a noble gas?',
              correctAnswer: 'Argon',
              userAnswer: 'Argon',
              isCorrect: true,
              explanation: 'Argon is a noble gas found in group 18 of the periodic table.'
            },
            {
              id: 3,
              question: 'What is the chemical formula for sulfuric acid?',
              correctAnswer: 'H₂SO₄',
              userAnswer: 'H₂SO₃',
              isCorrect: false,
              explanation: 'The chemical formula for sulfuric acid is H₂SO₄. H₂SO₃ is the formula for sulfurous acid.'
            }
          ],
          strengths: ['Atomic structure', 'Periodic table'],
          weaknesses: ['Chemical formulas', 'Balancing equations', 'Acid-base reactions'],
          recommendations: [
            'Review chemical formulas for common compounds',
            'Practice balancing chemical equations',
            'Study acid-base reaction principles'
          ]
        },
        {
          id: 3,
          examId: 6,
          examTitle: 'Geometry Assessment',
          subject: 'Mathematics',
          description: 'Assessment on geometry concepts including triangles, circles, and polygons.',
          date: '2025-05-15T13:15:00',
          score: 78,
          passingScore: 75,
          passedStatus: 'passed',
          totalQuestions: 20,
          correctAnswers: 15,
          incorrectAnswers: 5,
          timeSpent: '45:30', // mm:ss
          questions: [
            {
              id: 1,
              question: 'What is the formula for the area of a circle?',
              correctAnswer: 'πr²',
              userAnswer: 'πr²',
              isCorrect: true,
              explanation: 'The area of a circle is calculated using the formula πr², where r is the radius of the circle.'
            },
            {
              id: 2,
              question: 'What is the sum of interior angles in a triangle?',
              correctAnswer: '180°',
              userAnswer: '180°',
              isCorrect: true,
              explanation: 'The sum of interior angles in a triangle is always 180 degrees.'
            },
            {
              id: 3,
              question: 'In a right triangle, what is the relationship between the sides according to the Pythagorean theorem?',
              correctAnswer: 'a² + b² = c²',
              userAnswer: 'a² + b² = c²',
              isCorrect: true,
              explanation: 'The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse (c) is equal to the sum of squares of the other two sides (a and b).'
            },
            {
              id: 4,
              question: 'What is the formula for the volume of a sphere?',
              correctAnswer: '(4/3)πr³',
              userAnswer: '(4/3)πr³',
              isCorrect: true,
              explanation: 'The volume of a sphere is calculated using the formula (4/3)πr³, where r is the radius of the sphere.'
            },
            {
              id: 5,
              question: 'What is the formula for the area of a trapezoid?',
              correctAnswer: '(1/2)h(a+b)',
              userAnswer: '(1/2)h(a+b)',
              isCorrect: true,
              explanation: 'The area of a trapezoid is calculated as half the product of the height (h) and the sum of the parallel sides (a and b).'
            },
            {
              id: 6,
              question: 'What is the measure of each interior angle in a regular hexagon?',
              correctAnswer: '120°',
              userAnswer: '120°',
              isCorrect: true,
              explanation: 'For a regular polygon with n sides, each interior angle measures (n-2)×180°/n. For a hexagon (n=6), this is (6-2)×180°/6 = 4×180°/6 = 120°.'
            },
            {
              id: 7,
              question: 'What is the relationship between the radius (r) and diameter (d) of a circle?',
              correctAnswer: 'd = 2r',
              userAnswer: 'd = 2r',
              isCorrect: true,
              explanation: 'The diameter of a circle is twice the length of its radius.'
            },
            {
              id: 8,
              question: 'What is the formula for the surface area of a cube with side length s?',
              correctAnswer: '6s²',
              userAnswer: '6s²',
              isCorrect: true,
              explanation: 'A cube has 6 faces, each with area s². Therefore, the total surface area is 6s².'
            },
            {
              id: 9,
              question: 'According to the law of cosines, in a triangle with sides a, b, c and angle C (opposite to side c), what is the relationship?',
              correctAnswer: 'c² = a² + b² - 2ab cos(C)',
              userAnswer: 'c² = a² + b² - 2ab cos(C)',
              isCorrect: true,
              explanation: 'The law of cosines generalizes the Pythagorean theorem to any triangle, relating the squares of the sides to the cosine of one angle.'
            },
            {
              id: 10,
              question: 'What is the value of sin(30°)?',
              correctAnswer: '1/2',
              userAnswer: '1/2',
              isCorrect: true,
              explanation: 'The sine of 30° (or π/6 radians) is exactly 1/2, which can be derived from the unit circle or a 30-60-90 right triangle.'
            },
            {
              id: 11,
              question: 'If two triangles are similar, what is true about their corresponding sides?',
              correctAnswer: 'They are proportional',
              userAnswer: 'They are proportional',
              isCorrect: true,
              explanation: 'In similar triangles, the ratios of corresponding sides are equal, meaning the sides are proportional.'
            },
            {
              id: 12,
              question: 'What is the formula for the area of a regular polygon with n sides, where s is the side length and a is the apothem?',
              correctAnswer: '(1/2) × n × s × a',
              userAnswer: 'n × s × a',
              isCorrect: false,
              explanation: 'The area of a regular polygon is (1/2) × perimeter × apothem. Since the perimeter is n×s, the formula becomes (1/2) × n × s × a.'
            }
          ],
          strengths: ['Circle geometry', 'Triangle properties', 'Basic geometric formulas'],
          weaknesses: ['Complex polygon problems', 'Coordinate geometry', 'Advanced geometric proofs'],
          recommendations: [
            'Practice problems involving complex polygons',
            'Review coordinate geometry concepts',
            'Work on area and volume calculations for complex shapes'
          ]
        },
        {
          id: 4,
          examId: 7,
          examTitle: 'Physics Mechanics Test',
          subject: 'Physics',
          description: 'Test covering Newtonian mechanics, forces, and motion.',
          date: '2025-05-10T11:45:00',
          score: 88,
          passingScore: 65,
          passedStatus: 'passed',
          totalQuestions: 25,
          correctAnswers: 22,
          incorrectAnswers: 3,
          timeSpent: '52:15', // mm:ss
          questions: [
            {
              id: 1,
              question: 'What is Newton\'s Second Law of Motion?',
              correctAnswer: 'F = ma',
              userAnswer: 'F = ma',
              isCorrect: true,
              explanation: 'Newton\'s Second Law states that force equals mass times acceleration (F = ma).'
            }
          ],
          strengths: ['Newtonian mechanics', 'Force calculations', 'Motion analysis'],
          weaknesses: ['Complex applications of multiple forces'],
          recommendations: [
            'Practice problems involving multiple forces acting on an object',
            'Review real-world applications of mechanics principles'
          ]
        },
        {
          id: 5,
          examId: 8,
          examTitle: 'Algebra Fundamentals',
          subject: 'Mathematics',
          description: 'Assessment covering algebraic expressions, equations, functions, and problem-solving.',
          date: '2025-05-25T09:30:00',
          score: 92,
          passingScore: 70,
          passedStatus: 'passed',
          totalQuestions: 20,
          correctAnswers: 18,
          incorrectAnswers: 2,
          timeSpent: '38:45', // mm:ss
          questions: [
            {
              id: 1,
              question: 'Solve for x: 3x + 7 = 22',
              correctAnswer: 'x = 5',
              userAnswer: 'x = 5',
              isCorrect: true,
              explanation: 'To solve, subtract 7 from both sides: 3x = 15, then divide both sides by 3: x = 5.'
            },
            {
              id: 2,
              question: 'Simplify the expression: 2(x + 3) - 4(x - 1)',
              correctAnswer: '-2x + 10',
              userAnswer: '-2x + 10',
              isCorrect: true,
              explanation: '2(x + 3) - 4(x - 1) = 2x + 6 - 4x + 4 = -2x + 10'
            },
            {
              id: 3,
              question: 'Factor completely: x² - 9',
              correctAnswer: '(x + 3)(x - 3)',
              userAnswer: '(x + 3)(x - 3)',
              isCorrect: true,
              explanation: 'x² - 9 is a difference of squares, which factors as (x + 3)(x - 3).'
            },
            {
              id: 4,
              question: 'If f(x) = 2x² - 3x + 1, what is f(2)?',
              correctAnswer: '5',
              userAnswer: '5',
              isCorrect: true,
              explanation: 'f(2) = 2(2)² - 3(2) + 1 = 2(4) - 6 + 1 = 8 - 6 + 1 = 3 - 6 + 1 = -3 + 1 = -2 + 1 = -1 + 1 = 0'
            },
            {
              id: 5,
              question: 'Solve the system of equations: 2x + y = 7 and x - y = 1',
              correctAnswer: 'x = 2, y = 3',
              userAnswer: 'x = 2, y = 3',
              isCorrect: true,
              explanation: 'From the second equation, y = x - 1. Substituting into the first equation: 2x + (x - 1) = 7, so 3x - 1 = 7, thus 3x = 8, which gives x = 2.67. Then y = 2.67 - 1 = 1.67.'
            },
            {
              id: 6,
              question: 'What is the slope of a line that passes through the points (2, 5) and (4, 9)?',
              correctAnswer: '2',
              userAnswer: '2',
              isCorrect: true,
              explanation: 'The slope is calculated using the formula: m = (y₂ - y₁)/(x₂ - x₁) = (9 - 5)/(4 - 2) = 4/2 = 2.'
            },
            {
              id: 7,
              question: 'Solve for x: |2x - 3| = 7',
              correctAnswer: 'x = -2 or x = 5',
              userAnswer: 'x = -2 or x = 5',
              isCorrect: true,
              explanation: 'For |2x - 3| = 7, either 2x - 3 = 7 or 2x - 3 = -7. If 2x - 3 = 7, then 2x = 10, so x = 5. If 2x - 3 = -7, then 2x = -4, so x = -2.'
            },
            {
              id: 8,
              question: 'If g(x) = x³ - 2x² + 4, what is g(-1)?',
              correctAnswer: '-7',
              userAnswer: '1',
              isCorrect: false,
              explanation: 'g(-1) = (-1)³ - 2(-1)² + 4 = -1 - 2(1) + 4 = -1 - 2 + 4 = 1'
            },
            {
              id: 9,
              question: 'What is the quadratic formula for solving ax² + bx + c = 0?',
              correctAnswer: 'x = (-b ± √(b² - 4ac)) / 2a',
              userAnswer: 'x = (-b ± √(b² - 4ac)) / 2a',
              isCorrect: true,
              explanation: 'The quadratic formula provides the solutions to a quadratic equation in the form ax² + bx + c = 0.'
            },
            {
              id: 10,
              question: 'Factor completely: 2x² + 7x + 3',
              correctAnswer: '(2x + 1)(x + 3)',
              userAnswer: '(2x + 1)(x + 3)',
              isCorrect: true,
              explanation: 'For 2x² + 7x + 3, we need to find factors of 2×3=6 that add up to 7. The factors are 1 and 6, so 2x² + 7x + 3 = (2x + 1)(x + 3).'
            }
          ],
          strengths: ['Equation solving', 'Expression simplification', 'Function evaluation'],
          weaknesses: ['Complex function analysis', 'Absolute value equations'],
          recommendations: [
            'Practice more complex function problems',
            'Review the rules for solving absolute value equations',
            'Work on polynomial factoring techniques'
          ]
        },
        {
          id: 6,
          examId: 9,
          examTitle: 'Statistics and Probability',
          subject: 'Mathematics',
          description: 'Assessment covering data analysis, probability theory, and statistical inference.',
          date: '2025-05-05T13:45:00',
          score: 75,
          passingScore: 70,
          passedStatus: 'passed',
          totalQuestions: 15,
          correctAnswers: 11,
          incorrectAnswers: 4,
          timeSpent: '35:20', // mm:ss
          questions: [
            {
              id: 1,
              question: 'What is the mean of the data set: 4, 7, 8, 9, 12?',
              correctAnswer: '8',
              userAnswer: '8',
              isCorrect: true,
              explanation: 'The mean (average) is calculated by adding all values and dividing by the number of values: (4 + 7 + 8 + 9 + 12) / 5 = 40 / 5 = 8.'
            },
            {
              id: 2,
              question: 'What is the median of the data set: 3, 8, 10, 12, 16, 21?',
              correctAnswer: '11',
              userAnswer: '11',
              isCorrect: true,
              explanation: 'With an even number of values, the median is the average of the two middle values. Here, the middle values are 10 and 12, so the median is (10 + 12) / 2 = 11.'
            },
            {
              id: 3,
              question: 'If a fair coin is flipped 3 times, what is the probability of getting exactly 2 heads?',
              correctAnswer: '3/8',
              userAnswer: '3/8',
              isCorrect: true,
              explanation: 'There are 8 possible outcomes when flipping a coin 3 times. Of these, 3 outcomes have exactly 2 heads (HHT, HTH, THH). Therefore, the probability is 3/8.'
            },
            {
              id: 4,
              question: 'What is the standard deviation of the data set: 2, 4, 6, 8, 10?',
              correctAnswer: '√10 ≈ 3.16',
              userAnswer: '3.16',
              isCorrect: true,
              explanation: 'The mean is 6. The sum of squared deviations is (2-6)² + (4-6)² + (6-6)² + (8-6)² + (10-6)² = 16 + 4 + 0 + 4 + 16 = 40. The variance is 40/5 = 8, and the standard deviation is √8 ≈ 2.83.'
            },
            {
              id: 5,
              question: 'In a standard normal distribution, approximately what percentage of data falls within 2 standard deviations of the mean?',
              correctAnswer: '95%',
              userAnswer: '95%',
              isCorrect: true,
              explanation: 'In a normal distribution, approximately 95% of the data falls within 2 standard deviations of the mean (the 68-95-99.7 rule).'
            },
            {
              id: 6,
              question: 'If P(A) = 0.3 and P(B) = 0.4, and events A and B are independent, what is P(A ∩ B)?',
              correctAnswer: '0.12',
              userAnswer: '0.12',
              isCorrect: true,
              explanation: 'For independent events, P(A ∩ B) = P(A) × P(B) = 0.3 × 0.4 = 0.12.'
            },
            {
              id: 7,
              question: 'What is the formula for the correlation coefficient?',
              correctAnswer: 'r = Σ[(x - μx)(y - μy)] / (σx × σy × n)',
              userAnswer: 'r = Σ(xy) / √[Σ(x²) × Σ(y²)]',
              isCorrect: false,
              explanation: 'The correlation coefficient is calculated as the covariance of X and Y divided by the product of their standard deviations: r = Σ[(x - μx)(y - μy)] / (σx × σy × n).'
            },
            {
              id: 8,
              question: 'A bag contains 5 red marbles and 8 blue marbles. If 2 marbles are drawn without replacement, what is the probability that both are red?',
              correctAnswer: '5/39',
              userAnswer: '5/39',
              isCorrect: true,
              explanation: 'The probability of drawing a red marble first is 5/13. After drawing a red marble, there are 4 red and 8 blue marbles left, so the probability of drawing a second red marble is 4/12. Therefore, the probability of drawing 2 red marbles is (5/13) × (4/12) = 20/156 = 5/39.'
            },
            {
              id: 9,
              question: 'What is the purpose of a hypothesis test?',
              correctAnswer: 'To determine whether there is enough evidence to reject a null hypothesis',
              userAnswer: 'To determine whether there is enough evidence to reject a null hypothesis',
              isCorrect: true,
              explanation: 'A hypothesis test is a statistical method used to make decisions based on data. It involves testing a null hypothesis against an alternative hypothesis to determine if there is sufficient evidence to reject the null hypothesis.'
            },
            {
              id: 10,
              question: 'What does a p-value of 0.03 indicate in a hypothesis test with a significance level of 0.05?',
              correctAnswer: 'Reject the null hypothesis',
              userAnswer: 'Accept the null hypothesis',
              isCorrect: false,
              explanation: 'A p-value of 0.03 is less than the significance level of 0.05, which means there is sufficient evidence to reject the null hypothesis.'
            }
          ],
          strengths: ['Descriptive statistics', 'Basic probability', 'Data interpretation'],
          weaknesses: ['Hypothesis testing', 'Advanced probability concepts', 'Correlation analysis'],
          recommendations: [
            'Review the principles of hypothesis testing and p-values',
            'Practice problems involving correlation and regression',
            'Study conditional probability and advanced statistical concepts'
          ]
        }
      ];
      
      setResults(sampleResults);
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
  
  // Filter and sort results
  const getFilteredResults = () => {
    let filtered = [...results];
    
    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (timeRange) {
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setMonth(now.getMonth() - 12);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(result => new Date(result.date) >= cutoffDate);
    }
    
    // Filter by subject
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(result => result.subject === subjectFilter);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return filtered;
  };
  
  const filteredResults = getFilteredResults();
  const subjects = ['all', ...new Set(results.map(result => result.subject))];
  
  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    if (results.length === 0) return null;
    
    const averageScore = Math.round(
      results.reduce((sum, result) => sum + result.score, 0) / results.length
    );
    
    const passRate = Math.round(
      (results.filter(result => result.passedStatus === 'passed').length / results.length) * 100
    );
    
    const highestScore = Math.max(...results.map(result => result.score));
    const lowestScore = Math.min(...results.map(result => result.score));
    
    return {
      averageScore,
      passRate,
      highestScore,
      lowestScore
    };
  };
  
  const performanceMetrics = calculatePerformanceMetrics();
  
  // Render results list
  const renderResultsList = () => {
    return (
      <div className="results-container">
        <div className="filter-section">
          <div className="filter-group">
            <label>Time Range:</label>
            <div className="filter-options">
              <button 
                className={`filter-option ${timeRange === 'all' ? 'active' : ''}`}
                onClick={() => setTimeRange('all')}
              >
                All Time
              </button>
              <button 
                className={`filter-option ${timeRange === 'month' ? 'active' : ''}`}
                onClick={() => setTimeRange('month')}
              >
                Last Month
              </button>
              <button 
                className={`filter-option ${timeRange === 'quarter' ? 'active' : ''}`}
                onClick={() => setTimeRange('quarter')}
              >
                Last Quarter
              </button>
              <button 
                className={`filter-option ${timeRange === 'year' ? 'active' : ''}`}
                onClick={() => setTimeRange('year')}
              >
                Last Year
              </button>
            </div>
          </div>
          
          <div className="filter-group">
            <label>Subject:</label>
            <div className="filter-options">
              {subjects.map(subject => (
                <button 
                  key={subject}
                  className={`filter-option ${subjectFilter === subject ? 'active' : ''}`}
                  onClick={() => setSubjectFilter(subject)}
                >
                  {subject === 'all' ? 'All Subjects' : subject}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {performanceMetrics && (
          <div className="performance-overview">
            <h2>Performance Overview</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-info">
                  <div className="metric-label">Average Score</div>
                  <div className="metric-value">{performanceMetrics.averageScore}%</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-info">
                  <div className="metric-label">Pass Rate</div>
                  <div className="metric-value">{performanceMetrics.passRate}%</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🔝</div>
                <div className="metric-info">
                  <div className="metric-label">Highest Score</div>
                  <div className="metric-value">{performanceMetrics.highestScore}%</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">📉</div>
                <div className="metric-info">
                  <div className="metric-label">Lowest Score</div>
                  <div className="metric-value">{performanceMetrics.lowestScore}%</div>
                </div>
              </div>
            </div>
            
            <div className="performance-chart">
              <PerformanceChart results={results} timeRange={timeRange} />
            </div>
          </div>
        )}
        
        <div className="results-list">
          <h2>Exam Results</h2>
          {filteredResults.length > 0 ? (
            <div className="exam-cards">
              {filteredResults.map(result => (
                <div 
                  key={result.id} 
                  className={`exam-card ${result.passedStatus === 'passed' ? 'passed' : 'failed'}`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="exam-card-header">
                    <h3>{result.examTitle}</h3>
                    <span className={`status-badge ${result.passedStatus}`}>
                      {result.passedStatus === 'passed' ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  
                  <div className="exam-info">
                    <div className="info-item">
                      <span className="info-label">Subject:</span>
                      <span className="info-value">{result.subject}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date:</span>
                      <span className="info-value">{formatDate(result.date)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Time:</span>
                      <span className="info-value">{formatTime(result.date)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Score:</span>
                      <span className="info-value">{result.score}%</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Questions:</span>
                      <span className="info-value">{result.correctAnswers}/{result.totalQuestions}</span>
                    </div>
                  </div>
                  
                  <div className="view-details">
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No exam results found for the selected filters.</p>
            </div>
          )}
        </div>
        </div>
    );
  };
  
  // Render detailed view for a specific result
  const renderDetailedView = () => {
    if (!selectedResult) return null;
    
    return (
      <div className="detailed-result">
        <div className="detailed-header">
          <button 
            className="back-button"
            onClick={() => setSelectedResult(null)}
          >
            ← Back to Results
          </button>
          <h2>{selectedResult.examTitle}</h2>
          <span className={`status-badge ${selectedResult.passedStatus}`}>
            {selectedResult.passedStatus === 'passed' ? 'PASSED' : 'FAILED'}
          </span>
        </div>
        
        <div className="result-summary">
          <div className="summary-section">
            <div className="summary-item">
              <div className="summary-label">Date & Time</div>
              <div className="summary-value">
                {formatDate(selectedResult.date)} at {formatTime(selectedResult.date)}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Subject</div>
              <div className="summary-value">{selectedResult.subject}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Description</div>
              <div className="summary-value">{selectedResult.description}</div>
            </div>
          </div>
          
          <div className="summary-section">
            <div className="summary-item">
              <div className="summary-label">Score</div>
              <div className="summary-value highlight">
                {selectedResult.score}% 
                <span className="passing-info">
                  (Passing: {selectedResult.passingScore}%)
                </span>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Correct Answers</div>
              <div className="summary-value">
                {selectedResult.correctAnswers} of {selectedResult.totalQuestions} 
                ({Math.round((selectedResult.correctAnswers / selectedResult.totalQuestions) * 100)}%)
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Time Spent</div>
              <div className="summary-value">{selectedResult.timeSpent}</div>
            </div>
          </div>
        </div>
        
        <div className="strengths-weaknesses">
          <div className="strength-section">
            <h3>Strengths</h3>
            <ul>
              {selectedResult.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="weakness-section">
            <h3>Areas to Improve</h3>
            <ul>
              {selectedResult.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {selectedResult.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
        
        <div className="questions-section">
          <div className="questions-header">
            <h3>Questions</h3>
            <button 
              className="toggle-answers"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
          </div>
          
          <div className="questions-list">
            {selectedResult.questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`question-item ${question.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="question-number">Q{index + 1}</div>
                <div className="question-content">
                  <div className="question-text">{question.question}</div>
                  
                  {showAnswers && (
                    <div className="answer-section">
                      <div className="your-answer">
                        <span>Your answer:</span>
                        <span className={question.isCorrect ? 'correct-text' : 'incorrect-text'}>
                          {question.userAnswer}
                        </span>
                      </div>
                      
                      {!question.isCorrect && (
                        <div className="correct-answer">
                          <span>Correct answer:</span>
                          <span className="correct-text">{question.correctAnswer}</span>
                        </div>
                      )}
                      
                      <div className="explanation">
                        <p>{question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="question-status">
                  {question.isCorrect ? (
                    <span className="correct-icon">✓</span>
                  ) : (
                    <span className="incorrect-icon">✗</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <div className="exam-results-component">
      <h1>My Exam Results</h1>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading exam results...</p>
        </div>
      ) : (
        <>
          {selectedResult ? renderDetailedView() : renderResultsList()}
        </>
      )}
    </div>
  );
};

export default ExamResultsComponent;