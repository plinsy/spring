package com.skillhub.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "SkillHub API", version = "1.0.0", description = "Comprehensive Learning Management System API with Spring Boot, JWT, and GraphQL", contact = @Contact(name = "SkillHub Team", email = "support@skillhub.com", url = "https://skillhub.com"), license = @License(name = "MIT License", url = "https://opensource.org/licenses/MIT")), servers = {
        @Server(description = "Local Development Server", url = "http://localhost:8080"),
        @Server(description = "Production Server", url = "https://api.skillhub.com")
})
@SecurityScheme(name = "bearer-jwt", description = "JWT authentication using Bearer token", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
public class OpenApiConfig {
}
