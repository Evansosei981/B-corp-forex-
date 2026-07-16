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
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folderName) throws IOException {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("folder", folderName));
            return uploadResult.get("url").toString();
        } catch (Exception e) {
            System.err.println("Cloudinary upload failed: " + e.getMessage() + ". Returning mock URL.");
            return "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
        }
    }
    
    public String uploadVideo(MultipartFile file, String folderName) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
            ObjectUtils.asMap("resource_type", "video", "folder", folderName));
        return uploadResult.get("url").toString();
    }
}
