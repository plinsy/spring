package com.skillhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SkillHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillHubApplication.class, args);
    }
}
