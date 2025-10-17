package com.skillhub.repository;

import com.skillhub.entity.Comment;
import com.skillhub.entity.Lesson;
import com.skillhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByLesson(Lesson lesson);

    List<Comment> findByUser(User user);

    List<Comment> findByParent(Comment parent);

    @Query("SELECT c FROM Comment c WHERE c.lesson.id = :lessonId AND c.parent IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findTopLevelCommentsByLesson(Long lessonId);

    @Query("SELECT c FROM Comment c WHERE c.parent.id = :parentId ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentId(Long parentId);
}
