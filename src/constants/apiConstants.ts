export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_ROUTES = {
  AUTH: {
    CHECK: `${API_BASE_URL}/auth/check`,
    SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  ADMIN: {
    UPDATE_PROFILE: `${API_BASE_URL}/admin/profile`,
  }
};
