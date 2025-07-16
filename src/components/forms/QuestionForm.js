import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputField from './InputField';
import Modal from '../common/Modal';

const QuestionForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  gameCategories = [],
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: '',
    difficulty: 'medium',
    points: 10,
    timeLimit: 30,
    tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question || '',
        options: initialData.options || ['', '', '', ''],
        correctAnswer: initialData.correctAnswer || 0,
        explanation: initialData.explanation || '',
        category: initialData.category || '',
        difficulty: initialData.difficulty || 'medium',
        points: initialData.points || 10,
        timeLimit: initialData.timeLimit || 30,
        tags: initialData.tags || []
      });
    } else {
      // Reset form for create mode
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        category: '',
        difficulty: 'medium',
        points: 10,
        timeLimit: 30,
        tags: []
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
    
    if (errors.options) {
      setErrors(prev => ({
        ...prev,
        options: ''
      }));
    }
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: prev.correctAnswer >= index ? Math.max(0, prev.correctAnswer - 1) : prev.correctAnswer
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Question validation
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters';
    }

    // Options validation
    const validOptions = formData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    } else if (formData.options.some(option => option.trim().length === 0)) {
      newErrors.options = 'All options must have content';
    }

    // Correct answer validation
    if (formData.correctAnswer >= validOptions.length) {
      newErrors.correctAnswer = 'Please select a valid correct answer';
    }

    // Explanation validation
    if (!formData.explanation.trim()) {
      newErrors.explanation = 'Explanation is required';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Points validation
    if (formData.points < 1 || formData.points > 100) {
      newErrors.points = 'Points must be between 1 and 100';
    }

    // Time limit validation
    if (formData.timeLimit < 10 || formData.timeLimit > 300) {
      newErrors.timeLimit = 'Time limit must be between 10 and 300 seconds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Filter out empty options
      const cleanedData = {
        ...formData,
        options: formData.options.filter(option => option.trim())
      };
      
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save question' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'var(--neon-green)' },
    { value: 'medium', label: 'Medium', color: 'var(--neon-orange)' },
    { value: 'hard', label: 'Hard', color: 'var(--neon-pink)' }
  ];

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'create' ? 'Create New' : 'Edit'} Question`}
      size="large"
      footer={
        <div className="question-form-footer">
          <motion.button
            type="button"
            className="btn-neon-secondary"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            form="question-form"
            className="btn-neon"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Question' : 'Update Question'}
          </motion.button>
        </div>
      }
    >
      <motion.form
        id="question-form"
        onSubmit={handleSubmit}
        className="question-form"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Question Text */}
        <motion.div className="form-group" variants={itemVariants}>
          <InputField
            type="textarea"
            name="question"
            placeholder="Enter your question here..."
            value={formData.question}
            onChange={handleChange}
            error={errors.question}
            required
            rows={3}
          />
        </motion.div>

        {/* Answer Options */}
        <motion.div className="form-group" variants={itemVariants}>
          <label className="form-label">Answer Options *</label>
          <div className="options-container">
            {formData.options.map((option, index) => (
              <motion.div
                key={index}
                className="option-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="option-input-wrapper">
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={index}
                    checked={formData.correctAnswer === index}
                    onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                    className="correct-answer-radio"
                  />
                  <InputField
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="option-input"
                  />
                  {formData.options.length > 2 && (
                    <motion.button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => removeOption(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ❌
                    </motion.button>
                  )}
                </div>
                {formData.correctAnswer === index && (
                  <span className="correct-indicator">✅ Correct Answer</span>
                )}
              </motion.div>
            ))}
          </div>
          
          {formData.options.length < 6 && (
            <motion.button
              type="button"
              className="add-option-btn"
              onClick={addOption}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              + Add Option
            </motion.button>
          )}
          
          {errors.options && <span className="error-text">{errors.options}</span>}
          {errors.correctAnswer && <span className="error-text">{errors.correctAnswer}</span>}
        </motion.div>

        {/* Explanation */}
        <motion.div className="form-group" variants={itemVariants}>
          <InputField
            type="textarea"
            name="explanation"
            placeholder="Explain why this is the correct answer..."
            value={formData.explanation}
            onChange={handleChange}
            error={errors.explanation}
            required
            rows={2}
          />
        </motion.div>

        {/* Category and Difficulty */}
        <motion.div className="form-row" variants={itemVariants}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="neon-input"
              required
            >
              <option value="">Select Category</option>
              {gameCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty *</label>
            <div className="difficulty-selector">
              {difficultyOptions.map((diff) => (
                <motion.label
                  key={diff.value}
                  className={`difficulty-option ${formData.difficulty === diff.value ? 'selected' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ '--difficulty-color': diff.color }}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={diff.value}
                    checked={formData.difficulty === diff.value}
                    onChange={handleChange}
                  />
                  <span>{diff.label}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Points and Time Limit */}
        <motion.div className="form-row" variants={itemVariants}>
          <div className="form-group">
            <InputField
              type="number"
              name="points"
              placeholder="Points"
              value={formData.points}
              onChange={handleChange}
              error={errors.points}
              min={1}
              max={100}
              required
            />
          </div>

          <div className="form-group">
            <InputField
              type="number"
              name="timeLimit"
              placeholder="Time Limit (seconds)"
              value={formData.timeLimit}
              onChange={handleChange}
              error={errors.timeLimit}
              min={10}
              max={300}
              required
            />
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div className="form-group" variants={itemVariants}>
          <label className="form-label">Tags</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  className="tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
            <div className="add-tag-container">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="tag-input"
              />
              <motion.button
                type="button"
                onClick={addTag}
                className="add-tag-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Submit Error */}
        {errors.submit && (
          <motion.div 
            className="form-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.submit}
          </motion.div>
        )}
      </motion.form>
    </Modal>
  );
};

export default QuestionForm;