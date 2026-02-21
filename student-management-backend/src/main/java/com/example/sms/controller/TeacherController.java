package com.example.sms.controller;

import com.example.sms.dto.TeacherDto;
import com.example.sms.service.TeacherService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private TeacherService teacherService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherDto> registerTeacher(@RequestBody TeacherDto teacherDto) {
        TeacherDto saved = teacherService.registerTeacher(teacherDto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<TeacherDto> getTeacherById(@PathVariable("id") Long teacherId) {
        return ResponseEntity.ok(teacherService.getTeacherById(teacherId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherDto> updateTeacher(@PathVariable("id") Long teacherId,
            @RequestBody TeacherDto teacherDto) {
        return ResponseEntity.ok(teacherService.updateTeacher(teacherId, teacherDto));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTeacher(@PathVariable("id") Long teacherId) {
        teacherService.deleteTeacher(teacherId);
        return ResponseEntity.ok("Teacher deleted successfully");
    }
}
