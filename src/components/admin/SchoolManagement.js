// src/pages/admin/SchoolManagement.js - Firebase Integrated Version
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import InputField from '../forms/InputField';
import { db } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { useNotifications } from '../../context/NotificationContext';

const SchoolManagement = () => {
  const { addNotification } = useNotifications();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    principalName: '',
    principalEmail: '',
    studentCount: '',
    teacherCount: '',
    subscription: 'basic',
    board: 'CBSE',
    medium: 'English',
    district: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch schools from Firebase
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const schoolsSnapshot = await getDocs(collection(db, 'schools'));
      const schoolsData = schoolsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format dates for display
        dateJoined: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
        lastActivity: doc.data().lastActive?.toDate?.()?.toLocaleDateString() || 'N/A'
      }));
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error fetching schools:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch schools'
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'School Name',
      width: '20%',
      render: (value, item) => (
        <div className="school-name-cell">
          <strong>{value}</strong>
          <div className="school-location">{item.city}, {item.state}</div>
        </div>
      )
    },
    {
      key: 'principalName',
      title: 'Principal',
      width: '15%'
    },
    {
      key: 'studentCount',
      title: 'Students',
      width: '10%',
      render: (value) => value?.toLocaleString() || '0'
    },
    {
      key: 'teacherCount',
      title: 'Teachers',
      width: '10%',
      render: (value) => value?.toLocaleString() || '0'
    },
    {
      key: 'subscription',
      title: 'Plan',
      width: '10%',
      render: (value) => (
        <span className={`subscription-badge ${value}`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1) || 'Basic'}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      width: '10%',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'dateJoined',
      title: 'Date Joined',
      width: '12%'
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '13%',
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
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      principalName: '',
      principalEmail: '',
      studentCount: '',
      teacherCount: '',
      subscription: 'basic',
      board: 'CBSE',
      medium: 'English',
      district: ''
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleEdit = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name || '',
      email: school.email || '',
      phone: school.phone || '',
      address: school.address || '',
      city: school.city || '',
      state: school.state || '',
      zipCode: school.zipCode || '',
      principalName: school.principalName || '',
      principalEmail: school.principalEmail || '',
      studentCount: school.studentCount?.toString() || '',
      teacherCount: school.teacherCount?.toString() || '',
      subscription: school.subscription || 'basic',
      board: school.board || 'CBSE',
      medium: school.medium || 'English',
      district: school.district || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleDeleteClick = (school) => {
    setSelectedSchool(school);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;

    setDeleteLoading(true);
    try {
      const batch = writeBatch(db);

      // Delete the school
      batch.delete(doc(db, 'schools', selectedSchool.id));

      // Delete all teachers associated with this school
      const teachersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'teacher'),
        where('schoolId', '==', selectedSchool.id)
      );
      const teachersSnapshot = await getDocs(teachersQuery);
      teachersSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete all students associated with this school
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('schoolId', '==', selectedSchool.id)
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      studentsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete all game progress for this school
      const progressQuery = query(
        collection(db, 'gameProgress'),
        where('schoolId', '==', selectedSchool.id)
      );
      const progressSnapshot = await getDocs(progressQuery);
      progressSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Commit all deletions
      await batch.commit();

      // Update local state
      setSchools(prev => prev.filter(school => school.id !== selectedSchool.id));
      
      addNotification({
        type: 'success',
        title: 'School Deleted',
        message: `${selectedSchool.name} and all associated data have been removed successfully`
      });

      // Create admin action log
      await addDoc(collection(db, 'adminActions'), {
        action: 'school_deleted',
        schoolId: selectedSchool.id,
        schoolName: selectedSchool.name,
        deletedBy: 'admin',
        timestamp: serverTimestamp(),
        affectedTeachers: teachersSnapshot.size,
        affectedStudents: studentsSnapshot.size
      });

    } catch (error) {
      console.error('Error deleting school:', error);
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete school. Please try again.'
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setSelectedSchool(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'School name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.principalName.trim()) newErrors.principalName = 'Principal name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const schoolData = {
        ...formData,
        studentCount: parseInt(formData.studentCount) || 0,
        teacherCount: parseInt(formData.teacherCount) || 0,
        status: 'active',
        updatedAt: serverTimestamp()
      };

      if (selectedSchool) {
        // Update existing school
        await updateDoc(doc(db, 'schools', selectedSchool.id), schoolData);
        
        addNotification({
          type: 'success',
          title: 'School Updated',
          message: `${formData.name} has been updated successfully`
        });
        
        setShowEditModal(false);
      } else {
        // Add new school
        schoolData.createdAt = serverTimestamp();
        schoolData.schoolCode = `SCH${Date.now().toString().slice(-6)}`;
        
        const docRef = await addDoc(collection(db, 'schools'), schoolData);
        
        // Create notification for new school
        await addDoc(collection(db, 'notifications'), {
          type: 'registration',
          title: 'New School Added',
          message: `${formData.name} has been added by admin`,
          schoolId: docRef.id,
          schoolName: formData.name,
          createdAt: serverTimestamp(),
          read: false,
          priority: 'medium',
          actionRequired: false
        });
        
        addNotification({
          type: 'success',
          title: 'School Added',
          message: `${formData.name} has been added successfully`
        });
        
        setShowAddModal(false);
      }
      
      // Refresh schools list
      fetchSchools();
      setSelectedSchool(null);
      
    } catch (error) {
      console.error('Error saving school:', error);
      setErrors({ submit: 'Failed to save school' });
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save school. Please try again.'
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
    <form onSubmit={handleSubmit} className="school-form" id="school-form">
      <div className="form-section">
        <h4>School Information</h4>
        
        <div className="form-row">
          <InputField
            name="name"
            placeholder="School Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <InputField
            type="email"
            name="email"
            placeholder="School Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </div>

        <div className="form-row">
          <InputField
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />
          <div className="form-group">
            <label className="form-label">Subscription Plan</label>
            <select
              name="subscription"
              value={formData.subscription}
              onChange={handleChange}
              className="neon-input"
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Board</label>
            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              className="neon-input"
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
              <option value="IB">IB</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Medium</label>
            <select
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              className="neon-input"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Regional">Regional</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Address</h4>
        
        <InputField
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          required
        />

        <div className="form-row">
          <InputField
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />
          <InputField
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
            required
          />
          <InputField
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            error={errors.district}
          />
        </div>

        <InputField
          name="zipCode"
          placeholder="ZIP Code"
          value={formData.zipCode}
          onChange={handleChange}
          error={errors.zipCode}
        />
      </div>

      <div className="form-section">
        <h4>Principal Information</h4>
        
        <div className="form-row">
          <InputField
            name="principalName"
            placeholder="Principal Name"
            value={formData.principalName}
            onChange={handleChange}
            error={errors.principalName}
            required
          />
          <InputField
            type="email"
            name="principalEmail"
            placeholder="Principal Email"
            value={formData.principalEmail}
            onChange={handleChange}
            error={errors.principalEmail}
          />
        </div>

        <div className="form-row">
          <InputField
            type="number"
            name="studentCount"
            placeholder="Number of Students"
            value={formData.studentCount}
            onChange={handleChange}
            error={errors.studentCount}
            min="0"
          />
          <InputField
            type="number"
            name="teacherCount"
            placeholder="Number of Teachers"
            value={formData.teacherCount}
            onChange={handleChange}
            error={errors.teacherCount}
            min="0"
          />
        </div>
      </div>

      {errors.submit && (
        <div className="form-error">{errors.submit}</div>
      )}
    </form>
  );

  return (
    <motion.div
      className="school-management"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="management-header" variants={itemVariants}>
        <div>
          <h2>School Management</h2>
          <p>Manage registered schools and their information</p>
        </div>
        <motion.button
          className="btn-neon"
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>+ Add School</span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          data={schools}
          columns={columns}
          loading={loading}
          searchable={true}
          sortable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No schools registered yet"
        />
      </motion.div>

      {/* Add School Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New School"
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
              form="school-form"
              className="btn-neon"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add School'}
            </button>
          </div>
        }
      >
        {renderForm()}
      </Modal>

      {/* Edit School Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit School"
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
              form="school-form"
              className="btn-neon"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update School'}
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
            Delete {selectedSchool?.name}?
          </h3>
          <p style={{ marginBottom: '20px', color: '#ccc' }}>
            This action will permanently delete the school and all associated data including:
          </p>
          <ul style={{ textAlign: 'left', marginBottom: '20px', color: '#aaa' }}>
            <li>All teachers registered under this school</li>
            <li>All students registered under this school</li>
            <li>All game progress and scores</li>
            <li>All analytics data</li>
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
              onClick={handleDeleteSchool}
              disabled={deleteLoading}
              style={{ background: '#ff4444' }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete School'}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default SchoolManagement;