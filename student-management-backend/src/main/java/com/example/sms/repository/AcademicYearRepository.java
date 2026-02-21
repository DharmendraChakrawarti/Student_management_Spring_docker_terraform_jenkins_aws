package com.example.sms.repository;

import com.example.sms.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    Optional<AcademicYear> findByName(String name);

    boolean existsByName(String name);
}
