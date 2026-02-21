package com.example.sms.service.impl;

import com.example.sms.entity.AcademicYear;
import com.example.sms.entity.Section;
import com.example.sms.entity.Standard;
import com.example.sms.entity.Subject;
import com.example.sms.repository.AcademicYearRepository;
import com.example.sms.repository.SectionRepository;
import com.example.sms.repository.StandardRepository;
import com.example.sms.repository.SubjectRepository;
import com.example.sms.service.AcademicService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AcademicServiceImpl implements AcademicService {

    private AcademicYearRepository academicYearRepository;
    private StandardRepository standardRepository;
    private SectionRepository sectionRepository;
    private SubjectRepository subjectRepository;

    // Academic Year
    @Override
    public AcademicYear createAcademicYear(AcademicYear academicYear) {
        return academicYearRepository.save(academicYear);
    }

    @Override
    public List<AcademicYear> getAllAcademicYears() {
        return academicYearRepository.findAll();
    }

    @Override
    public AcademicYear getAcademicYearById(Long id) {
        return academicYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic Year not found with id: " + id));
    }

    // Standard
    @Override
    public Standard createStandard(Standard standard) {
        return standardRepository.save(standard);
    }

    @Override
    public List<Standard> getAllStandards() {
        return standardRepository.findAll();
    }

    @Override
    public Standard getStandardById(Long id) {
        return standardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Standard not found with id: " + id));
    }

    // Section
    @Override
    public Section createSection(Section section) {
        return sectionRepository.save(section);
    }

    @Override
    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    @Override
    public Section getSectionById(Long id) {
        return sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + id));
    }

    // Subject
    @Override
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Override
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Override
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
    }
}
