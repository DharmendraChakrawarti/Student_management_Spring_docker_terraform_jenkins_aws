import axios from 'axios';
import { STUDENT_API_BASE } from './apiConfig';

export const listStudents = () => axios.get(STUDENT_API_BASE);

export const registerStudent = (studentDto) => 
    axios.post(`${STUDENT_API_BASE}/register`, studentDto);

export const getStudent = (studentId) => 
    axios.get(`${STUDENT_API_BASE}/${studentId}`);

export const updateStudent = (studentId, student) => 
    axios.put(`${STUDENT_API_BASE}/${studentId}`, student);

export const deleteStudent = (studentId) => 
    axios.delete(`${STUDENT_API_BASE}/${studentId}`);