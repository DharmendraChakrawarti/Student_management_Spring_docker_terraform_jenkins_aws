import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const AUTH_REST_API_BASE_URL = API_BASE + "/api/auth";

export const registerAPICall = (registerObj) => axios.post(AUTH_REST_API_BASE_URL + '/register', registerObj);

export const loginAPICall = (usernameOrEmail, password) => axios.post(AUTH_REST_API_BASE_URL + '/login', { usernameOrEmail, password });

export const storeToken = (token) => localStorage.setItem("token", token);

export const getToken = () => localStorage.getItem("token");

export const saveLoggedInUser = (username, role) => {
    sessionStorage.setItem("authenticatedUser", username);
    sessionStorage.setItem("role", role);
}

export const isUserLoggedIn = () => {
    const username = sessionStorage.getItem("authenticatedUser");
    if (username == null) {
        return false;
    }
    return true;
}

export const getLoggedInUser = () => {
    const username = sessionStorage.getItem("authenticatedUser");
    return username;
}

export const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
}

export const isAdminUser = () => {
    let role = sessionStorage.getItem("role");
    if (role != null && role === 'ADMIN') {
        return true;
    }
    return false;
}

export const isTeacherUser = () => {
    let role = sessionStorage.getItem("role");
    return role != null && role === 'TEACHER';
}

export const isStudentUser = () => {
    let role = sessionStorage.getItem("role");
    return role != null && role === 'STUDENT';
}

export const getUserRole = () => {
    return sessionStorage.getItem("role");
}

// Add a request interceptor to include the token in all requests
axios.interceptors.request.use(function (config) {

    const token = getToken();

    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
