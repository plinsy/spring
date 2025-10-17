package com.skillhub.controller;

import com.skillhub.dto.CourseDto;
import com.skillhub.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class WebController {

    private final CourseService courseService;

    @GetMapping("/")
    public String home(Model model) {
        // Get top 3 popular courses
        List<CourseDto> popularCourses = courseService.getAllPublishedCourses(PageRequest.of(0, 3))
                .getContent();
        model.addAttribute("popularCourses", popularCourses);
        model.addAttribute("title", "Home");
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("title", "About Us");
        return "about";
    }

    @GetMapping("/contact")
    public String contact(Model model) {
        model.addAttribute("title", "Contact");
        return "contact";
    }
}
