package com.skillhub.controller;

import com.skillhub.dto.ApiResponse;
import com.skillhub.dto.UserDto;
import com.skillhub.entity.Role;
import com.skillhub.entity.User;
import com.skillhub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
@SecurityRequirement(name = "bearer-jwt")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get the currently authenticated user's profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal User user) {
        UserDto userDto = userService.getUserById(user.getId());
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user", description = "Update the currently authenticated user's profile")
    public ResponseEntity<ApiResponse<UserDto>> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @RequestBody UserDto userDto) {
        UserDto updated = userService.updateUser(user.getId(), userDto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Get user details by user ID")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users", description = "Get all users (Admin only)")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get users by role", description = "Get all users with a specific role")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsersByRole(@PathVariable Role role) {
        List<UserDto> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user", description = "Update user details (Admin only)")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto userDto) {
        UserDto updated = userService.updateUser(id, userDto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user", description = "Delete a user (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate user", description = "Deactivate a user account (Admin only)")
    public ResponseEntity<ApiResponse<UserDto>> deactivateUser(@PathVariable Long id) {
        UserDto userDto = userService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully", userDto));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate user", description = "Activate a user account (Admin only)")
    public ResponseEntity<ApiResponse<UserDto>> activateUser(@PathVariable Long id) {
        UserDto userDto = userService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated successfully", userDto));
    }
}
