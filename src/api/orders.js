import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/auth';

export const getOrders = async (userId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.get(`${apiUrl}/get/sapling?${user.id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const confirmPlanting = async (orderId, userId, quantity, userStats) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    // Update user stats
    await axios.post(`http://localhost:5000/api/auth/update/profile`, {
      _id: userId,
      ...userStats
    }, {
      headers
    });
    // Update order status
    await axios.post(`${apiUrl}/update/${orderId}`, { planting_status: 'confirmed' }, {
      headers
    });
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};
