package com.skillhub.graphql;

import com.skillhub.dto.CourseDto;
import com.skillhub.dto.CreateCourseRequest;
import com.skillhub.dto.UserDto;
import com.skillhub.entity.CourseLevel;
import com.skillhub.entity.Role;
import com.skillhub.entity.User;
import com.skillhub.service.CourseService;
import com.skillhub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Controller
@RequiredArgsConstructor
public class CourseResolver {

    private final CourseService courseService;
    private final UserService userService;

    @QueryMapping
    public CourseDto course(@Argument Long id) {
        return courseService.getCourseById(id);
    }

    @QueryMapping
    public Map<String, Object> courses(@Argument int page, @Argument int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> coursePage = courseService.getAllPublishedCourses(pageable);
        return createPageResponse(coursePage);
    }

    @QueryMapping
    public Map<String, Object> publishedCourses(@Argument int page, @Argument int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> coursePage = courseService.getAllPublishedCourses(pageable);
        return createPageResponse(coursePage);
    }

    @QueryMapping
    public Map<String, Object> searchCourses(@Argument String keyword, @Argument int page, @Argument int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> coursePage = courseService.searchCourses(keyword, pageable);
        return createPageResponse(coursePage);
    }

    @QueryMapping
    public Map<String, Object> coursesByCategory(@Argument Long categoryId, @Argument int page, @Argument int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> coursePage = courseService.getCoursesByCategory(categoryId, pageable);
        return createPageResponse(coursePage);
    }

    @QueryMapping
    public List<CourseDto> instructorCourses(@Argument Long instructorId) {
        return courseService.getInstructorCourses(instructorId);
    }

    @QueryMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public List<CourseDto> myCourses(@AuthenticationPrincipal User user) {
        return courseService.getInstructorCourses(user.getId());
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public CourseDto createCourse(@Argument Map<String, Object> input, @AuthenticationPrincipal User user) {
        CreateCourseRequest request = CreateCourseRequest.builder()
                .title((String) input.get("title"))
                .description((String) input.get("description"))
                .thumbnailUrl((String) input.get("thumbnailUrl"))
                .level(CourseLevel.valueOf((String) input.get("level")))
                .price(input.get("price") != null ? ((Number) input.get("price")).doubleValue() : 0.0)
                .categoryIds(
                        input.get("categoryIds") != null ? Set.copyOf((List<Long>) input.get("categoryIds")) : null)
                .build();
        return courseService.createCourse(request, user);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public CourseDto updateCourse(@Argument Long id, @Argument Map<String, Object> input,
            @AuthenticationPrincipal User user) {
        CreateCourseRequest request = CreateCourseRequest.builder()
                .title((String) input.get("title"))
                .description((String) input.get("description"))
                .thumbnailUrl((String) input.get("thumbnailUrl"))
                .level(input.get("level") != null ? CourseLevel.valueOf((String) input.get("level")) : null)
                .price(input.get("price") != null ? ((Number) input.get("price")).doubleValue() : null)
                .categoryIds(
                        input.get("categoryIds") != null ? Set.copyOf((List<Long>) input.get("categoryIds")) : null)
                .build();
        return courseService.updateCourse(id, request, user);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public CourseDto publishCourse(@Argument Long id, @AuthenticationPrincipal User user) {
        return courseService.publishCourse(id, user);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public CourseDto unpublishCourse(@Argument Long id, @AuthenticationPrincipal User user) {
        return courseService.unpublishCourse(id, user);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public Boolean deleteCourse(@Argument Long id, @AuthenticationPrincipal User user) {
        courseService.deleteCourse(id, user);
        return true;
    }

    @QueryMapping
    public UserDto user(@Argument Long id) {
        return userService.getUserById(id);
    }

    @QueryMapping
    public List<UserDto> users(@Argument Role role) {
        if (role != null) {
            return userService.getUsersByRole(role);
        }
        return userService.getAllUsers();
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public UserDto me(@AuthenticationPrincipal User user) {
        return userService.getUserById(user.getId());
    }

    private Map<String, Object> createPageResponse(Page<CourseDto> page) {
        return Map.of(
                "content", page.getContent(),
                "pageInfo", Map.of(
                        "hasNextPage", page.hasNext(),
                        "hasPreviousPage", page.hasPrevious(),
                        "totalPages", page.getTotalPages(),
                        "totalElements", page.getTotalElements()));
    }
}
