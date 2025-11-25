package com.thecodereveal.shopease.auth.controller;

import com.thecodereveal.shopease.auth.entities.Authority;
import com.thecodereveal.shopease.auth.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class UserDetailControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private UserDetailController userDetailController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userDetailController).build();
    }

    @Test
    public void testGetUserProfile_Success() throws Exception {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPhoneNumber("1234567890");
        
        List<Authority> authorities = new ArrayList<>();
        Authority authority = new Authority();
        authority.setRoleCode("USER");
        authorities.add(authority);
        user.setAuthorities(authorities);

        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(user);

        mockMvc.perform(get("/api/user/profile")
                .principal(() -> "john.doe@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    public void testGetUserProfile_Unauthorized() throws Exception {
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(null);

        mockMvc.perform(get("/api/user/profile")
                .principal(() -> "john.doe@example.com"))
                .andExpect(status().isUnauthorized());
    }
}
