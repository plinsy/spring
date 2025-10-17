package com.skillhub.dto;

import com.skillhub.entity.LessonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LessonDto {

    private Long id;
    private String title;
    private String content;
    private LessonType type;
    private String videoUrl;
    private Integer durationMinutes;
    private Integer orderIndex;
    private Boolean isFree;
    private Long moduleId;
    private LocalDateTime createdAt;
}
