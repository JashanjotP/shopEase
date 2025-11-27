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

import org.mockito.ArgumentCaptor;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userDetailRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        
        assertEquals(request.getFirstName(), savedUser.getFirstName());
        assertEquals(request.getLastName(), savedUser.getLastName());
        assertEquals(request.getEmail(), savedUser.getEmail());
        assertFalse(savedUser.isEnabled());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertEquals("manual", savedUser.getProvider());
        assertNotNull(savedUser.getVerificationCode());
        assertNotNull(savedUser.getAuthorities());
        
        verify(emailService).sendMail(savedUser);
        verify(passwordEncoder).encode("password");
    }

    @Test
    void createUser_EmailExists() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("existing@example.com");

        when(userDetailRepository.findByEmail(request.getEmail())).thenReturn(new User());

        RegistrationResponse response = registrationService.createUser(request);

        assertEquals(400, response.getCode());
        assertEquals("Email already exist!", response.getMessage());
        verify(userDetailRepository, never()).save(any(User.class));
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
        verify(userDetailRepository).save(user);
    }
}
