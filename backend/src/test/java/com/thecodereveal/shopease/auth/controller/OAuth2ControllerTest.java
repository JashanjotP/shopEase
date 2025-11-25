package com.thecodereveal.shopease.auth.controller;

import com.thecodereveal.shopease.auth.config.JWTTokenHelper;
import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.auth.services.OAuth2Service;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class OAuth2ControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OAuth2Service oAuth2Service;

    @Mock
    private JWTTokenHelper jwtTokenHelper;

    @InjectMocks
    private OAuth2Controller oAuth2Controller;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(oAuth2Controller).build();
    }

    @Test
    public void testCallbackOAuth2_UserExists() throws Exception {
        OAuth2User oAuth2User = mock(OAuth2User.class);
        when(oAuth2User.getAttribute("email")).thenReturn("test@example.com");

        User user = new User();
        user.setEmail("test@example.com");

        when(oAuth2Service.getUser("test@example.com")).thenReturn(user);
        when(jwtTokenHelper.generateToken("test@example.com")).thenReturn("test-token");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(oAuth2User);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Since we are using @AuthenticationPrincipal, we need to inject it via the test
        // But MockMvc standalone setup might not handle @AuthenticationPrincipal automatically without CustomArgumentResolver
        // However, Spring Security Test support can help.
        // A simpler way for unit test is to call the method directly or use a custom argument resolver.
        
        // Let's try calling the method directly first to avoid MockMvc complexity with @AuthenticationPrincipal in standalone mode
        HttpServletResponse response = mock(HttpServletResponse.class);
        oAuth2Controller.callbackOAuth2(oAuth2User, response);
        
        verify(response).sendRedirect("http://localhost:3000/oauth2/callback?token=test-token");
    }

    @Test
    public void testCallbackOAuth2_UserNew() throws Exception {
        OAuth2User oAuth2User = mock(OAuth2User.class);
        when(oAuth2User.getAttribute("email")).thenReturn("new@example.com");

        when(oAuth2Service.getUser("new@example.com")).thenReturn(null);
        
        User newUser = new User();
        newUser.setEmail("new@example.com");
        when(oAuth2Service.createUser(eq(oAuth2User), eq("google"))).thenReturn(newUser);
        
        when(jwtTokenHelper.generateToken("new@example.com")).thenReturn("new-token");

        HttpServletResponse response = mock(HttpServletResponse.class);
        oAuth2Controller.callbackOAuth2(oAuth2User, response);

        verify(response).sendRedirect("http://localhost:3000/oauth2/callback?token=new-token");
    }
}
