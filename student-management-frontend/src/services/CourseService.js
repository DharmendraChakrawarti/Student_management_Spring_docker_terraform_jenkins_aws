import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const REST_API_BASE_URL = API_BASE + '/api/courses';

export const listCourses = () => {
    return axios.get(REST_API_BASE_URL);
}

export const createCourse = (course) => {
    return axios.post(REST_API_BASE_URL, course);
}

export const getCourse = (courseId) => {
    return axios.get(REST_API_BASE_URL + '/' + courseId);
}

export const updateCourse = (courseId, course) => {
    return axios.put(REST_API_BASE_URL + '/' + courseId, course);
}

export const deleteCourse = (courseId) => {
    return axios.delete(REST_API_BASE_URL + '/' + courseId);
}
