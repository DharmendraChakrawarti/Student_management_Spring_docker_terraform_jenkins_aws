import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const BASE_URL = API_BASE + "/api/teachers";

// Auth headers are handled automatically by the axios interceptor in AuthService.js

export const registerTeacher = (teacher) => axios.post(`${BASE_URL}/register`, teacher);
export const getTeacherById = (id) => axios.get(`${BASE_URL}/${id}`);
export const getAllTeachers = () => axios.get(BASE_URL);
export const updateTeacher = (id, teacher) => axios.put(`${BASE_URL}/${id}`, teacher);
export const deleteTeacher = (id) => axios.delete(`${BASE_URL}/${id}`);
