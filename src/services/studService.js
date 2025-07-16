// services/studService.js
const Stud = require('../models/Stud');

/**
 * Find all students by teacher ID
 * @param {string} teacherId - ID of the teacher
 * @returns {Promise<Array>} - Array of student documents
 */
exports.findStudentsByTeacher = async (teacherId) => {
  return await Stud.find({ createdBy: teacherId }).sort({ createdAt: -1 });
};

/**
 * Find a student by email
 * @param {string} email - Student's email
 * @returns {Promise<Object|null>} - Student document or null
 */
exports.findStudentByEmail = async (email) => {
  return await Stud.findOne({ email });
};

/**
 * Find a student by ID
 * @param {string} studentId - Student's ID
 * @returns {Promise<Object|null>} - Student document or null
 */
exports.findStudentById = async (studentId) => {
  return await Stud.findById(studentId);
};

/**
 * Create a new student
 * @param {Object} studentData - Student data
 * @returns {Promise<Object>} - New student document
 */
exports.createStudent = async (studentData) => {
  const student = new Stud(studentData);
  return await student.save();
};

/**
 * Update a student by ID
 * @param {string} studentId - Student's ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated student document or null
 */
exports.updateStudent = async (studentId, updateData) => {
  return await Stud.findByIdAndUpdate(
    studentId,
    { $set: updateData },
    { new: true }
  );
};

/**
 * Delete a student by ID
 * @param {string} studentId - Student's ID
 * @returns {Promise<Object|null>} - Deleted student document or null
 */
exports.deleteStudent = async (studentId) => {
  return await Stud.findByIdAndRemove(studentId);
};

/**
 * Check if a student belongs to a teacher
 * @param {Object} student - Student document
 * @param {string} teacherId - Teacher's ID
 * @returns {boolean} - True if student belongs to teacher
 */
exports.isStudentOwnedByTeacher = (student, teacherId) => {
  return student.createdBy.toString() === teacherId;
};