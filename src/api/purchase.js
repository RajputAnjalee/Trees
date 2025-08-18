import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/auth';

export const createOrder = async (order) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.post(`${apiUrl}/purchase/sapling`, order, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
