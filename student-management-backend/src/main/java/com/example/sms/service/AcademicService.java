package com.example.sms.service;

import com.example.sms.entity.AcademicYear;
import com.example.sms.entity.Section;
import com.example.sms.entity.Standard;
import com.example.sms.entity.Subject;

import java.util.List;

public interface AcademicService {

    // Academic Year
    AcademicYear createAcademicYear(AcademicYear academicYear);

    List<AcademicYear> getAllAcademicYears();

    AcademicYear getAcademicYearById(Long id);

    // Standard (Class)
    Standard createStandard(Standard standard);

    List<Standard> getAllStandards();

    Standard getStandardById(Long id);

    // Section
    Section createSection(Section section);

    List<Section> getAllSections();

    Section getSectionById(Long id);

    // Subject
    Subject createSubject(Subject subject);

    List<Subject> getAllSubjects();

    Subject getSubjectById(Long id);
}
