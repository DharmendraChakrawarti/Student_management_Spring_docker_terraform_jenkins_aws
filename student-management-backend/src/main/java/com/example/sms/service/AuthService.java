package com.example.sms.service;

import com.example.sms.dto.JwtAuthResponse;
import com.example.sms.dto.LoginDto;
import com.example.sms.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);

    JwtAuthResponse login(LoginDto loginDto);
}
