package com.example.sms.mapper;

import com.example.sms.dto.StudentDto;
import com.example.sms.entity.Student;

public class StudentMapper {

    public static StudentDto mapToStudentDto(Student student) {
        StudentDto studentDto = new StudentDto(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getUser() != null ? student.getUser().getUsername() : null,
                null, // Password not exposed
                student.getAcademicYear() != null ? student.getAcademicYear().getId() : null,
                student.getStandard() != null ? student.getStandard().getId() : null,
                student.getSection() != null ? student.getSection().getId() : null,
                student.getGender(),
                student.getDob(),
                student.getGuardianName(),
                student.getGuardianPhone(),
                student.getRollNumber());
        return studentDto;
    }

    public static Student mapToStudent(StudentDto studentDto) {
        Student student = new Student();
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setGender(studentDto.getGender());
        student.setDob(studentDto.getDob());
        student.setGuardianName(studentDto.getGuardianName());
        student.setGuardianPhone(studentDto.getGuardianPhone());
        return student;
    }
}
