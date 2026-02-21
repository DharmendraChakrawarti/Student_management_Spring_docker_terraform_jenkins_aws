package com.example.sms;

import com.example.sms.entity.Role;
import com.example.sms.entity.User;
import com.example.sms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class StudentManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentManagementSystemApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.count() == 0) {
				User admin = new User();
				admin.setName("Admin User");
				admin.setUsername("admin");
				admin.setEmail("admin@gmail.com");
				admin.setPassword(passwordEncoder.encode("admin"));
				admin.setRole(Role.ADMIN);
				userRepository.save(admin);
				System.out.println("Default admin user created: admin / admin");
			}
		};
	}

}
