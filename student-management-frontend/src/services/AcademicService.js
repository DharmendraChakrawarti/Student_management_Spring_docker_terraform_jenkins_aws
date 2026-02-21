import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const ACADEMIC_API_BASE_URL = API_BASE + "/api/academic";

// Headers are handled by AuthService interceptor

// Academic Years
export const createAcademicYear = (year) => axios.post(ACADEMIC_API_BASE_URL + '/years', year);
export const getAllAcademicYears = () => axios.get(ACADEMIC_API_BASE_URL + '/years');

// Standards (Classes)
export const createStandard = (standard) => axios.post(ACADEMIC_API_BASE_URL + '/standards', standard);
export const getAllStandards = () => axios.get(ACADEMIC_API_BASE_URL + '/standards');

// Sections
export const createSection = (section) => axios.post(ACADEMIC_API_BASE_URL + '/sections', section);
export const getAllSections = () => axios.get(ACADEMIC_API_BASE_URL + '/sections');

// Subjects
export const createSubject = (subject) => axios.post(ACADEMIC_API_BASE_URL + '/subjects', subject);
export const getAllSubjects = () => axios.get(ACADEMIC_API_BASE_URL + '/subjects');
