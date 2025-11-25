package com.thecodereveal.shopease.auth.services;

import com.thecodereveal.shopease.auth.dto.RegistrationRequest;
import com.thecodereveal.shopease.auth.dto.RegistrationResponse;
import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.auth.repositories.UserDetailRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private UserDetailRepository userDetailRepository;

    @Mock
    private AuthorityService authorityService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private RegistrationService registrationService;

    @Test
    void createUser_Success() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("new@example.com");
        request.setPassword("password");
        request.setFirstName("New");
        request.setLastName("User");

        when(userDetailRepository.findByEmail(request.getEmail())).thenReturn(null);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(authorityService.getUserAuthority()).thenReturn(new ArrayList<>());
        when(userDetailRepository.save(any(User.class))).thenReturn(new User());
        when(emailService.sendMail(any(User.class))).thenReturn("Email sent");

        RegistrationResponse response = registrationService.createUser(request);

        assertEquals(200, response.getCode());
        assertEquals("User created!", response.getMessage());
    }

    @Test
    void createUser_EmailExists() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("existing@example.com");

        when(userDetailRepository.findByEmail(request.getEmail())).thenReturn(new User());

        RegistrationResponse response = registrationService.createUser(request);

        assertEquals(400, response.getCode());
        assertEquals("Email already exist!", response.getMessage());
    }

    @Test
    void verifyUser_Success() {
        String username = "test@example.com";
        User user = new User();
        user.setEmail(username);
        user.setEnabled(false);

        when(userDetailRepository.findByEmail(username)).thenReturn(user);
        when(userDetailRepository.save(user)).thenReturn(user);

        registrationService.verifyUser(username);

        assertEquals(true, user.isEnabled());
    }
}
