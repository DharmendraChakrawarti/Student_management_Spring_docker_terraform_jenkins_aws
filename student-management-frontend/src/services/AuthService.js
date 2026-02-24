import axios from "axios";
import { AUTH_API_BASE, API_BASE_URL } from "./apiConfig";

export const registerAPICall = (registerObj) =>
  axios.post(`${AUTH_API_BASE}/register`, registerObj);

export const loginAPICall = (usernameOrEmail, password) =>
  axios.post(`${AUTH_API_BASE}/login`, { usernameOrEmail, password });

// ... keep your existing token storage logic below ...