package com.skillhub.repository;

import com.skillhub.entity.Module;
import com.skillhub.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

    List<Module> findByCourse(Course course);

    List<Module> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    Long countByCourseId(Long courseId);
}
