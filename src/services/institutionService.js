// src/services/institutionService.js
import api from './api';

/**
 * Get all institutions
 * @returns {Promise<Array>} Array of institution objects
 */
export const getInstitutions = async () => {
  try {
    const response = await api.getInstitutions();
    return response.data;
  } catch (error) {
    console.error('Error fetching institutions:', error);
    throw error;
  }
};

/**
 * Get a single institution by ID
 * @param {string} id - Institution ID
 * @returns {Promise<Object>} Institution object
 */
export const getInstitution = async (id) => {
  try {
    const response = await api.getInstitution(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institution with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new institution
 * @param {Object} institutionData - Institution data object
 * @returns {Promise<Object>} Created institution object
 */
export const createInstitution = async (institutionData) => {
  try {
    const response = await api.createInstitution(institutionData);
    return response.data;
  } catch (error) {
    console.error('Error creating institution:', error);
    throw error;
  }
};

/**
 * Update an existing institution
 * @param {string} id - Institution ID
 * @param {Object} institutionData - Updated institution data
 * @returns {Promise<Object>} Updated institution object
 */
export const updateInstitution = async (id, institutionData) => {
  try {
    const response = await api.updateInstitution(id, institutionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating institution with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an institution
 * @param {string} id - Institution ID
 * @returns {Promise<Object>} Success response
 */
export const deleteInstitution = async (id) => {
  try {
    const response = await api.deleteInstitution(id);
    return response;
  } catch (error) {
    console.error(`Error deleting institution with ID ${id}:`, error);
    throw error;
  }
};