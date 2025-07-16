// src/components/forms/AddQuestionForm.jsx
import React, { useState, useEffect } from 'react';
import { StableInput, StableSelect, StableTextarea } from '../ui/StableInputs';

import { toast } from 'react-toastify';

const AddQuestionForm = ({ onSubmit, onCancel, existingQuestion = null, gamesData = [] }) => {
  // Initialize form with existing question data if provided, otherwise use defaults
  const [formData, setFormData] = useState({
    simulation: '',
    question: '',
    type: 'Multiple Choice',
    difficulty: 'Intermediate',
    options: ['', '', '', ''],
    answer: '',
    points: 1
  });
  
  const [simulations, setSimulations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock implementations for missing service functions
  const getSimulations = async () => {
    console.log("Mock getSimulations called");
    // Use the gamesData prop instead of making an API call
    return Promise.resolve(gamesData);
  };

  const createQuestion = async (data) => {
    console.log("Mock createQuestion called", data);
    return Promise.resolve({
      _id: Date.now().toString(),
      ...data
    });
  };

  const updateQuestion = async (id, data) => {
    console.log("Mock updateQuestion called", id, data);
    return Promise.resolve({
      _id: id,
      ...data
    });
  };
  
  // Fetch simulations on component mount
  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await getSimulations();
        console.log("Simulations response:", response);
        
        // Extract simulations array from the response
        let simulationsData = [];
        if (Array.isArray(response)) {
          simulationsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          simulationsData = response.data;
        } else if (response && typeof response === 'object') {
          // For other formats, try to use any array property found
          const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            simulationsData = possibleArrays[0];
          }
        }
        
        setSimulations(simulationsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching simulations:', error);
        toast.error('Failed to load simulations. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchSimulations();
  }, []);
  
  // Set form data when existingQuestion changes
  useEffect(() => {
    if (existingQuestion) {
      const options = existingQuestion.options || [];
      let formattedOptions;
      
      // Check if options is an array of objects or strings and handle accordingly
      if (options.length > 0 && typeof options[0] === 'object') {
        formattedOptions = options.map(option => option.text || option.value || '');
      } else {
        formattedOptions = options.length > 0 ? options : ['', '', '', ''];
      }
      
      // Normalize answer
      let formattedAnswer = existingQuestion.answer || '';
      if (typeof formattedAnswer === 'object') {
        formattedAnswer = formattedAnswer.text || formattedAnswer.value || '';
      }
      
      setFormData({
        simulation: existingQuestion.simulation || '',
        question: existingQuestion.question || '',
        type: existingQuestion.type || 'Multiple Choice',
        difficulty: existingQuestion.difficulty || 'Intermediate',
        options: formattedOptions,
        answer: formattedAnswer,
        points: existingQuestion.points || 1
      });
    }
  }, [existingQuestion]);
  
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
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    
    setFormData({
      ...formData,
      options: newOptions
    });
    
    if (errors.options) {
      setErrors({
        ...errors,
        options: null
      });
    }
  };
  
  const handleAnswerSelection = (option) => {
    setFormData({
      ...formData,
      answer: option
    });
    
    if (errors.answer) {
      setErrors({
        ...errors,
        answer: null
      });
    }
  };
  
  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };
  
  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      toast.warning('Multiple choice questions must have at least 2 options');
      return;
    }
    
    const newOptions = formData.options.filter((_, i) => i !== index);
    
    // If the answer was the option being removed, reset the answer
    if (formData.answer === formData.options[index]) {
      setFormData({
        ...formData,
        options: newOptions,
        answer: ''
      });
    } else {
      setFormData({
        ...formData,
        options: newOptions
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.simulation) {
      newErrors.simulation = 'Simulation is required';
    }
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question text is required';
    }
    
    if (formData.type === 'Multiple Choice' || formData.type === 'True/False') {
      // Check if at least 2 options are provided for Multiple Choice
      if (formData.options.filter(option => 
        typeof option === 'string' ? option.trim() : (option?.text?.trim() || '')
      ).length < 2) {
        newErrors.options = 'At least 2 non-empty options are required';
      }
      
      // Check if answer is selected
      if (!formData.answer) {
        newErrors.answer = 'Correct answer must be selected';
      }
    } else if (formData.type === 'Short Answer' && !formData.answer.trim()) {
      newErrors.answer = 'Correct answer is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      // Filter out empty options before submission
      const filteredOptions = formData.options.filter(option => 
        typeof option === 'string' ? option.trim() : (option?.text?.trim() || '')
      );
      
      // Create the data to submit
      const questionData = {
        ...formData,
        options: filteredOptions
      };
      
      if (existingQuestion) {
        // If editing, update existing question
        result = await updateQuestion(existingQuestion._id, questionData);
        toast.success('Question updated successfully!');
      } else {
        // If adding new, create new question
        result = await createQuestion(questionData);
        toast.success('Question added successfully!');
      }
      
      // Call the parent component's onSubmit with the result
      onSubmit(result);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 
        `Failed to ${existingQuestion ? 'update' : 'add'} question. Please try again.`;
      
      toast.error(errorMessage);
      
      setErrors({
        submit: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        padding: '30px', 
        textAlign: 'center', 
        color: '#8ab3c5',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Loading simulations...
      </div>
    );
  }
  
  // Function to safely get option text regardless of format
  const getOptionText = (option) => {
    if (typeof option === 'string') {
      return option;
    } else if (option && typeof option === 'object') {
      return option.text || option.value || JSON.stringify(option);
    }
    return '';
  };
  
  // Function to safely compare answer with option
  const isOptionSelected = (option, answer) => {
    if (typeof option === 'string' && typeof answer === 'string') {
      return option === answer;
    } else if (typeof option === 'object' && typeof answer === 'object') {
      return option.id === answer.id || option.text === answer.text;
    } else if (typeof option === 'string' && typeof answer === 'object') {
      return option === answer.text || option === answer.value;
    } else if (typeof option === 'object' && typeof answer === 'string') {
      return option.text === answer || option.value === answer;
    }
    return false;
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Simulation *
        </label>
        <StableSelect
          name="simulation"
          value={formData.simulation}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.simulation ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
            appearance: 'none'
          }}
        >
          <option value="">Select Simulation</option>
          {Array.isArray(simulations) && simulations.map(simulation => (
            <option 
              key={simulation._id || simulation.id} 
              value={simulation._id || simulation.id}
            >
              {simulation.title}
            </option>
          ))}
        </StableSelect>
        {errors.simulation && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.simulation}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Question *
        </label>
        <StableTextarea
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="Enter your question"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.question ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
        {errors.question && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.question}
          </p>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{
            display: 'block',
            color: '#b8e0f0',
            fontSize: '0.85rem',
            marginBottom: '8px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Question Type
          </label>
          <StableSelect
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontFamily: 'system-ui, sans-serif',
              appearance: 'none'
            }}
          >
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="True/False">True/False</option>
            <option value="Short Answer">Short Answer</option>
            <option value="Matching">Matching</option>
          </StableSelect>
        </div>
        
        <div>
          <label style={{
            display: 'block',
            color: '#b8e0f0',
            fontSize: '0.85rem',
            marginBottom: '8px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Difficulty
          </label>
          <StableSelect
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontFamily: 'system-ui, sans-serif',
              appearance: 'none'
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </StableSelect>
        </div>
      </div>
      
      {(formData.type === 'Multiple Choice' || formData.type === 'True/False') && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px' 
          }}>
            <label style={{
              color: '#b8e0f0',
              fontSize: '0.85rem',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              Options *
            </label>
            
            {formData.type === 'Multiple Choice' && (
              <button
                type="button"
                onClick={addOption}
                style={{
                  background: 'rgba(0, 225, 255, 0.1)',
                  border: '1px solid rgba(0, 225, 255, 0.3)',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  color: '#00e1ff',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif'
                }}
              >
                + ADD OPTION
              </button>
            )}
          </div>
          
          {errors.options && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 10px 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {errors.options}
            </p>
          )}
          
          <div>
            {Array.isArray(formData.options) && formData.options.map((option, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '10px' 
              }}>
                <input 
                  type="radio" 
                  name="correct-answer" 
                  checked={isOptionSelected(option, formData.answer)}
                  onChange={() => handleAnswerSelection(option)} 
                  style={{ accentColor: '#15ffaa' }} 
                />
                <StableInput
                  value={getOptionText(option)}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: isOptionSelected(option, formData.answer)
                      ? '1px solid rgba(21, 255, 170, 0.3)' 
                      : '1px solid rgba(0, 225, 255, 0.3)',
                    borderRadius: '6px',
                    padding: '10px 15px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontFamily: 'system-ui, sans-serif'
                  }}
                />
                
                {formData.type === 'Multiple Choice' && formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    style={{
                      background: 'rgba(255, 106, 136, 0.1)',
                      border: '1px solid rgba(255, 106, 136, 0.3)',
                      borderRadius: '4px',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff6a88',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontFamily: 'system-ui, sans-serif'
                    }}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {errors.answer && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {errors.answer}
            </p>
          )}
        </div>
      )}
      
      {formData.type === 'Short Answer' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: '#b8e0f0',
            fontSize: '0.85rem',
            marginBottom: '8px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Correct Answer *
          </label>
          <StableInput
            name="answer"
            value={typeof formData.answer === 'string' ? formData.answer : (formData.answer?.text || '')}
            onChange={handleChange}
            placeholder="Enter correct answer"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: errors.answer ? '1px solid #ff6a88' : '1px solid rgba(21, 255, 170, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontFamily: 'system-ui, sans-serif'
            }}
          />
          {errors.answer && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {errors.answer}
            </p>
          )}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Points
        </label>
        <StableInput
          type="number"
          name="points"
          min="1"
          max="10"
          value={formData.points}
          onChange={handleChange}
          style={{
            width: '100px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
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
          disabled={isSubmitting}
          style={{
            background: isSubmitting ? 'rgba(0, 225, 255, 0.3)' : 'linear-gradient(135deg, #ffd36a, #ff6a88)',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 25px',
            color: isSubmitting ? '#8ab3c5' : '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          {isSubmitting ? 
            (existingQuestion ? 'UPDATING...' : 'ADDING...') : 
            (existingQuestion ? 'UPDATE QUESTION' : 'ADD QUESTION')}
        </button>
      </div>
    </form>
  );
};

export default AddQuestionForm;