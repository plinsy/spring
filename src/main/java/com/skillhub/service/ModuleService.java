package com.skillhub.service;

import com.skillhub.dto.LessonDto;
import com.skillhub.dto.ModuleDto;
import com.skillhub.entity.Course;
import com.skillhub.entity.Lesson;
import com.skillhub.entity.Module;
import com.skillhub.repository.CourseRepository;
import com.skillhub.repository.LessonRepository;
import com.skillhub.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public List<ModuleDto> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ModuleDto getModuleById(final Long id) {
        final Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + id));
        return convertToDTO(module);
    }

    public List<ModuleDto> getModulesByCourseId(final Long courseId) {
        final List<Module> modules = moduleRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        return modules.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ModuleDto createModule(final ModuleDto moduleDTO) {
        final Course course = courseRepository.findById(moduleDTO.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + moduleDTO.getCourseId()));

        final Module module = new Module();
        module.setTitle(moduleDTO.getTitle());
        module.setDescription(moduleDTO.getDescription());
        module.setOrderIndex(moduleDTO.getOrderIndex());
        module.setCourse(course);

        final Module savedModule = moduleRepository.save(module);
        return convertToDTO(savedModule);
    }

    public ModuleDto updateModule(final Long id, final ModuleDto moduleDTO) {
        final Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + id));

        module.setTitle(moduleDTO.getTitle());
        module.setDescription(moduleDTO.getDescription());
        module.setOrderIndex(moduleDTO.getOrderIndex());

        final Module updatedModule = moduleRepository.save(module);
        return convertToDTO(updatedModule);
    }

    public void deleteModule(final Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new RuntimeException("Module not found with id: " + id);
        }
        moduleRepository.deleteById(id);
    }

    private ModuleDto convertToDTO(final Module module) {
        final ModuleDto dto = new ModuleDto();
        dto.setId(module.getId());
        dto.setTitle(module.getTitle());
        dto.setDescription(module.getDescription());
        dto.setOrderIndex(module.getOrderIndex());
        dto.setCourseId(module.getCourse().getId());
        dto.setCreatedAt(module.getCreatedAt());

        // Include lessons if they exist
        final List<Lesson> lessons = lessonRepository.findByModuleIdOrderByOrderIndexAsc(module.getId());
        if (!lessons.isEmpty()) {
            final List<LessonDto> lessonDTOs = lessons.stream()
                    .map(this::convertLessonToDTO)
                    .collect(Collectors.toList());
            dto.setLessons(lessonDTOs);
        }

        return dto;
    }

    private LessonDto convertLessonToDTO(final Lesson lesson) {
        final LessonDto dto = new LessonDto();
        dto.setId(lesson.getId());
        dto.setTitle(lesson.getTitle());
        dto.setContent(lesson.getContent());
        dto.setType(lesson.getType());
        dto.setVideoUrl(lesson.getVideoUrl());
        dto.setDurationMinutes(lesson.getDurationMinutes());
        dto.setOrderIndex(lesson.getOrderIndex());
        dto.setIsFree(lesson.getIsFree());
        dto.setModuleId(lesson.getModule().getId());
        dto.setCreatedAt(lesson.getCreatedAt());
        return dto;
    }
}