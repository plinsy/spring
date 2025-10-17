package com.skillhub.repository;

import com.skillhub.entity.Course;
import com.skillhub.entity.CourseLevel;
import com.skillhub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByInstructor(User instructor);

    List<Course> findByIsPublished(Boolean isPublished);

    Page<Course> findByIsPublished(Boolean isPublished, Pageable pageable);

    List<Course> findByLevel(CourseLevel level);

    @Query("SELECT c FROM Course c WHERE c.isPublished = true AND " +
            "(LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Course> searchPublishedCourses(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT c FROM Course c JOIN c.categories cat WHERE cat.id = :categoryId AND c.isPublished = true")
    Page<Course> findPublishedCoursesByCategory(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    Long countEnrollmentsByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId")
    Double getAverageRating(@Param("courseId") Long courseId);
}
