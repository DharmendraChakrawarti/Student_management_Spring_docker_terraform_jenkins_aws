import axios from "axios";
import { AUTH_API_BASE } from "./apiConfig";

export const registerAPICall = (registerObj) =>
  axios.post(`${AUTH_API_BASE}/register`, registerObj);

export const loginAPICall = (usernameOrEmail, password) =>
  axios.post(`${AUTH_API_BASE}/login`, { usernameOrEmail, password });

// --- Token & Session Management ---
export const storeToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");

export const saveLoggedInUser = (username, role) => {
  sessionStorage.setItem("authenticatedUser", username);
  sessionStorage.setItem("role", role);
};

export const isUserLoggedIn = () => {
  const username = sessionStorage.getItem("authenticatedUser");
  return username !== null;
};

export const getLoggedInUser = () => sessionStorage.getItem("authenticatedUser");

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const isAdminUser = () => sessionStorage.getItem("role") === "ADMIN";
export const isTeacherUser = () => sessionStorage.getItem("role") === "TEACHER";
export const isStudentUser = () => sessionStorage.getItem("role") === "STUDENT";
export const getUserRole = () => sessionStorage.getItem("role");

// --- Axios Interceptor (MANDATORY for Security) ---
axios.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);