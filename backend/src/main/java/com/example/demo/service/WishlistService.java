package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.model.User;
import com.example.demo.model.Wishlist;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public List<Course> getUserWishlist(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return wishlistRepository.findByUserId(user.getId()).stream()
                .map(Wishlist::getCourse)
                .toList();
    }

    @Transactional
    public void toggleWishlist(String email, Long courseId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Course course = courseRepository.findById(courseId).orElseThrow();

        wishlistRepository.findByUserIdAndCourseId(user.getId(), courseId)
                .ifPresentOrElse(
                        wishlistRepository::delete,
                        () -> wishlistRepository.save(Wishlist.builder().user(user).course(course).build())
                );
    }
}
