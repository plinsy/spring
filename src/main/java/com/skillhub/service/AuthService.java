package com.skillhub.service;

import com.skillhub.dto.AuthResponse;
import com.skillhub.dto.LoginRequest;
import com.skillhub.dto.RegisterRequest;
import com.skillhub.dto.UserDto;
import com.skillhub.entity.User;
import com.skillhub.exception.BadRequestException;
import com.skillhub.repository.UserRepository;
import com.skillhub.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(convertToDto(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmailOrUsername(),
                        request.getPassword()));

        User user = (User) authentication.getPrincipal();

        // Generate tokens
        String accessToken = jwtTokenProvider.generateToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(convertToDto(user))
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        // Validate refresh token
        if (!jwtTokenProvider.isTokenValid(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        // Extract username and get user
        String username = jwtTokenProvider.extractUsername(refreshToken);
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByUsername(username))
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Generate new tokens
        String newAccessToken = jwtTokenProvider.generateToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .user(convertToDto(user))
                .build();
    }

    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
