export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
console.log(import.meta.env.VITE_API_BASE_URL, "000000000000")
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
  },
  DASHBOARD: {
    SITTERS_LIST: `${API_BASE_URL}/dashboard/sitters`,
    UPDATE_STATUS: (id: string | number) => `${API_BASE_URL}/dashboard/sitters/${id}/status`,
    SITTER_INFO: (id: string | number) => `${API_BASE_URL}/dashboard/sitters/${id}`,

    OWNERS_LIST: `${API_BASE_URL}/dashboard/owners`,
    OWNER_STATUS: (id: string | number) => `${API_BASE_URL}/dashboard/owners/${id}/status`,
    OWNER_INFO: (id: string | number) => `${API_BASE_URL}/dashboard/owners/${id}`,
    OWNER_DELETE: (id: string | number) => `${API_BASE_URL}/dashboard/owners/${id}`,
  },
  USER_MANAGEMENT: {
    BASE: `${API_BASE_URL}/user-management`,
    SEND_OTP: `${API_BASE_URL}/user-management/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/user-management/verify-otp`,
    CREATE_USER: `${API_BASE_URL}/user-management`,
    FETCH_ALL_USERS: `${API_BASE_URL}/user-management`,
    UPDATE_USER: (id: string | number) => `${API_BASE_URL}/user-management/${id}`,
    BY_ID: (id: string | number) => `${API_BASE_URL}/user-management/${id}`,
  }
};
