package com.skillhub.dto;

import com.skillhub.entity.CourseLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseDto {

    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private CourseLevel level;
    private Boolean isPublished;
    private Double price;
    private UserDto instructor;
    private Set<CategoryDto> categories;
    private Double averageRating;
    private Integer totalEnrollments;
    private Integer totalModules;
    private Integer totalLessons;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
