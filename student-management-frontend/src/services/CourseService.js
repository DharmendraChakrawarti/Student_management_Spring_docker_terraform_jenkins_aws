// src/services/CourseService.js
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const COURSE_API_BASE = `${API_BASE_URL}/api/courses`;

export const getAllCourses = () => axios.get(COURSE_API_BASE);
export const listCourses = getAllCourses; // Alias used by ListCourseComponent

export const getCourseById = (id) => axios.get(`${COURSE_API_BASE}/${id}`);
export const getCourse = getCourseById; // Alias used by CourseComponent

export const createCourse = (course) => axios.post(COURSE_API_BASE, course);

export const updateCourse = (id, course) => axios.put(`${COURSE_API_BASE}/${id}`, course);

export const deleteCourse = (id) => axios.delete(`${COURSE_API_BASE}/${id}`);