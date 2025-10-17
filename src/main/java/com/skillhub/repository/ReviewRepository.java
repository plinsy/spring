package com.skillhub.repository;

import com.skillhub.entity.Review;
import com.skillhub.entity.User;
import com.skillhub.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByCourse(Course course);

    List<Review> findByUser(User user);

    Optional<Review> findByUserAndCourse(User user, Course course);

    List<Review> findByCourseAndIsApproved(Course course, Boolean isApproved);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId AND r.isApproved = true")
    Double getAverageRatingForCourse(Long courseId);

    Long countByCourseIdAndIsApproved(Long courseId, Boolean isApproved);
}
