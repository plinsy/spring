package com.skillhub.repository;

import com.skillhub.entity.LessonProgress;
import com.skillhub.entity.Enrollment;
import com.skillhub.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    List<LessonProgress> findByEnrollment(Enrollment enrollment);

    Optional<LessonProgress> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);

    @Query("SELECT lp FROM LessonProgress lp WHERE lp.enrollment.id = :enrollmentId AND lp.isCompleted = true")
    List<LessonProgress> findCompletedLessonsByEnrollment(Long enrollmentId);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.enrollment.id = :enrollmentId AND lp.isCompleted = true")
    Long countCompletedLessonsByEnrollment(Long enrollmentId);
}
