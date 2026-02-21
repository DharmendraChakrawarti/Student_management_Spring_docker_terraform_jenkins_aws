package com.example.sms.service.impl;

import com.example.sms.dto.JwtAuthResponse;
import com.example.sms.dto.LoginDto;
import com.example.sms.dto.RegisterDto;
import com.example.sms.entity.Role;
import com.example.sms.entity.User;
import com.example.sms.repository.UserRepository;
import com.example.sms.security.JwtTokenProvider;
import com.example.sms.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public String register(RegisterDto registerDto) {

        // check username exists in database
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }

        // check email exists in database
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email is already exists!");
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        // Default to STUDENT if not specified, otherwise map string to Role enum
        // ADMIN role cannot be self-registered — only pre-seeded
        if (registerDto.getRole() != null) {
            String roleStr = registerDto.getRole().toUpperCase();
            if ("ADMIN".equals(roleStr)) {
                throw new RuntimeException("Admin registration is not allowed. Contact system administrator.");
            }
            try {
                user.setRole(Role.valueOf(roleStr));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role! Allowed roles: STUDENT, TEACHER");
            }
        } else {
            user.setRole(Role.STUDENT);
        }

        userRepository.save(user);

        return "User registered successfully!.";
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(),
                loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                .orElseThrow();
        String role = user.getRole().name();

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(token);
        jwtAuthResponse.setRole(role);

        return jwtAuthResponse;
    }
}
