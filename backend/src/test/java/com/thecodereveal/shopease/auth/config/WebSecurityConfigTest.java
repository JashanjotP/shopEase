package com.thecodereveal.shopease.auth.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class WebSecurityConfigTest {

    @Autowired
    private WebSecurityConfig webSecurityConfig;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Autowired
    private WebSecurityCustomizer webSecurityCustomizer;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailsService userDetailsService;

    @Test
    void testSecurityFilterChainBean() {
        assertNotNull(securityFilterChain);
    }

    @Test
    void testWebSecurityCustomizerBean() {
        assertNotNull(webSecurityCustomizer);
    }

    @Test
    void testWebSecurityCustomizerConfiguration() {
        org.springframework.security.config.annotation.web.builders.WebSecurity webSecurity = org.mockito.Mockito.mock(org.springframework.security.config.annotation.web.builders.WebSecurity.class);
        org.springframework.security.config.annotation.web.builders.WebSecurity.IgnoredRequestConfigurer ignoredRequestConfigurer = org.mockito.Mockito.mock(org.springframework.security.config.annotation.web.builders.WebSecurity.IgnoredRequestConfigurer.class);
        
        org.mockito.Mockito.when(webSecurity.ignoring()).thenReturn(ignoredRequestConfigurer);
        org.mockito.Mockito.when(ignoredRequestConfigurer.requestMatchers(org.mockito.ArgumentMatchers.<String[]>any())).thenReturn(ignoredRequestConfigurer);

        webSecurityCustomizer.customize(webSecurity);

        org.mockito.ArgumentCaptor<String[]> captor = org.mockito.ArgumentCaptor.forClass(String[].class);
        org.mockito.Mockito.verify(ignoredRequestConfigurer).requestMatchers(captor.capture());
        
        String[] ignoredPaths = captor.getValue();
        assertNotNull(ignoredPaths);
        assertTrue(java.util.Arrays.asList(ignoredPaths).contains("/api/auth/**"));
    }

    @Test
    void testPasswordEncoderBean() {
        assertNotNull(passwordEncoder);
    }

    @Test
    void testAuthenticationManagerConfiguration() {
        assertNotNull(authenticationManager);
        assertTrue(authenticationManager instanceof ProviderManager);

        ProviderManager providerManager = (ProviderManager) authenticationManager;
        assertEquals(1, providerManager.getProviders().size());
        assertTrue(providerManager.getProviders().get(0) instanceof DaoAuthenticationProvider);

        DaoAuthenticationProvider daoProvider = (DaoAuthenticationProvider) providerManager.getProviders().get(0);
        
        // Verify UserDetailsService is set
        UserDetailsService actualUserDetailsService = (UserDetailsService) ReflectionTestUtils.getField(daoProvider, "userDetailsService");
        assertNotNull(actualUserDetailsService);
        // In a real scenario, we might want to check if it's the same instance, but Spring might wrap it.
        // Checking it's not null is a good start. 
        
        // Verify PasswordEncoder is set
        PasswordEncoder actualPasswordEncoder = (PasswordEncoder) ReflectionTestUtils.getField(daoProvider, "passwordEncoder");
        assertNotNull(actualPasswordEncoder);
    }
}
