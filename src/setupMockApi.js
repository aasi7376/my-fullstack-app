// setupMockApi.js - Updated to use real API now that the backend is fixed
import { initMockApi, toggleMockMode } from './services/mockApi';

// IMPORTANT: Set to false to use the real backend API now that it's working
const useMockApi = false;

if (useMockApi) {
  console.log('🔶 Using Mock API for data (storing in localStorage)');
  toggleMockMode(true);
  initMockApi();
} else {
  console.log('🔶 Using Real API for data (storing in MongoDB)');
  toggleMockMode(false);
}

// Set a global flag to indicate mock mode status
window.IS_USING_MOCK_API = useMockApi;