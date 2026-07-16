package com.example.demo.config;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final com.example.demo.repository.AppSettingRepository appSettingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@bcorp.com")) {
            User admin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin@bcorp.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isEnabled(true)
                    .build();
            userRepository.save(admin);
            // Admin user seeded
            System.out.println("Admin user seeded.");
        } else {
            // Ensure existing admin is enabled
            User admin = userRepository.findByEmail("admin@bcorp.com").get();
            if (!admin.isEnabled()) {
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println("Existing Admin user enabled.");
            }
        }

        if (appSettingRepository.count() == 0) {
            appSettingRepository.save(new com.example.demo.model.AppSetting("payment.bank.name", "Guaranty Trust Bank (GTB)"));
            appSettingRepository.save(new com.example.demo.model.AppSetting("payment.bank.accountName", "B CORP FOREX ACADEMY"));
            appSettingRepository.save(new com.example.demo.model.AppSetting("payment.bank.accountNo", "0123456789"));
            // Payment settings seeded
        }
    }
}
