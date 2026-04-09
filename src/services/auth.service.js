import api from './api';

export const authService = {
  // Send OTP to phone number
  sendOTP: async (phone) => {
    const response = await api.post('/auth/send-otp', { phone });
    return response;
  },

  // Verify OTP and login
  verifyOTP: async (phone, otp) => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/auth/profile', userData);
    return response;
  },

  // Complete user profile
  completeProfile: async (profileData) => {
    const response = await api.post('/auth/complete-profile', profileData);
    return response;
  },
};

export default authService;
