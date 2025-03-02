// src/services/api.ts
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

console.log("API_BASE_URL:", API_BASE_URL); // Логирование базового URL

export const createRoom = async (adminId: string) => {
  console.log("Creating room with adminId:", adminId); // Логирование перед запросом
  try {
    console.log(`sending post request to ${API_BASE_URL}/rooms`);
    const response = await axios.post(`${API_BASE_URL}/rooms`, { adminId });
    console.log("Room created successfully:", response.data); // Логирование успешного ответа
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error); // Логирование ошибки
    throw error;
  }
};

export const getRooms = async () => {
  console.log("Fetching rooms..."); // Логирование перед запросом
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`);
    console.log("Rooms fetched successfully:", response.data); // Логирование успешного ответа
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error); // Логирование ошибки
    throw error;
  }
};