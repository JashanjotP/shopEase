package com.thecodereveal.shopease.auth.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import static org.mockito.Mockito.verify;

public class JWTTokenHelperTest {

    @InjectMocks
    private JWTTokenHelper jwtTokenHelper;

    @Mock
    private HttpServletRequest request;

    private String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"; // Must be at least 256 bits
    private int expiresIn = 3600;
    private String appName = "ShopEase";

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(jwtTokenHelper, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtTokenHelper, "expiresIn", expiresIn);
        ReflectionTestUtils.setField(jwtTokenHelper, "appName", appName);
    }

    @Test
    public void testGenerateToken() {
        String token = jwtTokenHelper.generateToken("testUser");
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    public void testGetToken() {
        when(request.getHeader("Authorization")).thenReturn("Bearer test-token");
        String token = jwtTokenHelper.getToken(request);
        assertEquals("test-token", token);
        verify(request).getHeader("Authorization");
    }

    @Test
    public void testGetToken_NoBearer() {
        when(request.getHeader("Authorization")).thenReturn("test-token");
        String token = jwtTokenHelper.getToken(request);
        assertEquals("test-token", token);
        verify(request).getHeader("Authorization");
    }

    @Test
    public void testGetToken_Null() {
        when(request.getHeader("Authorization")).thenReturn(null);
        String token = jwtTokenHelper.getToken(request);
        assertNull(token);
        verify(request).getHeader("Authorization");
    }

    @Test
    public void testValidateToken() {
        String token = jwtTokenHelper.generateToken("testUser");
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");

        Boolean isValid = jwtTokenHelper.validateToken(token, userDetails);
        assertTrue(isValid);
    }

    @Test
    public void testValidateToken_InvalidUser() {
        String token = jwtTokenHelper.generateToken("testUser");
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("otherUser");

        Boolean isValid = jwtTokenHelper.validateToken(token, userDetails);
        assertFalse(isValid);
    }

    @Test
    public void testGetUserNameFromToken() {
        String token = jwtTokenHelper.generateToken("testUser");
        String userName = jwtTokenHelper.getUserNameFromToken(token);
        assertEquals("testUser", userName);
    }

    @Test
    public void testGetUserNameFromToken_Invalid() {
        String userName = jwtTokenHelper.getUserNameFromToken("invalid-token");
        assertNull(userName);
    }
}
