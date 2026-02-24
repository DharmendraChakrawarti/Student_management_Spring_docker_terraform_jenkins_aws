// src/services/AcademicService.js
import axios from 'axios';
import { ACADEMIC_API_BASE } from './apiConfig';

// Academic Years
export const getAllYears = () => axios.get(`${ACADEMIC_API_BASE}/years`);
export const createYear = (year) => axios.post(`${ACADEMIC_API_BASE}/years`, year);

// Standards (Classes)
export const getAllStandards = () => axios.get(`${ACADEMIC_API_BASE}/standards`);
export const createStandard = (standard) => axios.post(`${ACADEMIC_API_BASE}/standards`, standard);

// Sections
export const getAllSections = () => axios.get(`${ACADEMIC_API_BASE}/sections`);
export const createSection = (section) => axios.post(`${ACADEMIC_API_BASE}/sections`, section);

// Subjects
export const getAllSubjects = () => axios.get(`${ACADEMIC_API_BASE}/subjects`);
export const createSubject = (subject) => axios.post(`${ACADEMIC_API_BASE}/subjects`, subject);