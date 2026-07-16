package com.example.demo.controller;

import com.example.demo.model.AppSetting;
import com.example.demo.repository.AppSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/settings")
public class AppSettingController {

    @Autowired
    private AppSettingRepository settingRepository;

    @GetMapping
    public ResponseEntity<Map<String, String>> getAllSettings() {
        List<AppSetting> settings = settingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (AppSetting setting : settings) {
            map.put(setting.getSettingKey(), setting.getSettingValue());
        }
        return ResponseEntity.ok(map);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, String> payload) {
        for (Map.Entry<String, String> entry : payload.entrySet()) {
            AppSetting setting = settingRepository.findBySettingKey(entry.getKey()).orElse(new AppSetting());
            setting.setSettingKey(entry.getKey());
            setting.setSettingValue(entry.getValue());
            settingRepository.save(setting);
        }
        return ResponseEntity.ok().build();
    }
}
