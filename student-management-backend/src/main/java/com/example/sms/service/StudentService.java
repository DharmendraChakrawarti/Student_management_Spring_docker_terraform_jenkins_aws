package com.example.sms.service;

import com.example.sms.dto.StudentDto;

import java.util.List;

public interface StudentService {

    StudentDto registerStudent(StudentDto studentDto);

    StudentDto getStudentById(Long studentId);

    List<StudentDto> getAllStudents();

    StudentDto updateStudent(Long studentId, StudentDto studentDto);

    void deleteStudent(Long studentId);
}
