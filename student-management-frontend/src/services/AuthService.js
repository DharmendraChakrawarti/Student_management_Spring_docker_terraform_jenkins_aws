import axios from "axios";

// When running inside docker, backend service name = backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://backend:8080";

const AUTH_REST_API_BASE_URL = API_BASE + "/api/auth";

export const registerAPICall = (registerObj) =>
  axios.post(AUTH_REST_API_BASE_URL + "/register", registerObj);

export const loginAPICall = (usernameOrEmail, password) =>
  axios.post(AUTH_REST_API_BASE_URL + "/login", { usernameOrEmail, password });

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

export const getLoggedInUser = () => {
  return sessionStorage.getItem("authenticatedUser");
};

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const isAdminUser = () => {
  return sessionStorage.getItem("role") === "ADMIN";
};

export const isTeacherUser = () => {
  return sessionStorage.getItem("role") === "TEACHER";
};

export const isStudentUser = () => {
  return sessionStorage.getItem("role") === "STUDENT";
};

export const getUserRole = () => {
  return sessionStorage.getItem("role");
};

// Axios interceptor to attach JWT token
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