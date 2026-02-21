package com.example.sms.service.impl;

import com.example.sms.dto.StudentDto;
import com.example.sms.entity.*;
import com.example.sms.mapper.StudentMapper;
import com.example.sms.repository.*;
import com.example.sms.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements StudentService {

    private StudentRepository studentRepository;
    private UserRepository userRepository;
    private AcademicYearRepository academicYearRepository;
    private StandardRepository standardRepository;
    private SectionRepository sectionRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StudentDto registerStudent(StudentDto studentDto) {

        // 1. Create User
        if (userRepository.existsByEmail(studentDto.getEmail())) {
            throw new RuntimeException("Email is already exists!");
        }
        if (userRepository.findByUsername(studentDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already exists!");
        }

        User user = new User();
        user.setUsername(studentDto.getUsername());
        user.setName(
                studentDto.getFirstName() + (studentDto.getLastName() != null ? " " + studentDto.getLastName() : ""));
        user.setEmail(studentDto.getEmail());
        user.setPassword(passwordEncoder.encode(studentDto.getPassword()));
        user.setRole(Role.STUDENT);

        // 2. Create Student
        Student student = StudentMapper.mapToStudent(studentDto);
        student.setUser(user); // Cascade ALL will save User

        // 3. Assign Academic Details
        if (studentDto.getAcademicYearId() != null) {
            AcademicYear year = academicYearRepository.findById(studentDto.getAcademicYearId())
                    .orElseThrow(() -> new RuntimeException("Academic Year not found"));
            student.setAcademicYear(year);
        }

        if (studentDto.getStandardId() != null) {
            Standard standard = standardRepository.findById(studentDto.getStandardId())
                    .orElseThrow(() -> new RuntimeException("Standard not found"));
            student.setStandard(standard);
        }

        if (studentDto.getSectionId() != null) {
            Section section = sectionRepository.findById(studentDto.getSectionId())
                    .orElseThrow(() -> new RuntimeException("Section not found"));
            student.setSection(section);
        }

        // 4. Generate Roll Number (Simple Logic for now: Timestamp + Random)
        // In real app: Fetch max roll number for class and increment
        student.setRollNumber("R" + System.currentTimeMillis());

        Student savedStudent = studentRepository.save(student);

        return StudentMapper.mapToStudentDto(savedStudent);
    }

    @Override
    public StudentDto getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        return StudentMapper.mapToStudentDto(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(StudentMapper::mapToStudentDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto updateStudent(Long studentId, StudentDto studentDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setGender(studentDto.getGender());
        student.setDob(studentDto.getDob());
        student.setGuardianName(studentDto.getGuardianName());
        student.setGuardianPhone(studentDto.getGuardianPhone());

        // Note: Not updating User or Academic details in this simple update for now

        Student updatedStudent = studentRepository.save(student);
        return StudentMapper.mapToStudentDto(updatedStudent);
    }

    @Override
    public void deleteStudent(Long studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        studentRepository.deleteById(studentId);
    }
}
