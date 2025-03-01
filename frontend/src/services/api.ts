// src/services/api.ts
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

export const createRoom = async (adminId: string) => {
  const response = await axios.post(`${API_BASE_URL}/rooms`, { adminId });
  return response.data;
};

export const getRooms = async () => {
  const response = await axios.get(`${API_BASE_URL}/rooms`);
  return response.data;
};