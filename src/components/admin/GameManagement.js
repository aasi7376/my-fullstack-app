// src/pages/admin/GameManagement.js - Firebase Integrated Version
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import InputField from '../forms/InputField';
import QuestionForm from '../forms/QuestionForm';
import { db, storage } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNotifications } from '../../context/NotificationContext';

const GameManagement = () => {
  const { addNotification } = useNotifications();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'mathematics',
    gradeLevel: '',
    difficulty: 'beginner',
    gameType: 'quiz',
    duration: '',
    maxScore: '',
    instructions: '',
    learningObjectives: '',
    prerequisites: '',
    isActive: true,
    isFeatured: false,
    tags: '',
    questions: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch games from Firebase
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const gamesSnapshot = await getDocs(collection(db, 'games'));
      const gamesData = gamesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format dates for display
        createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
        updatedAt: doc.data().updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'
      }));
      setGames(gamesData);
    } catch (error) {
      console.error('Error fetching games:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch games'
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      title: 'Game Title',
      width: '25%',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {item.imageUrl && (
            <img 
              src={item.imageUrl} 
              alt={value}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
          )}
          <div>
            <strong>{value}</strong>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.subject}</div>
          </div>
        </div>
      )
    },
    {
      key: 'gradeLevel',
      title: 'Grade',
      width: '10%',
      render: (value) => `Grade ${value}`
    },
    {
      key: 'difficulty',
      title: 'Difficulty',
      width: '10%',
      render: (value) => (
        <span className={`difficulty-badge ${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'gameType',
      title: 'Type',
      width: '10%',
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    {
      key: 'playCount',
      title: 'Plays',
      width: '10%',
      render: (value) => value?.toLocaleString() || '0'
    },
    {
      key: 'avgScore',
      title: 'Avg Score',
      width: '10%',
      render: (value) => value ? `${Math.round(value)}%` : 'N/A'
    },
    {
      key: 'isActive',
      title: 'Status',
      width: '10%',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '15%',
      render: (_, item) => (
        <div className="action-buttons">
          <motion.button
            className="action-btn edit"
            onClick={() => handleEdit(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
          <motion.button
            className="action-btn delete"
            onClick={() => handleDeleteClick(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: '#ff4444' }}
          >
            Delete
          </motion.button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      subject: 'mathematics',
      gradeLevel: '',
      difficulty: 'beginner',
      gameType: 'quiz',
      duration: '',
      maxScore: '',
      instructions: '',
      learningObjectives: '',
      prerequisites: '',
      isActive: true,
      isFeatured: false,
      tags: '',
      questions: []
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
    setShowAddModal(true);
  };

  const handleEdit = (game) => {
    setSelectedGame(game);
    setFormData({
      title: game.title || '',
      description: game.description || '',
      subject: game.subject || 'mathematics',
      gradeLevel: game.gradeLevel?.toString() || '',
      difficulty: game.difficulty || 'beginner',
      gameType: game.gameType || 'quiz',
      duration: game.duration?.toString() || '',
      maxScore: game.maxScore?.toString() || '',
      instructions: game.instructions || '',
      learningObjectives: game.learningObjectives || '',
      prerequisites: game.prerequisites || '',
      isActive: game.isActive !== false,
      isFeatured: game.isFeatured || false,
      tags: Array.isArray(game.tags) ? game.tags.join(', ') : '',
      questions: game.questions || []
    });
    setImagePreview(game.imageUrl || '');
    setErrors({});
    setShowEditModal(true);
  };

  const handleDeleteClick = (game) => {
    setSelectedGame(game);
    setShowDeleteConfirm(true);
  };

  const handleDeleteGame = async () => {
    if (!selectedGame) return;

    setDeleteLoading(true);
    try {
      // Delete the game document
      await deleteDoc(doc(db, 'games', selectedGame.id));

      // Delete the game image from storage if exists
      if (selectedGame.imageUrl) {
        try {
          const imageRef = ref(storage, `games/${selectedGame.id}`);
          await deleteObject(imageRef);
        } catch (error) {
          console.error('Error deleting game image:', error);
        }
      }

      // Delete all game progress for this game
      const progressQuery = query(
        collection(db, 'gameProgress'),
        where('gameId', '==', selectedGame.id)
      );
      const progressSnapshot = await getDocs(progressQuery);
      
      // Delete each progress document
      const deletePromises = progressSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Update local state
      setGames(prev => prev.filter(game => game.id !== selectedGame.id));
      
      addNotification({
        type: 'success',
        title: 'Game Deleted',
        message: `${selectedGame.title} has been deleted successfully`
      });

      // Create admin action log
      await addDoc(collection(db, 'adminActions'), {
        action: 'game_deleted',
        gameId: selectedGame.id,
        gameTitle: selectedGame.title,
        deletedBy: 'admin',
        timestamp: serverTimestamp(),
        affectedProgress: progressSnapshot.size
      });

    } catch (error) {
      console.error('Error deleting game:', error);
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete game. Please try again.'
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setSelectedGame(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleQuestionsChange = (questions) => {
    setFormData(prev => ({
      ...prev,
      questions
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Game title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.gradeLevel) newErrors.gradeLevel = 'Grade level is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.maxScore) newErrors.maxScore = 'Max score is required';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    
    if (formData.gradeLevel && (formData.gradeLevel < 1 || formData.gradeLevel > 12)) {
      newErrors.gradeLevel = 'Grade level must be between 1 and 12';
    }
    
    if (formData.duration && formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }
    
    if (formData.maxScore && formData.maxScore < 1) {
      newErrors.maxScore = 'Max score must be at least 1';
    }

    // Validate questions for quiz games
    if (formData.gameType === 'quiz' && (!formData.questions || formData.questions.length === 0)) {
      newErrors.questions = 'Quiz games must have at least one question';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      let imageUrl = selectedGame?.imageUrl || '';
      
      // Upload image if new file is selected
      if (imageFile) {
        const imageRef = ref(storage, `games/${selectedGame?.id || Date.now()}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const gameData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject,
        gradeLevel: parseInt(formData.gradeLevel),
        difficulty: formData.difficulty,
        gameType: formData.gameType,
        duration: parseInt(formData.duration),
        maxScore: parseInt(formData.maxScore),
        instructions: formData.instructions.trim(),
        learningObjectives: formData.learningObjectives.trim(),
        prerequisites: formData.prerequisites.trim(),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        imageUrl,
        questions: formData.gameType === 'quiz' ? formData.questions : [],
        updatedAt: serverTimestamp()
      };

      if (selectedGame) {
        // Update existing game
        await updateDoc(doc(db, 'games', selectedGame.id), gameData);
        
        addNotification({
          type: 'success',
          title: 'Game Updated',
          message: `${formData.title} has been updated successfully`
        });
        
        setShowEditModal(false);
      } else {
        // Add new game
        gameData.createdAt = serverTimestamp();
        gameData.playCount = 0;
        gameData.avgScore = 0;
        gameData.ratings = [];
        
        const docRef = await addDoc(collection(db, 'games'), gameData);
        
        // Create notification for new game
        await addDoc(collection(db, 'notifications'), {
          type: 'new_game',
          title: 'New Game Added',
          message: `${formData.title} is now available to play!`,
          gameId: docRef.id,
          gameTitle: formData.title,
          subject: formData.subject,
          gradeLevel: formData.gradeLevel,
          createdAt: serverTimestamp(),
          read: false,
          priority: 'low'
        });
        
        addNotification({
          type: 'success',
          title: 'Game Added',
          message: `${formData.title} has been added successfully`
        });
        
        setShowAddModal(false);
      }
      
      // Refresh games list
      fetchGames();
      setSelectedGame(null);
      setImageFile(null);
      setImagePreview('');
      
    } catch (error) {
      console.error('Error saving game:', error);
      setErrors({ submit: 'Failed to save game' });
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save game. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
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

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="game-form" id="game-form">
      <div className="form-section">
        <h4>Basic Information</h4>
        
        <div className="form-row">
          <InputField
            name="title"
            placeholder="Game Title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="neon-input"
            >
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
              <option value="geography">Geography</option>
              <option value="computer">Computer Science</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            placeholder="Game description..."
            value={formData.description}
            onChange={handleChange}
            className="neon-input"
            rows="3"
            style={{ resize: 'vertical' }}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-row">
          <InputField
            type="number"
            name="gradeLevel"
            placeholder="Grade Level (1-12)"
            value={formData.gradeLevel}
            onChange={handleChange}
            error={errors.gradeLevel}
            min="1"
            max="12"
            required
          />
          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="neon-input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Game Type</label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="neon-input"
            >
              <option value="quiz">Quiz</option>
              <option value="puzzle">Puzzle</option>
              <option value="simulation">Simulation</option>
              <option value="adventure">Adventure</option>
              <option value="memory">Memory</option>
              <option value="strategy">Strategy</option>
            </select>
          </div>
          <InputField
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            error={errors.duration}
            min="1"
            required
          />
          <InputField
            type="number"
            name="maxScore"
            placeholder="Max Score"
            value={formData.maxScore}
            onChange={handleChange}
            error={errors.maxScore}
            min="1"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h4>Game Details</h4>
        
        <div className="form-group">
          <label className="form-label">Instructions</label>
          <textarea
            name="instructions"
            placeholder="How to play this game..."
            value={formData.instructions}
            onChange={handleChange}
            className="neon-input"
            rows="4"
            style={{ resize: 'vertical' }}
          />
          {errors.instructions && <span className="error-text">{errors.instructions}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Learning Objectives</label>
          <textarea
            name="learningObjectives"
            placeholder="What students will learn..."
            value={formData.learningObjectives}
            onChange={handleChange}
            className="neon-input"
            rows="3"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Prerequisites</label>
          <textarea
            name="prerequisites"
            placeholder="What students should know before playing..."
            value={formData.prerequisites}
            onChange={handleChange}
            className="neon-input"
            rows="2"
            style={{ resize: 'vertical' }}
          />
        </div>

        <InputField
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          error={errors.tags}
        />
      </div>

      <div className="form-section">
        <h4>Game Settings</h4>
        
        <div className="form-group">
          <label className="form-label">Game Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="neon-input"
          />
          {errors.image && <span className="error-text">{errors.image}</span>}
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={imagePreview} 
                alt="Game preview" 
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  borderRadius: '8px',
                  border: '2px solid #00ff88'
                }}
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span>Active (Game is playable)</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <span>Featured (Show on homepage)</span>
          </label>
        </div>
      </div>

      {/* Questions Section for Quiz Games */}
      {formData.gameType === 'quiz' && (
        <div className="form-section">
          <h4>Quiz Questions</h4>
          {errors.questions && (
            <div className="form-error" style={{ marginBottom: '15px' }}>
              {errors.questions}
            </div>
          )}
          <QuestionForm
            questions={formData.questions}
            onQuestionsChange={handleQuestionsChange}
            subject={formData.subject}
          />
        </div>
      )}

      {errors.submit && (
        <div className="form-error">{errors.submit}</div>
      )}
    </form>
  );

  return (
    <motion.div
      className="game-management"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="management-header" variants={itemVariants}>
        <div>
          <h2>Game Management</h2>
          <p>Create and manage educational games</p>
        </div>
        <motion.button
          className="btn-neon"
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>+ Add Game</span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          data={games}
          columns={columns}
          loading={loading}
          searchable={true}
          sortable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No games created yet"
        />
      </motion.div>

      {/* Add Game Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Game"
        size="large"
        footer={
          <div className="modal-actions">
            <button
              type="button"
              className="btn-neon-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="game-form"
              className="btn-neon"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        }
      >
        {renderForm()}
      </Modal>

      {/* Edit Game Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Game"
        size="large"
        footer={
          <div className="modal-actions">
            <button
              type="button"
              className="btn-neon-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="game-form"
              className="btn-neon"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Game'}
            </button>
          </div>
        }
      >
        {renderForm()}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        size="small"
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h3 style={{ marginBottom: '15px', color: '#ff4444' }}>
            Delete {selectedGame?.title}?
          </h3>
          <p style={{ marginBottom: '20px', color: '#ccc' }}>
            This action will permanently delete the game and all associated data including:
          </p>
          <ul style={{ textAlign: 'left', marginBottom: '20px', color: '#aaa' }}>
            <li>All game progress and scores</li>
            <li>All analytics data</li>
            <li>All leaderboard entries</li>
          </ul>
          <p style={{ color: '#ff4444', fontWeight: 'bold' }}>
            This action cannot be undone!
          </p>
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              className="btn-neon-secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button
              className="btn-neon"
              onClick={handleDeleteGame}
              disabled={deleteLoading}
              style={{ background: '#ff4444' }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Game'}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default GameManagement;