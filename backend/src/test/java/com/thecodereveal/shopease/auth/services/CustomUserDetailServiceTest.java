package com.thecodereveal.shopease.auth.services;

import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.auth.repositories.UserDetailRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailServiceTest {

    @Mock
    private UserDetailRepository userDetailRepository;

    @InjectMocks
    private CustomUserDetailService customUserDetailService;

    @Test
    void loadUserByUsername_Found() {
        String username = "test@example.com";
        User user = new User();
        user.setEmail(username);
        when(userDetailRepository.findByEmail(username)).thenReturn(user);

        UserDetails result = customUserDetailService.loadUserByUsername(username);

        assertNotNull(result);
        assertEquals(username, ((User) result).getEmail());
        verify(userDetailRepository).findByEmail(username);
    }

    @Test
    void loadUserByUsername_NotFound() {
        String username = "unknown@example.com";
        when(userDetailRepository.findByEmail(username)).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> customUserDetailService.loadUserByUsername(username));
        verify(userDetailRepository).findByEmail(username);
    }
}
