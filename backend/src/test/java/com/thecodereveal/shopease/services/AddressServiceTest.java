package com.thecodereveal.shopease.services;

import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.dto.AddressRequest;
import com.thecodereveal.shopease.entities.Address;
import com.thecodereveal.shopease.repositories.AddressRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.security.Principal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private AddressService addressService;

    @Test
    void createAddress_Success() {
        AddressRequest request = new AddressRequest();
        request.setName("Home");
        request.setStreet("123 Main St");
        
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("testuser");
        
        User user = new User();
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(user);
        
        Address savedAddress = new Address();
        savedAddress.setId(UUID.randomUUID());
        when(addressRepository.save(any(Address.class))).thenReturn(savedAddress);

        Address result = addressService.createAddress(request, principal);

        assertNotNull(result);
        verify(addressRepository).save(any(Address.class));
    }

    @Test
    void deleteAddress_Success() {
        UUID id = UUID.randomUUID();
        doNothing().when(addressRepository).deleteById(id);

        addressService.deleteAddress(id);

        verify(addressRepository).deleteById(id);
    }
}
