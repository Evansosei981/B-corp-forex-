package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    
    private final Cloudinary cloudinary;

    public String storeFile(MultipartFile file) {
        try {
            // Upload the file to Cloudinary
            // resource_type "auto" is necessary for large MP4 video files
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto"
            ));
            
            // Return the secure cloud URL
            return uploadResult.get("secure_url").toString();
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file in Cloudinary. Please try again!", ex);
        }
    }
}
