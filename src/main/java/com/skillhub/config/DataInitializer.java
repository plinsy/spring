package com.skillhub.config;

import com.skillhub.entity.Category;
import com.skillhub.entity.Course;
import com.skillhub.entity.CourseLevel;
import com.skillhub.entity.Lesson;
import com.skillhub.entity.LessonType;
import com.skillhub.entity.Module;
import com.skillhub.entity.Role;
import com.skillhub.entity.User;
import com.skillhub.repository.CategoryRepository;
import com.skillhub.repository.CourseRepository;
import com.skillhub.repository.LessonRepository;
import com.skillhub.repository.ModuleRepository;
import com.skillhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() == 0) {
                log.info("Initializing sample data...");

                // Create users
                User admin = createUser("admin", "admin@skillhub.com", "admin123",
                        "Admin", "User", Role.ADMIN);
                User instructor1 = createUser("john_doe", "john@skillhub.com", "instructor123",
                        "John", "Doe", Role.INSTRUCTOR);
                User instructor2 = createUser("jane_smith", "jane@skillhub.com", "instructor123",
                        "Jane", "Smith", Role.INSTRUCTOR);
                User student1 = createUser("alice", "alice@skillhub.com", "student123",
                        "Alice", "Johnson", Role.STUDENT);
                User student2 = createUser("bob", "bob@skillhub.com", "student123",
                        "Bob", "Wilson", Role.STUDENT);

                log.info("Created {} users", userRepository.count());

                // Create categories
                Category webDev = createCategory("Web Development",
                        "Learn to build modern web applications", "💻");
                Category dataSci = createCategory("Data Science",
                        "Master data analysis and machine learning", "📊");
                Category mobile = createCategory("Mobile Development",
                        "Create iOS and Android applications", "📱");
                Category devOps = createCategory("DevOps",
                        "Learn CI/CD, Docker, Kubernetes", "🚀");
                Category ai = createCategory("Artificial Intelligence",
                        "Explore AI and Deep Learning", "🤖");

                log.info("Created {} categories", categoryRepository.count());

                // Create courses
                Course springCourse = createCourse(
                        "Spring Boot Masterclass",
                        "Learn Spring Boot from basics to advanced concepts including REST APIs, Security, and JPA",
                        CourseLevel.INTERMEDIATE,
                        instructor1,
                        new HashSet<>(Arrays.asList(webDev, devOps)));

                Course reactCourse = createCourse(
                        "React & TypeScript Complete Guide",
                        "Build modern web applications with React 18, TypeScript, and best practices",
                        CourseLevel.BEGINNER,
                        instructor2,
                        new HashSet<>(Arrays.asList(webDev)));

                Course mlCourse = createCourse(
                        "Machine Learning A-Z",
                        "Master Machine Learning with Python, scikit-learn, and TensorFlow",
                        CourseLevel.ADVANCED,
                        instructor1,
                        new HashSet<>(Arrays.asList(dataSci, ai)));

                log.info("Created {} courses", courseRepository.count());

                // Create modules and lessons for Spring Boot course
                Module module1 = createModule("Getting Started with Spring Boot",
                        "Introduction to Spring Boot framework", 1, springCourse);

                createLesson("What is Spring Boot?",
                        "Learn about Spring Boot and its advantages",
                        LessonType.VIDEO, 1, true, module1);
                createLesson("Setting up Development Environment",
                        "Install Java, Maven, and IDE",
                        LessonType.VIDEO, 2, true, module1);
                createLesson("Your First Spring Boot Application",
                        "Create your first Spring Boot app",
                        LessonType.TEXT, 3, false, module1);

                Module module2 = createModule("REST API Development",
                        "Building RESTful APIs with Spring Boot", 2, springCourse);

                createLesson("RESTful Principles",
                        "Understanding REST architecture",
                        LessonType.VIDEO, 1, false, module2);
                createLesson("Creating Controllers",
                        "Building REST controllers",
                        LessonType.VIDEO, 2, false, module2);
                createLesson("API Testing with Postman",
                        "Test your APIs",
                        LessonType.ASSIGNMENT, 3, false, module2);

                log.info("Created {} modules and {} lessons",
                        moduleRepository.count(), lessonRepository.count());

                log.info("Sample data initialization completed!");
                log.info("=".repeat(60));
                log.info("Default Users:");
                log.info("Admin    - Email: admin@skillhub.com    | Password: admin123");
                log.info("Instructor - Email: john@skillhub.com    | Password: instructor123");
                log.info("Student  - Email: alice@skillhub.com   | Password: student123");
                log.info("=".repeat(60));
            }
        };
    }

    private User createUser(String username, String email, String password,
            String firstName, String lastName, Role role) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .isActive(true)
                .build();
        return userRepository.save(user);
    }

    private Category createCategory(String name, String description, String iconUrl) {
        Category category = Category.builder()
                .name(name)
                .description(description)
                .iconUrl(iconUrl)
                .build();
        return categoryRepository.save(category);
    }

    private Course createCourse(String title, String description, CourseLevel level,
            User instructor, HashSet<Category> categories) {
        Course course = Course.builder()
                .title(title)
                .description(description)
                .level(level)
                .instructor(instructor)
                .categories(categories)
                .isPublished(true)
                .price(49.99)
                .build();
        return courseRepository.save(course);
    }

    private Module createModule(String title, String description, int orderIndex, Course course) {
        Module module = Module.builder()
                .title(title)
                .description(description)
                .orderIndex(orderIndex)
                .course(course)
                .build();
        return moduleRepository.save(module);
    }

    private Lesson createLesson(String title, String content, LessonType type,
            int orderIndex, boolean isFree, Module module) {
        Lesson lesson = Lesson.builder()
                .title(title)
                .content(content)
                .type(type)
                .orderIndex(orderIndex)
                .isFree(isFree)
                .durationMinutes(type == LessonType.VIDEO ? 15 : 10)
                .module(module)
                .build();
        return lessonRepository.save(lesson);
    }
}
