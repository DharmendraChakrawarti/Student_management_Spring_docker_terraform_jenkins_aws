package com.example.sms.controller;

import com.example.sms.entity.AcademicYear;
import com.example.sms.entity.Section;
import com.example.sms.entity.Standard;
import com.example.sms.entity.Subject;
import com.example.sms.service.AcademicService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/academic")
@AllArgsConstructor
public class AcademicController {

    private AcademicService academicService;

    // Academic Years
    @PostMapping("/years")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicYear> createAcademicYear(@RequestBody AcademicYear academicYear) {
        return new ResponseEntity<>(academicService.createAcademicYear(academicYear), HttpStatus.CREATED);
    }

    @GetMapping("/years")
    public ResponseEntity<List<AcademicYear>> getAllAcademicYears() {
        return new ResponseEntity<>(academicService.getAllAcademicYears(), HttpStatus.OK);
    }

    // Standards (Classes)
    @PostMapping("/standards")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Standard> createStandard(@RequestBody Standard standard) {
        return new ResponseEntity<>(academicService.createStandard(standard), HttpStatus.CREATED);
    }

    @GetMapping("/standards")
    public ResponseEntity<List<Standard>> getAllStandards() {
        return new ResponseEntity<>(academicService.getAllStandards(), HttpStatus.OK);
    }

    // Sections
    @PostMapping("/sections")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Section> createSection(@RequestBody Section section) {
        return new ResponseEntity<>(academicService.createSection(section), HttpStatus.CREATED);
    }

    @GetMapping("/sections")
    public ResponseEntity<List<Section>> getAllSections() {
        return new ResponseEntity<>(academicService.getAllSections(), HttpStatus.OK);
    }

    // Subjects
    @PostMapping("/subjects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        return new ResponseEntity<>(academicService.createSubject(subject), HttpStatus.CREATED);
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return new ResponseEntity<>(academicService.getAllSubjects(), HttpStatus.OK);
    }
}
