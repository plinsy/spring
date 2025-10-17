package com.skillhub.service;

import com.skillhub.dto.EnrollmentDto;
import com.skillhub.entity.Course;
import com.skillhub.entity.Enrollment;
import com.skillhub.entity.User;
import com.skillhub.repository.CourseRepository;
import com.skillhub.repository.EnrollmentRepository;
import com.skillhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<EnrollmentDto> getUserEnrollments(final String userEmail) {
        final User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        final List<Enrollment> enrollments = enrollmentRepository.findByStudent(user);
        return enrollments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EnrollmentDto getEnrollmentByCourseAndUser(final Long courseId, final String userEmail) {
        final User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        final Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        final Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(user, course)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        return convertToDTO(enrollment);
    }

    public EnrollmentDto enrollInCourse(final Long courseId, final String userEmail) {
        final User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        final Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if already enrolled
        if (enrollmentRepository.findByStudentAndCourse(user, course).isPresent()) {
            throw new RuntimeException("Already enrolled in this course");
        }

        final Enrollment enrollment = new Enrollment();
        enrollment.setStudent(user);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setProgressPercentage(0.0);
        enrollment.setIsCompleted(false);

        final Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Update course enrollment count
        course.setTotalEnrollments((course.getTotalEnrollments() != null ? course.getTotalEnrollments() : 0) + 1);
        courseRepository.save(course);

        return convertToDTO(savedEnrollment);
    }

    public EnrollmentDto getEnrollmentById(final Long id) {
        final Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        return convertToDTO(enrollment);
    }

    private EnrollmentDto convertToDTO(final Enrollment enrollment) {
        final EnrollmentDto dto = new EnrollmentDto();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setCourseId(enrollment.getCourse().getId());
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        dto.setCompletedAt(enrollment.getCompletedAt());
        dto.setProgressPercentage(enrollment.getProgressPercentage());
        dto.setIsCompleted(enrollment.getIsCompleted());
        dto.setCreatedAt(enrollment.getCreatedAt());
        dto.setUpdatedAt(enrollment.getUpdatedAt());
        return dto;
    }
}
