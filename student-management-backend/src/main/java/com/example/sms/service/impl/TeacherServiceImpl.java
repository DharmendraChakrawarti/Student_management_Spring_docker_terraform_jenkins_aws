package com.example.sms.service.impl;

import com.example.sms.dto.TeacherDto;
import com.example.sms.entity.Role;
import com.example.sms.entity.Subject;
import com.example.sms.entity.Teacher;
import com.example.sms.entity.User;
import com.example.sms.repository.SubjectRepository;
import com.example.sms.repository.TeacherRepository;
import com.example.sms.repository.UserRepository;
import com.example.sms.service.TeacherService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private TeacherRepository teacherRepository;
    private UserRepository userRepository;
    private SubjectRepository subjectRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public TeacherDto registerTeacher(TeacherDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        if (dto.getUsername() != null && userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }

        // Create User account
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setName(dto.getFirstName() + (dto.getLastName() != null ? " " + dto.getLastName() : ""));
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.TEACHER);

        // Create Teacher
        Teacher teacher = new Teacher();
        teacher.setFirstName(dto.getFirstName());
        teacher.setLastName(dto.getLastName());
        teacher.setEmail(dto.getEmail());
        teacher.setQualification(dto.getQualification());
        teacher.setExperience(dto.getExperience());
        teacher.setUser(user);

        // Assign Subjects
        if (dto.getSubjectIds() != null && !dto.getSubjectIds().isEmpty()) {
            Set<Subject> subjects = new HashSet<>(subjectRepository.findAllById(dto.getSubjectIds()));
            teacher.setSubjects(subjects);
        }

        Teacher saved = teacherRepository.save(teacher);
        return mapToDto(saved);
    }

    @Override
    public TeacherDto getTeacherById(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));
        return mapToDto(teacher);
    }

    @Override
    public List<TeacherDto> getAllTeachers() {
        return teacherRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeacherDto updateTeacher(Long teacherId, TeacherDto dto) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        teacher.setFirstName(dto.getFirstName());
        teacher.setLastName(dto.getLastName());
        teacher.setEmail(dto.getEmail());
        teacher.setQualification(dto.getQualification());
        teacher.setExperience(dto.getExperience());

        if (dto.getSubjectIds() != null) {
            Set<Subject> subjects = new HashSet<>(subjectRepository.findAllById(dto.getSubjectIds()));
            teacher.setSubjects(subjects);
        }

        return mapToDto(teacherRepository.save(teacher));
    }

    @Override
    public void deleteTeacher(Long teacherId) {
        teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));
        teacherRepository.deleteById(teacherId);
    }

    private TeacherDto mapToDto(Teacher teacher) {
        TeacherDto dto = new TeacherDto();
        dto.setId(teacher.getId());
        dto.setFirstName(teacher.getFirstName());
        dto.setLastName(teacher.getLastName());
        dto.setEmail(teacher.getEmail());
        dto.setQualification(teacher.getQualification());
        dto.setExperience(teacher.getExperience());
        if (teacher.getSubjects() != null) {
            dto.setSubjectIds(teacher.getSubjects().stream().map(Subject::getId).collect(Collectors.toSet()));
        }
        return dto;
    }
}
