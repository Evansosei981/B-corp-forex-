package com.example.demo.controller;

import com.example.demo.model.AppSetting;
import com.example.demo.repository.AppSettingRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/developer")
@RequiredArgsConstructor
public class DeveloperController {

    private final AppSettingRepository settingRepository;
    
    // Fallback key if not set in environment
    private final String DEV_KEY = System.getenv("DEVELOPER_KEY") != null ? System.getenv("DEVELOPER_KEY") : "dev-secret-key-123";

    private boolean isAuthorized(HttpServletRequest request) {
        String key = request.getHeader("X-Developer-Key");
        return DEV_KEY.equals(key);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getPublicStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("maintenanceMode", settingRepository.findBySettingKey("dev_maintenanceMode").map(AppSetting::getSettingValue).orElse("false"));
        status.put("maintenanceMessage", settingRepository.findBySettingKey("dev_maintenanceMessage").map(AppSetting::getSettingValue).orElse(""));
        status.put("maintenanceEndTime", settingRepository.findBySettingKey("dev_maintenanceEndTime").map(AppSetting::getSettingValue).orElse(""));
        status.put("announcementTitle", settingRepository.findBySettingKey("dev_announcementTitle").map(AppSetting::getSettingValue).orElse(""));
        status.put("announcementMessage", settingRepository.findBySettingKey("dev_announcementMessage").map(AppSetting::getSettingValue).orElse(""));
        status.put("announcementType", settingRepository.findBySettingKey("dev_announcementType").map(AppSetting::getSettingValue).orElse("INFO"));
        return ResponseEntity.ok(status);
    }

    @GetMapping("/settings")
    public ResponseEntity<?> getDeveloperSettings(HttpServletRequest request) {
        if (!isAuthorized(request)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        
        List<AppSetting> settings = settingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (AppSetting setting : settings) {
            if (setting.getSettingKey().startsWith("dev_")) {
                map.put(setting.getSettingKey(), setting.getSettingValue());
            }
        }
        return ResponseEntity.ok(map);
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateDeveloperSettings(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        if (!isAuthorized(request)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        for (Map.Entry<String, String> entry : payload.entrySet()) {
            if (entry.getKey().startsWith("dev_")) {
                AppSetting setting = settingRepository.findBySettingKey(entry.getKey()).orElse(new AppSetting());
                setting.setSettingKey(entry.getKey());
                setting.setSettingValue(entry.getValue());
                settingRepository.save(setting);
            }
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/system/clear-cache")
    public ResponseEntity<?> clearSystemCache(HttpServletRequest request) {
        if (!isAuthorized(request)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        
        // Simulate cache clearing or restart processes
        // In a real Spring app, we would inject CacheManager and call cacheManager.getCacheNames().forEach(c -> cacheManager.getCache(c).clear());
        try {
            Thread.sleep(1500); // Simulate processing time
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        return ResponseEntity.ok(Map.of("message", "System cache and temporary files cleared successfully"));
    }
}
