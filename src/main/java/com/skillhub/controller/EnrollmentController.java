package com.skillhub.controller;

import com.skillhub.dto.ApiResponse;
import com.skillhub.dto.EnrollmentDto;
import com.skillhub.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5174")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<EnrollmentDto>>> getUserEnrollments(
            @AuthenticationPrincipal final UserDetails userDetails) {
        final List<EnrollmentDto> enrollments = enrollmentService.getUserEnrollments(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Enrollments retrieved successfully", enrollments));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EnrollmentDto>> getEnrollmentByCourse(
            @PathVariable final Long courseId,
            @AuthenticationPrincipal final UserDetails userDetails) {
        final EnrollmentDto enrollment = enrollmentService.getEnrollmentByCourseAndUser(courseId,
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Enrollment retrieved successfully", enrollment));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EnrollmentDto>> enrollInCourse(
            @RequestBody final EnrollmentDto enrollmentDTO,
            @AuthenticationPrincipal final UserDetails userDetails) {
        final EnrollmentDto enrollment = enrollmentService.enrollInCourse(enrollmentDTO.getCourseId(),
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Enrolled successfully", enrollment));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EnrollmentDto>> getEnrollmentById(@PathVariable final Long id) {
        final EnrollmentDto enrollment = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment retrieved successfully", enrollment));
    }
}
