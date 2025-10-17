package com.skillhub.repository;

import com.skillhub.entity.Lesson;
import com.skillhub.entity.Module;
import com.skillhub.entity.LessonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByModule(Module module);

    List<Lesson> findByModuleIdOrderByOrderIndexAsc(Long moduleId);

    List<Lesson> findByType(LessonType type);

    List<Lesson> findByIsFree(Boolean isFree);

    @Query("SELECT l FROM Lesson l WHERE l.module.course.id = :courseId")
    List<Lesson> findAllByCourseId(Long courseId);

    Long countByModuleId(Long moduleId);
}
