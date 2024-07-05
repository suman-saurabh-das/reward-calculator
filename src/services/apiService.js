import axios from 'axios'

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCustomerData = async () => {
  try {
    const response = await apiClient.get("/transactionData");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions", error);
    throw error;
  }
};