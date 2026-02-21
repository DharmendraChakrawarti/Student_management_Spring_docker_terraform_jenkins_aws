package com.example.sms.service;

import com.example.sms.dto.TeacherDto;

import java.util.List;

public interface TeacherService {

    TeacherDto registerTeacher(TeacherDto teacherDto);

    TeacherDto getTeacherById(Long teacherId);

    List<TeacherDto> getAllTeachers();

    TeacherDto updateTeacher(Long teacherId, TeacherDto teacherDto);

    void deleteTeacher(Long teacherId);
}
