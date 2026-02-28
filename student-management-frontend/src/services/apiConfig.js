// src/services/apiConfig.js

// ================================================================
// API BASE URL CONFIGURATION
// ================================================================
// In Docker:
//   - The React app is served by Nginx at http://localhost:3000
//   - Nginx reverse-proxies /api/* requests to the backend container
//   - So browser calls go to http://localhost:3000/api/... → backend:8080/api/...
//   - We use an EMPTY string ("") as the base URL so axios calls
//     go to the SAME origin (i.e. the Nginx server)
//
// In Local Dev (npm run dev):
//   - Vite dev server runs at http://localhost:5173
//   - Backend runs at http://localhost:8080
//   - Use VITE_API_BASE_URL=http://localhost:8080 in .env or shell
// ================================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const AUTH_API_BASE = `${API_BASE_URL}/api/auth`;
export const STUDENT_API_BASE = `${API_BASE_URL}/api/students`;
export const TEACHER_API_BASE = `${API_BASE_URL}/api/teachers`;
export const ACADEMIC_API_BASE = `${API_BASE_URL}/api/academic`;