package com.skillhub.controller;

import com.skillhub.dto.ApiResponse;
import com.skillhub.dto.ModuleDto;
import com.skillhub.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5174")
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ModuleDto>>> getAllModules() {
        final List<ModuleDto> modules = moduleService.getAllModules();
        return ResponseEntity.ok(ApiResponse.success("Modules retrieved successfully", modules));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ModuleDto>> getModuleById(@PathVariable final Long id) {
        final ModuleDto module = moduleService.getModuleById(id);
        return ResponseEntity.ok(ApiResponse.success("Module retrieved successfully", module));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<ModuleDto>>> getModulesByCourseId(@PathVariable final Long courseId) {
        final List<ModuleDto> modules = moduleService.getModulesByCourseId(courseId);
        return ResponseEntity.ok(ApiResponse.success("Course modules retrieved successfully", modules));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ModuleDto>> createModule(@RequestBody final ModuleDto moduleDTO) {
        final ModuleDto createdModule = moduleService.createModule(moduleDTO);
        return ResponseEntity.ok(ApiResponse.success("Module created successfully", createdModule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ModuleDto>> updateModule(
            @PathVariable final Long id,
            @RequestBody final ModuleDto moduleDTO) {
        final ModuleDto updatedModule = moduleService.updateModule(id, moduleDTO);
        return ResponseEntity.ok(ApiResponse.success("Module updated successfully", updatedModule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteModule(@PathVariable final Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok(ApiResponse.success("Module deleted successfully", null));
    }
}
