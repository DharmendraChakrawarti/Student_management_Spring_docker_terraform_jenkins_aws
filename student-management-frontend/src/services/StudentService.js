import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const REST_API_BASE_URL = API_BASE + '/api/students';

export const listStudents = () => axios.get(REST_API_BASE_URL);

export const createStudent = (student) => axios.post(REST_API_BASE_URL, student);

export const registerStudent = (studentDto) => axios.post(REST_API_BASE_URL + '/register', studentDto);

export const getStudent = (studentId) => axios.get(REST_API_BASE_URL + '/' + studentId);

export const updateStudent = (studentId, student) => {
    return axios.put(REST_API_BASE_URL + '/' + studentId, student);
}

export const deleteStudent = (studentId) => {
    return axios.delete(REST_API_BASE_URL + '/' + studentId);
}
