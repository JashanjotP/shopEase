package com.thecodereveal.shopease.auth.services;

import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.auth.repositories.UserDetailRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OAuth2ServiceTest {

    @Mock
    private UserDetailRepository userDetailRepository;

    @Mock
    private AuthorityService authorityService;

    @InjectMocks
    private OAuth2Service oAuth2Service;

    @Test
    void getUser_Found() {
        String username = "test@example.com";
        User user = new User();
        user.setEmail(username);
        when(userDetailRepository.findByEmail(username)).thenReturn(user);

        User result = oAuth2Service.getUser(username);

        assertNotNull(result);
        assertEquals(username, result.getEmail());
    }

    @Test
    void createUser_Success() {
        OAuth2User oAuth2User = mock(OAuth2User.class);
        when(oAuth2User.getAttribute("given_name")).thenReturn("John");
        when(oAuth2User.getAttribute("family_name")).thenReturn("Doe");
        when(oAuth2User.getAttribute("email")).thenReturn("john.doe@example.com");

        when(authorityService.getUserAuthority()).thenReturn(new ArrayList<>());

        User savedUser = new User();
        savedUser.setEmail("john.doe@example.com");
        when(userDetailRepository.save(any(User.class))).thenReturn(savedUser);

        User result = oAuth2Service.createUser(oAuth2User, "google");

        assertNotNull(result);
        assertEquals("john.doe@example.com", result.getEmail());
    }
}
