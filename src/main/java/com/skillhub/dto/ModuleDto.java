package com.skillhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ModuleDto {

    private Long id;
    private String title;
    private String description;
    private Integer orderIndex;
    private Long courseId;
    private List<LessonDto> lessons;
    private LocalDateTime createdAt;
}
