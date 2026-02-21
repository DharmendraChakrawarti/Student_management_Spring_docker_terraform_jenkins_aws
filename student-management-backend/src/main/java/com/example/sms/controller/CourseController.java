package com.example.sms.controller;

import com.example.sms.entity.Course;
import com.example.sms.service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/courses")
@AllArgsConstructor
public class CourseController {

    private CourseService courseService;

    // Only ADMIN and TEACHER can create courses
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseService.createCourse(course);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }

    // Any authenticated user can view a course
    @GetMapping("{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable("id") Long courseId) {
        Course course = courseService.getCourseById(courseId);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    // Any authenticated user can list courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    // Only ADMIN and TEACHER can update courses
    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Course> updateCourse(@PathVariable("id") Long courseId,
            @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(courseId, course);
        return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
    }

    // Only ADMIN can delete courses
    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCourse(@PathVariable("id") Long courseId) {
        courseService.deleteCourse(courseId);
        return new ResponseEntity<>("Course successfully deleted!", HttpStatus.OK);
    }
}
