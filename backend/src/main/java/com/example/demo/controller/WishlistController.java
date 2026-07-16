package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Course>> getWishlist(Authentication auth) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(auth.getName()));
    }

    @PostMapping("/{courseId}/toggle")
    public ResponseEntity<Void> toggleWishlist(@PathVariable Long courseId, Authentication auth) {
        wishlistService.toggleWishlist(auth.getName(), courseId);
        return ResponseEntity.ok().build();
    }
}
