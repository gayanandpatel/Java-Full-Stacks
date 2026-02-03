package com.shopifyy.shopifyy.data;

import java.util.Optional;
import java.util.Set;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.shopifyy.shopifyy.model.Role;
import com.shopifyy.shopifyy.model.User;
import com.shopifyy.shopifyy.repository.RoleRepository;
import com.shopifyy.shopifyy.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Transactional
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Set<String> defaultRoles = Set.of("ROLE_USER" , "ROLE_ADMIN", "ROLE_CUSTOMER");
        createDefaultRoles(defaultRoles);
        createDefaultAdminIfNotExits();
    }

    private void createDefaultRoles(Set<String> roles){
        roles.stream()
                .filter(role -> Optional.ofNullable(roleRepository.findByName(role))
                        .isEmpty()).map(Role::new).forEach(roleRepository::save);
    }

    private void createDefaultAdminIfNotExits(){
        Role adminRole = Optional.ofNullable(roleRepository.findByName("ROLE_ADMIN"))
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        for (int i = 1; i<=3; i++){
            String defaultEmail = "gayanand.patel" +i+ "@gmail.com";
            if (userRepository.existsByEmail(defaultEmail)){
                continue;
            }
            User user = new User();
            user.setFirstName("Admin");
            user.setLastName("admin" + i);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("123456789"));
            user.setRoles(Set.of(adminRole));
            userRepository.save(user);
        }
    }

}