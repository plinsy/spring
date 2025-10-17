package com.skillhub.service;

import com.skillhub.dto.*;
import com.skillhub.entity.*;
import com.skillhub.exception.BadRequestException;
import com.skillhub.exception.ResourceNotFoundException;
import com.skillhub.exception.UnauthorizedException;
import com.skillhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final ReviewRepository reviewRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public CourseDto createCourse(CreateCourseRequest request, User instructor) {
        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only instructors can create courses");
        }

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .level(request.getLevel())
                .price(request.getPrice() != null ? request.getPrice() : 0.0)
                .isPublished(false)
                .instructor(instructor)
                .build();

        // Add categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
                categories.add(category);
            }
            course.setCategories(categories);
        }

        course = courseRepository.save(course);
        return convertToDto(course);
    }

    @Transactional(readOnly = true)
    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return convertToDto(course);
    }

    @Transactional(readOnly = true)
    public Page<CourseDto> getAllPublishedCourses(Pageable pageable) {
        return courseRepository.findByIsPublished(true, pageable)
                .map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public Page<CourseDto> searchCourses(String keyword, Pageable pageable) {
        return courseRepository.searchPublishedCourses(keyword, pageable)
                .map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public Page<CourseDto> getCoursesByCategory(Long categoryId, Pageable pageable) {
        return courseRepository.findPublishedCoursesByCategory(categoryId, pageable)
                .map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public List<CourseDto> getInstructorCourses(Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", instructorId));
        return courseRepository.findByInstructor(instructor).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseDto updateCourse(Long id, CreateCourseRequest request, User user) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        // Check authorization
        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You don't have permission to update this course");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setLevel(request.getLevel());
        if (request.getPrice() != null) {
            course.setPrice(request.getPrice());
        }

        // Update categories
        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
                categories.add(category);
            }
            course.setCategories(categories);
        }

        course = courseRepository.save(course);
        return convertToDto(course);
    }

    @Transactional
    public CourseDto publishCourse(Long id, User user) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You don't have permission to publish this course");
        }

        course.setIsPublished(true);
        course = courseRepository.save(course);
        return convertToDto(course);
    }

    @Transactional
    public CourseDto unpublishCourse(Long id, User user) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You don't have permission to unpublish this course");
        }

        course.setIsPublished(false);
        course = courseRepository.save(course);
        return convertToDto(course);
    }

    @Transactional
    public void deleteCourse(Long id, User user) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You don't have permission to delete this course");
        }

        courseRepository.delete(course);
    }

    private CourseDto convertToDto(Course course) {
        CourseDto dto = CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .level(course.getLevel())
                .isPublished(course.getIsPublished())
                .price(course.getPrice())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();

        // Set instructor
        if (course.getInstructor() != null) {
            dto.setInstructor(UserDto.builder()
                    .id(course.getInstructor().getId())
                    .username(course.getInstructor().getUsername())
                    .firstName(course.getInstructor().getFirstName())
                    .lastName(course.getInstructor().getLastName())
                    .profilePictureUrl(course.getInstructor().getProfilePictureUrl())
                    .build());
        }

        // Set categories
        if (course.getCategories() != null) {
            dto.setCategories(course.getCategories().stream()
                    .map(cat -> CategoryDto.builder()
                            .id(cat.getId())
                            .name(cat.getName())
                            .iconUrl(cat.getIconUrl())
                            .build())
                    .collect(Collectors.toSet()));
        }

        // Calculate statistics
        dto.setAverageRating(reviewRepository.getAverageRatingForCourse(course.getId()));
        dto.setTotalEnrollments(enrollmentRepository.countByCourseId(course.getId()).intValue());
        dto.setTotalModules(moduleRepository.countByCourseId(course.getId()).intValue());
        dto.setTotalLessons(lessonRepository.findAllByCourseId(course.getId()).size());

        return dto;
    }
}
