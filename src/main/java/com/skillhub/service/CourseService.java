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

    @Transactional(readOnly = true)
    public Page<CourseDto> getCourses(String search, Long categoryId, String levelStr,
            Double minPrice, Double maxPrice, Boolean published, Pageable pageable) {
        // Parse level if provided
        final CourseLevel finalLevel;
        if (levelStr != null && !levelStr.isEmpty()) {
            try {
                finalLevel = CourseLevel.valueOf(levelStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid level: " + levelStr);
            }
        } else {
            finalLevel = null;
        }

        // Get all courses based on published status
        List<Course> allCourses = published != null && published
                ? courseRepository.findByIsPublished(true)
                : courseRepository.findAll();

        // Apply filters
        List<Course> filtered = allCourses.stream()
                .filter(course -> {
                    // Search filter
                    if (search != null && !search.isEmpty()) {
                        String lowerSearch = search.toLowerCase();
                        boolean matches = course.getTitle().toLowerCase().contains(lowerSearch) ||
                                (course.getDescription() != null
                                        && course.getDescription().toLowerCase().contains(lowerSearch));
                        if (!matches)
                            return false;
                    }

                    // Category filter
                    if (categoryId != null) {
                        boolean hasCategory = course.getCategories().stream()
                                .anyMatch(cat -> cat.getId().equals(categoryId));
                        if (!hasCategory)
                            return false;
                    }

                    // Level filter
                    if (finalLevel != null && !course.getLevel().equals(finalLevel)) {
                        return false;
                    }

                    // Price filter
                    if (minPrice != null && course.getPrice() < minPrice) {
                        return false;
                    }
                    if (maxPrice != null && course.getPrice() > maxPrice) {
                        return false;
                    }

                    return true;
                })
                .collect(Collectors.toList());

        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());

        // Handle empty results or out of bounds
        if (start >= filtered.size()) {
            Page<Course> emptyPage = new org.springframework.data.domain.PageImpl<>(
                    List.of(), pageable, filtered.size());
            return emptyPage.map(this::convertToDto);
        }

        List<Course> paginatedList = filtered.subList(start, end);

        Page<Course> courses = new org.springframework.data.domain.PageImpl<>(
                paginatedList, pageable, filtered.size());

        return courses.map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public Page<CourseDto> filterCourses(String keyword, Long categoryId, CourseLevel level,
            Double minPrice, Double maxPrice, Pageable pageable) {
        Page<Course> courses;

        // If no filters, return all published courses
        if (keyword == null && categoryId == null && level == null && minPrice == null && maxPrice == null) {
            courses = courseRepository.findByIsPublished(true, pageable);
        }
        // If only keyword is provided
        else if (keyword != null && categoryId == null && level == null && minPrice == null && maxPrice == null) {
            courses = courseRepository.searchPublishedCourses(keyword, pageable);
        }
        // If only category is provided
        else if (keyword == null && categoryId != null && level == null && minPrice == null && maxPrice == null) {
            courses = courseRepository.findPublishedCoursesByCategory(categoryId, pageable);
        }
        // Complex filtering - need to filter in memory or use Specification
        else {
            List<Course> allCourses = courseRepository.findByIsPublished(true);

            // Apply filters
            List<Course> filtered = allCourses.stream()
                    .filter(course -> {
                        // Keyword filter
                        if (keyword != null && !keyword.isEmpty()) {
                            String lowerKeyword = keyword.toLowerCase();
                            boolean matches = course.getTitle().toLowerCase().contains(lowerKeyword) ||
                                    (course.getDescription() != null
                                            && course.getDescription().toLowerCase().contains(lowerKeyword));
                            if (!matches)
                                return false;
                        }

                        // Category filter
                        if (categoryId != null) {
                            boolean hasCategory = course.getCategories().stream()
                                    .anyMatch(cat -> cat.getId().equals(categoryId));
                            if (!hasCategory)
                                return false;
                        }

                        // Level filter
                        if (level != null && !course.getLevel().equals(level)) {
                            return false;
                        }

                        // Price filter
                        if (minPrice != null && course.getPrice() < minPrice) {
                            return false;
                        }
                        if (maxPrice != null && course.getPrice() > maxPrice) {
                            return false;
                        }

                        return true;
                    })
                    .collect(Collectors.toList());

            // Manual pagination
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), filtered.size());
            List<Course> paginatedList = filtered.subList(start, end);

            courses = new org.springframework.data.domain.PageImpl<>(
                    paginatedList, pageable, filtered.size());
        }

        return courses.map(this::convertToDto);
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
