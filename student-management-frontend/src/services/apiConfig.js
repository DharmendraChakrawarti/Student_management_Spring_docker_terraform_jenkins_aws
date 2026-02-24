// src/services/apiConfig.js

// Use environment variable if provided, otherwise default to localhost
// Note: 'http://backend:8080' only works inside Docker containers. 
// For the browser, you almost always want 'localhost' or a public IP.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const AUTH_API_BASE = `${API_BASE_URL}/api/auth`;
export const STUDENT_API_BASE = `${API_BASE_URL}/api/students`;
export const TEACHER_API_BASE = `${API_BASE_URL}/api/teachers`;
export const ACADEMIC_API_BASE = `${API_BASE_URL}/api/academic`;