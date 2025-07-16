// src/components/forms/AddGameForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import simulationService from '../../services/simulationService';

const AddGameForm = ({ onSubmit, onCancel, existingGame = null }) => {
  // Initialize form with existing game data if provided, otherwise use defaults
  const [formData, setFormData] = useState({
    title: '',
    simulationType: '', // This is used as the type
    subject: '',
    difficulty: 'Intermediate',
    description: '',
    status: 'Active',
    estimatedTime: 30,
    grade: '', // This maps to targetGrade in the backend
    objectives: '', // This maps to learningObjectives in the backend
    content: {},
    questions: [], // Added questions array
    resources: [],
    settings: {}
  });
  
  // Set form data when existingGame changes
  useEffect(() => {
    if (existingGame) {
      setFormData({
        title: existingGame.title || '',
        simulationType: existingGame.simulationType || '',
        subject: existingGame.subject || 'general',
        difficulty: existingGame.difficulty || 'Intermediate',
        description: existingGame.description || '',
        status: existingGame.status || 'Active',
        estimatedTime: existingGame.estimatedPlayTime || existingGame.estimatedTime || 30,
        grade: existingGame.targetGrade || existingGame.grade || '', // Map from either field
        objectives: existingGame.learningObjectives || existingGame.objectives || '', // Map from either field
        content: existingGame.content || {},
        // Load either embedded questions or regular questions
        questions: existingGame.embeddedQuestions || existingGame.questions || [],
        resources: existingGame.resources || [],
        settings: existingGame.settings || {}
      });
    }
  }, [existingGame]);
  
  // State for question creation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);

  // Add a question to the list
  const addQuestion = () => {
    if (!currentQuestion.trim()) {
      toast.error('Please enter a question first');
      return;
    }
    
    // Filter out empty options
    const filteredOptions = currentOptions.filter(option => option.trim() !== '');
    
    if (filteredOptions.length < 2) {
      toast.error('Please provide at least two answer options');
      return;
    }
    
    // Ensure correct answer index is within bounds
    const safeCorrectAnswerIndex = Math.min(correctAnswerIndex, filteredOptions.length - 1);
    
    const newQuestion = {
      id: Date.now(), // Temporary ID for UI purposes
      text: currentQuestion.trim(),
      type: 'multiple-choice', // Default type
      options: filteredOptions,
      correctAnswer: filteredOptions[safeCorrectAnswerIndex]
    };
    
    // Update form data with new questions
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
    
    // Reset the inputs
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setShowQuestionOptions(false);
  };

  // Remove a question from the list
  const removeQuestion = (id) => {
    const updatedQuestions = formData.questions.filter(q => q.id !== id);
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  // Handle option change
  const handleOptionChange = (index, value) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setCurrentOptions(newOptions);
  };
  
  // Add more options
  const addOption = () => {
    setCurrentOptions([...currentOptions, '']);
  };
  
  // Remove an option
  const removeOption = (index) => {
    if (currentOptions.length <= 2) {
      toast.error('At least two options are required');
      return;
    }
    
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setCurrentOptions(newOptions);
    
    // Adjust correct answer index if necessary
    if (correctAnswerIndex >= index && correctAnswerIndex > 0) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.simulationType) {
      newErrors.simulationType = 'Simulation type is required';
    }
    
    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty level is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.grade) {
      newErrors.grade = 'Target grade is required';
    }
    
    // Validate learning objectives
    if (!formData.objectives || !formData.objectives.trim()) {
      newErrors.objectives = 'Learning objectives are required';
    }
    
    // Additional validation - check for special characters in title
    const specialCharsRegex = /[^\w\s-]/;
    if (formData.title.trim() && specialCharsRegex.test(formData.title)) {
      newErrors.title = 'Title should not contain special characters';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Convert questions to simple format before sending
      const processedQuestions = formData.questions.map(q => ({
        text: q.text,
        type: q.type || 'multiple-choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer || ''
      }));
      
      // Prepare the data - ensure proper types and formatting
      const dataToSubmit = {
        // Basic fields - ensure they are strings
        title: String(formData.title).trim(),
        description: String(formData.description).trim(),
        difficulty: String(formData.difficulty),
        simulationType: String(formData.simulationType), // This is what the backend expects
        
        // Important: Map the field names correctly for backend validation
        targetGrade: String(formData.grade),
        // Also include the original field for backward compatibility
        grade: String(formData.grade),
        
        estimatedPlayTime: Number(formData.estimatedTime) || 30,
        // Also include the original field for backward compatibility
        estimatedTime: Number(formData.estimatedTime) || 30,
        
        learningObjectives: formData.objectives ? String(formData.objectives).trim() : "Default learning objectives",
        // Also include the original field for backward compatibility
        objectives: formData.objectives ? String(formData.objectives).trim() : "Default learning objectives",
        
        // Convert questions to simple format before sending
        embeddedQuestions: processedQuestions, // Backend expects this field name
        // Also include the original field for backward compatibility
        questions: processedQuestions,
        
        // Other form fields
        subject: formData.subject || 'general',
        content: formData.content || {},
        resources: formData.resources || [],
        settings: formData.settings || {},
        status: formData.status || 'Active'
      };
      
      // If editing, ensure the ID is included
      if (existingGame && (existingGame._id || existingGame.id)) {
        dataToSubmit._id = existingGame._id || existingGame.id;
      }
      
      let result;
      
      if (existingGame) {
        // If editing, update existing simulation
        const id = existingGame._id || existingGame.id;
        result = await simulationService.updateSimulation(id, dataToSubmit);
        toast.success('Simulation updated successfully!');
      } else {
        // If adding new, create new simulation
        result = await simulationService.createSimulation(dataToSubmit);
        toast.success('Simulation added successfully!');
      }
      
      // Call the parent component's onSubmit with the result
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(result.data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
      }
      
      // Extract error message from response if available
      let errorMessage = 'Failed to save simulation';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      (typeof error.response.data === 'string' ? error.response.data : 'Server error');
        
        // Extract validation errors from the response
        if (error.response.data.errors) {
          if (Array.isArray(error.response.data.errors)) {
            const serverErrors = {};
            error.response.data.errors.forEach(err => {
              serverErrors[err.param] = err.msg;
            });
            setErrors(serverErrors);
            
            // Create a readable message from the errors
            const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
            errorMessage = `Validation failed: ${errorMessages}`;
          } else if (typeof error.response.data.errors === 'object') {
            // Direct object of errors
            setErrors(error.response.data.errors);
            
            // Create a readable message from the errors
            const errorMessages = Object.values(error.response.data.errors).join(', ');
            errorMessage = `Validation failed: ${errorMessages}`;
          }
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Common input styles
  const inputStyle = (fieldName) => ({
    width: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    border: errors[fieldName] ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
    borderRadius: '6px',
    padding: '12px 15px',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontFamily: 'system-ui, sans-serif'
  });
  
  // Label styles
  const labelStyle = {
    display: 'block',
    color: '#b8e0f0',
    fontSize: '0.85rem',
    marginBottom: '8px',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: '600',
    letterSpacing: '0.5px'
  };
  
  // Error message styles
  const errorStyle = {
    color: '#ff6a88',
    fontSize: '0.8rem',
    margin: '5px 0 0 0',
    fontFamily: 'system-ui, sans-serif'
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Simulation Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter simulation title"
          style={inputStyle('title')}
        />
        {errors.title && (
          <p style={errorStyle}>
            {errors.title}
          </p>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>
            Simulation Type *
          </label>
          <select
            name="simulationType"
            value={formData.simulationType}
            onChange={handleChange}
            style={{
              ...inputStyle('simulationType'),
              appearance: 'none'
            }}
          >
            <option value="">Select Simulation Type</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Literature">Literature</option>
            <option value="Geography">Geography</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Art">Art</option>
            <option value="Music">Music</option>
            <option value="Physical Education">Physical Education</option>
          </select>
          {errors.simulationType && (
            <p style={errorStyle}>
              {errors.simulationType}
            </p>
          )}
        </div>
        
        <div>
          <label style={labelStyle}>
            Difficulty Level *
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={{
              ...inputStyle('difficulty'),
              appearance: 'none'
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {errors.difficulty && (
            <p style={errorStyle}>
              {errors.difficulty}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Subject Area
        </label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          style={{
            ...inputStyle('subject'),
            appearance: 'none'
          }}
        >
          <option value="general">General</option>
          <option value="mathematics">Mathematics</option>
          <option value="science">Science</option>
          <option value="language">Language Arts</option>
          <option value="social_studies">Social Studies</option>
          <option value="arts">Arts</option>
          <option value="physical_education">Physical Education</option>
          <option value="technology">Technology</option>
        </select>
        {errors.subject && (
          <p style={errorStyle}>
            {errors.subject}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter simulation description"
          style={{
            ...inputStyle('description'),
            minHeight: '120px',
            resize: 'vertical'
          }}
        />
        {errors.description && (
          <p style={errorStyle}>
            {errors.description}
          </p>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>
            Target Grade Level *
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            style={{
              ...inputStyle('grade'),
              appearance: 'none'
            }}
          >
            <option value="">Select Grade Level</option>
            <option value="K-2">Kindergarten - 2nd Grade</option>
            <option value="3-5">3rd - 5th Grade</option>
            <option value="6-8">6th - 8th Grade</option>
            <option value="9-10">9th - 10th Grade</option>
            <option value="11-12">11th - 12th Grade</option>
            <option value="Higher Education">Higher Education</option>
            <option value="all">All Grades</option>
          </select>
          {errors.grade && (
            <p style={errorStyle}>
              {errors.grade}
            </p>
          )}
          {errors.targetGrade && (
            <p style={errorStyle}>
              {errors.targetGrade}
            </p>
          )}
        </div>
        
        <div>
          <label style={labelStyle}>
            Estimated Play Time (minutes)
          </label>
          <input
            type="number"
            name="estimatedTime"
            min="1"
            max="120"
            value={formData.estimatedTime}
            onChange={handleChange}
            style={inputStyle('estimatedTime')}
          />
          {errors.estimatedTime && (
            <p style={errorStyle}>
              {errors.estimatedTime}
            </p>
          )}
          {errors.estimatedPlayTime && (
            <p style={errorStyle}>
              {errors.estimatedPlayTime}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Learning Objectives *
        </label>
        <textarea
          name="objectives"
          value={formData.objectives}
          onChange={handleChange}
          placeholder="Enter learning objectives and outcomes"
          style={{
            ...inputStyle('objectives'),
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
        {errors.objectives && (
          <p style={errorStyle}>
            {errors.objectives}
          </p>
        )}
        {errors.learningObjectives && (
          <p style={errorStyle}>
            {errors.learningObjectives}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Questions
        </label>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Enter a question"
              style={{
                ...inputStyle('questions'),
                flex: 1
              }}
            />
            <button
              type="button"
              onClick={() => setShowQuestionOptions(!showQuestionOptions)}
              style={{
                background: 'rgba(0, 225, 255, 0.2)',
                border: '1px solid rgba(0, 225, 255, 0.3)',
                borderRadius: '6px',
                padding: '10px 15px',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif'
              }}
            >
              {showQuestionOptions ? 'Hide Options' : 'Show Options'}
            </button>
          </div>
          
          {/* Question options */}
          {showQuestionOptions && (
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: '6px', 
              padding: '15px', 
              marginBottom: '15px'
            }}>
              <p style={{ 
                color: '#b8e0f0', 
                fontSize: '0.85rem', 
                marginBottom: '10px',
                fontWeight: '600'
              }}>
                Answer Options (select the correct one)
              </p>
              
              {currentOptions.map((option, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '8px',
                  gap: '10px'
                }}>
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswerIndex === index}
                    onChange={() => setCorrectAnswerIndex(index)}
                    style={{ cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{
                      ...inputStyle('option'),
                      flex: 1,
                      background: correctAnswerIndex === index ? 'rgba(0, 225, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    style={{
                      background: 'rgba(255, 106, 136, 0.3)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={addOption}
                  style={{
                    background: 'rgba(138, 179, 197, 0.2)',
                    border: '1px solid rgba(138, 179, 197, 0.3)',
                    borderRadius: '6px',
                    padding: '8px 15px',
                    color: '#8ab3c5',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontFamily: 'system-ui, sans-serif'
                  }}
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addQuestion}
              style={{
                background: 'linear-gradient(135deg, #00e1ff, #00d0ff)',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 15px',
                color: '#051a2e',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif'
              }}
            >
              Add Question
            </button>
          </div>
        </div>
        
        {/* List of added questions */}
        <div style={{ 
          maxHeight: '250px', 
          overflowY: 'auto', 
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '6px',
          padding: formData.questions.length > 0 ? '10px' : '0'
        }}>
          {formData.questions.length > 0 ? (
            formData.questions.map((question, index) => (
              <div 
                key={question.id || index} 
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px 15px',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start'
                }}>
                  <div style={{ color: '#ffffff', flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                      {index + 1}. {question.text}
                    </div>
                    
                    {question.options && question.options.length > 0 && (
                      <div style={{ paddingLeft: '20px' }}>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} style={{ 
                            color: question.correctAnswer === option ? '#00e1ff' : '#b8e0f0',
                            marginBottom: '4px',
                            fontSize: '0.9rem'
                          }}>
                            {optIndex + 1}. {option}
                            {question.correctAnswer === option && ' ✓'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    style={{
                      background: 'rgba(255, 106, 136, 0.3)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      marginLeft: '10px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: 'rgba(255, 255, 255, 0.5)',
              fontStyle: 'italic'
            }}>
              No questions added yet
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            ...inputStyle('status'),
            appearance: 'none'
          }}
        >
          <option value="Active">Active</option>
          <option value="Beta">Beta</option>
          <option value="Inactive">Inactive</option>
        </select>
        {errors.status && (
          <p style={errorStyle}>
            {errors.status}
          </p>
        )}
      </div>
      
      {errors.submit && (
        <div style={{
          background: 'rgba(255, 106, 136, 0.1)',
          border: '1px solid rgba(255, 106, 136, 0.3)',
          borderRadius: '6px',
          padding: '12px 15px',
          color: '#ff6a88',
          fontSize: '0.9rem',
          marginBottom: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {errors.submit}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'rgba(138, 179, 197, 0.1)',
            border: '1px solid rgba(138, 179, 197, 0.3)',
            borderRadius: '6px',
            padding: '12px 25px',
            color: '#8ab3c5',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          CANCEL
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          style={{
            background: (isSubmitting || Object.keys(errors).length > 0) ? 'rgba(0, 225, 255, 0.3)' : 'linear-gradient(135deg, #00e1ff, #00d0ff)',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 25px',
            color: (isSubmitting || Object.keys(errors).length > 0) ? '#8ab3c5' : '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: (isSubmitting || Object.keys(errors).length > 0) ? 'not-allowed' : 'pointer',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          {isSubmitting ? 
            (existingGame ? 'UPDATING...' : 'ADDING...') : 
            (existingGame ? 'UPDATE SIMULATION' : 'ADD SIMULATION')}
        </button>
      </div>
    </form>
  );
};

export default AddGameForm;