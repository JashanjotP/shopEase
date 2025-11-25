package com.thecodereveal.shopease.auth.services;

import com.thecodereveal.shopease.auth.entities.Authority;
import com.thecodereveal.shopease.auth.repositories.AuthorityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthorityServiceTest {

    @Mock
    private AuthorityRepository authorityRepository;

    @InjectMocks
    private AuthorityService authorityService;

    @Test
    void getUserAuthority_Success() {
        Authority authority = new Authority();
        authority.setRoleCode("USER");
        when(authorityRepository.findByRoleCode("USER")).thenReturn(authority);

        List<Authority> result = authorityService.getUserAuthority();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("USER", result.get(0).getRoleCode());
    }

    @Test
    void createAuthority_Success() {
        String role = "ADMIN";
        String description = "Administrator";
        Authority savedAuthority = new Authority();
        savedAuthority.setRoleCode(role);
        savedAuthority.setRoleDescription(description);

        when(authorityRepository.save(any(Authority.class))).thenReturn(savedAuthority);

        Authority result = authorityService.createAuthority(role, description);

        assertNotNull(result);
        assertEquals(role, result.getRoleCode());
    }
}
