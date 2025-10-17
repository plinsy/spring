package com.skillhub.controller;

import com.skillhub.dto.ApiResponse;
import com.skillhub.dto.CourseDto;
import com.skillhub.dto.CreateCourseRequest;
import com.skillhub.dto.ModuleDto;
import com.skillhub.entity.User;
import com.skillhub.service.CourseService;
import com.skillhub.service.ModuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Course management APIs")
public class CourseController {

    private final CourseService courseService;
    private final ModuleService moduleService;

    @PostMapping
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Create course", description = "Create a new course (Instructor/Admin only)")
    public ResponseEntity<ApiResponse<CourseDto>> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal User instructor) {
        CourseDto course = courseService.createCourse(request, instructor);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully", course));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID", description = "Get course details by ID")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseById(@PathVariable Long id) {
        CourseDto course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @GetMapping
    @Operation(summary = "Get courses with filters", description = "Get courses with optional filters (search, category, level, price, published)")
    public ResponseEntity<Page<CourseDto>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false, defaultValue = "true") Boolean published,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {

        // Parse sort parameter (e.g., "createdAt,desc" or "title,asc")
        Sort sorting = Sort.unsorted();
        if (sort != null && !sort.isEmpty()) {
            String[] sortParts = sort.split(",");
            String sortBy = sortParts[0];
            String sortDir = sortParts.length > 1 ? sortParts[1] : "asc";
            sorting = sortDir.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();
        } else {
            sorting = Sort.by("createdAt").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sorting);
        Page<CourseDto> courses = courseService.getCourses(
                search, categoryId, level, minPrice, maxPrice, published, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    @Operation(summary = "Search courses", description = "Search courses by keyword")
    public ResponseEntity<ApiResponse<Page<CourseDto>>> searchCourses(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> courses = courseService.searchCourses(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get courses by category", description = "Get all courses in a specific category")
    public ResponseEntity<ApiResponse<Page<CourseDto>>> getCoursesByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> courses = courseService.getCoursesByCategory(categoryId, pageable);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/instructor/{instructorId}")
    @Operation(summary = "Get instructor courses", description = "Get all courses created by an instructor")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getInstructorCourses(@PathVariable Long instructorId) {
        List<CourseDto> courses = courseService.getInstructorCourses(instructorId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Update course", description = "Update course details (Owner/Admin only)")
    public ResponseEntity<ApiResponse<CourseDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal User user) {
        CourseDto course = courseService.updateCourse(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
    }

    @PutMapping("/{id}/publish")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Publish course", description = "Publish a course (Owner/Admin only)")
    public ResponseEntity<ApiResponse<CourseDto>> publishCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        CourseDto course = courseService.publishCourse(id, user);
        return ResponseEntity.ok(ApiResponse.success("Course published successfully", course));
    }

    @PutMapping("/{id}/unpublish")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Unpublish course", description = "Unpublish a course (Owner/Admin only)")
    public ResponseEntity<ApiResponse<CourseDto>> unpublishCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        CourseDto course = courseService.unpublishCourse(id, user);
        return ResponseEntity.ok(ApiResponse.success("Course unpublished successfully", course));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Delete course", description = "Delete a course (Owner/Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        courseService.deleteCourse(id, user);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    @GetMapping("/{id}/modules")
    @Operation(summary = "Get course modules", description = "Get all modules for a course with their lessons")
    public ResponseEntity<ApiResponse<List<ModuleDto>>> getCourseModules(@PathVariable Long id) {
        List<ModuleDto> modules = moduleService.getModulesByCourseId(id);
        return ResponseEntity.ok(ApiResponse.success("Course modules retrieved successfully", modules));
    }
}
