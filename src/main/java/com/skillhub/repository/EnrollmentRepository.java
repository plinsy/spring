package com.skillhub.repository;

import com.skillhub.entity.Enrollment;
import com.skillhub.entity.User;
import com.skillhub.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudent(User student);

    List<Enrollment> findByCourse(Course course);

    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    Boolean existsByStudentAndCourse(User student, Course course);

    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.isCompleted = false")
    List<Enrollment> findActiveEnrollmentsByStudentId(Long studentId);

    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.isCompleted = true")
    List<Enrollment> findCompletedEnrollmentsByStudentId(Long studentId);

    Long countByCourseId(Long courseId);
}
