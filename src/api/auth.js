import axios from 'axios';

// const apiUrl = 'http://localhost:5000/api/auth';
const apiUrl ='https://tree-backend-avvs.onrender.com/api/auth';

// Send OTP to phone number
export const sendOtp = async (phone_number) => {
  try {
    const response = await axios.post(`${apiUrl}/send-otp`, { phone_number });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const profile = async (userId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    const response = await axios.get(`${apiUrl}/get/profile`, {
      params: { _id: userId },  // Send as query parameter
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    // Return the data property from the response
    if (response.data && response.data.code === 200) {
      return response.data.data;  // Return the user data from the response
    } else {
      throw new Error(response.data?.msg || 'Failed to fetch profile');
    }
  } catch (error) {
    console.error('Error in profile API:', error);
    throw error.response?.data || error;
  }
};

export const updateProfile = async (data) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.post(`${apiUrl}/update/profile`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    
    // Handle the response structure
    if (response.data && response.data.code === 200) {
      return response.data.data;  // Return the updated user data
    } else {
      throw new Error(response.data?.msg || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || error;
  }
};

export const forgotPassword = async ({ email, newPassword }) => {
  try {
    const response = await axios.post(`${apiUrl}/forgot/Password`, { email, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (data) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.post(`${apiUrl}/reset/password`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const purchaseTrees = async (data) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.post(`${apiUrl}/purchase/sapling`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSaplings = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.get(`${apiUrl}/get/sapling`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteSaplingOrder = async (orderId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.delete(`${apiUrl}/delete/sapling/${orderId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add a family member for the current user
 * @param {Object} memberData - Family member data
 * @param {string} memberData.name - Name of the family member (optional)
 * @param {string} memberData.relationship - Relationship (required)
 * @param {string|Date} memberData.dateOfBirth - Date of birth (required)
 * @param {string} memberData.phone_number - Phone number (optional)
 * @param {string} memberData.user_id - User ID (required)
 */
export const savedFamilyMember = async ({ name, relationship, dateOfBirth, phone_number, user_id, email }) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    // POST to /add/family/member with correct params
    const response = await axios.post(
      `${apiUrl}/add/family/member`,
      { name, relationship, dateOfBirth, phone_number, user_id, email },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMembers = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.get(`${apiUrl}/get/family/members`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deletefamilymember = async (Id) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.delete(`${apiUrl}/delete/family/member/${Id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteAccount = async (Id) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.delete(`${apiUrl}/delete-account`, {
      data: { Id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRecentActivities = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.get(`${apiUrl}/recent-activities`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};