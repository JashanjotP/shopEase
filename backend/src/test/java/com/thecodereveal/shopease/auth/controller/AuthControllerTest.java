package com.thecodereveal.shopease.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thecodereveal.shopease.auth.config.JWTTokenHelper;
import com.thecodereveal.shopease.auth.dto.LoginRequest;
import com.thecodereveal.shopease.auth.dto.RegistrationRequest;
import com.thecodereveal.shopease.auth.dto.RegistrationResponse;
import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.auth.services.RegistrationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import static org.mockito.Mockito.verify;

public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RegistrationService registrationService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JWTTokenHelper jwtTokenHelper;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    public void testLogin_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUserName("test@example.com");
        loginRequest.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setEnabled(true);

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(user);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenHelper.generateToken(anyString())).thenReturn("test-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-token"));
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenHelper).generateToken("test@example.com");
    }

    @Test
    public void testLogin_Failure_BadCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUserName("test@example.com");
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    public void testLogin_Failure_UserDisabled() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUserName("test@example.com");
        loginRequest.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setEnabled(false);

        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(user);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    public void testRegister_Success() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test@example.com");

        RegistrationResponse response = new RegistrationResponse();
        response.setCode(200);
        response.setMessage("User created");

        when(registrationService.createUser(any(RegistrationRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
        
        verify(registrationService).createUser(any(RegistrationRequest.class));
    }

    @Test
    public void testRegister_Failure() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test@example.com");

        RegistrationResponse response = new RegistrationResponse();
        response.setCode(400);
        response.setMessage("User already exists");

        when(registrationService.createUser(any(RegistrationRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
        
        verify(registrationService).createUser(any(RegistrationRequest.class));
    }

    @Test
    public void testVerifyCode_Success() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("userName", "test@example.com");
        request.put("code", "123456");

        User user = new User();
        user.setVerificationCode("123456");

        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(user);

        mockMvc.perform(post("/api/auth/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        
        verify(userDetailsService).loadUserByUsername("test@example.com");
        verify(registrationService).verifyUser("test@example.com");
    }

    @Test
    public void testVerifyCode_Failure() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("userName", "test@example.com");
        request.put("code", "wrongcode");

        User user = new User();
        user.setVerificationCode("123456");

        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(user);

        mockMvc.perform(post("/api/auth/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
        
        verify(userDetailsService).loadUserByUsername("test@example.com");
    }
}
