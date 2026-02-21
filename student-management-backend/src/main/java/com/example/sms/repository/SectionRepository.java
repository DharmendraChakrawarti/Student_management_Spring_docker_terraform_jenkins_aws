package com.example.sms.repository;

import com.example.sms.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SectionRepository extends JpaRepository<Section, Long> {
    Optional<Section> findByName(String name);
}
