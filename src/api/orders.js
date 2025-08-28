import axios from 'axios';

// const apiUrl = 'http://localhost:5000/api/auth';
const apiUrl ='https://tree-backend-avvs.onrender.com/api/auth';
// Get orders with pagination
export const getOrders = async (userId, page = 1, limit = 3) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.get(`${apiUrl}/get/sapling?userId=${user.id}&page=${page}&limit=${limit}`, {
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
    await axios.post(`https://tree-backend-avvs.onrender.com/api/auth/update/profile`, {
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
 export const deleteOrder = async (orderId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${apiUrl}/delete/sapling/${orderId}`, {
      headers
    });
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};