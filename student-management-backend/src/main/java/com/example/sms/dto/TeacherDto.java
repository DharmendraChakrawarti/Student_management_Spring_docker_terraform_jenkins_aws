package com.example.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String qualification;
    private String experience;

    // User account details (for registration)
    private String username;
    private String password;

    // Subject IDs to assign
    private Set<Long> subjectIds;
}
