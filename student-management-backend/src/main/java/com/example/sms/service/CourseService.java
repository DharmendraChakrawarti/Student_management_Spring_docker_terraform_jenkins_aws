package com.example.sms.service;

import com.example.sms.entity.Course;

import java.util.List;

public interface CourseService {

    Course createCourse(Course course);

    Course getCourseById(Long courseId);

    List<Course> getAllCourses();

    Course updateCourse(Long courseId, Course course);

    void deleteCourse(Long courseId);
}
