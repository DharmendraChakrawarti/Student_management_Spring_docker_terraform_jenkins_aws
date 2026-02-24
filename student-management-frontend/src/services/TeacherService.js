// src/services/TeacherService.js
import axios from 'axios';
import { TEACHER_API_BASE } from './apiConfig';

export const getAllTeachers = () => axios.get(TEACHER_API_BASE);

export const registerTeacher = (teacherDto) => 
    axios.post(`${TEACHER_API_BASE}/register`, teacherDto);

export const getTeacherById = (teacherId) => 
    axios.get(`${TEACHER_API_BASE}/${teacherId}`);

export const updateTeacher = (teacherId, teacherDto) => 
    axios.put(`${TEACHER_API_BASE}/${teacherId}`, teacherDto);

export const deleteTeacher = (teacherId) => 
    axios.delete(`${TEACHER_API_BASE}/${teacherId}`);