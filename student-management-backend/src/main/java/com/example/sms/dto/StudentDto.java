package com.example.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;

    // User account details
    private String username;
    private String password; // optional for updates

    // Academic details
    private Long academicYearId;
    private Long standardId;
    private Long sectionId;

    private String gender;
    private LocalDate dob;
    private String guardianName;
    private String guardianPhone;

    // Read-only
    private String rollNumber;
}
