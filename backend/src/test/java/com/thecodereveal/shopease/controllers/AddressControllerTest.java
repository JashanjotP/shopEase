package com.thecodereveal.shopease.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thecodereveal.shopease.dto.AddressRequest;
import com.thecodereveal.shopease.entities.Address;
import com.thecodereveal.shopease.services.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import static org.mockito.Mockito.verify;

public class AddressControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AddressService addressService;

    @InjectMocks
    private AddressController addressController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(addressController).build();
    }

    @Test
    public void testCreateAddress() throws Exception {
        AddressRequest request = new AddressRequest();
        request.setCity("New York");

        Address address = new Address();
        address.setCity("New York");

        when(addressService.createAddress(any(AddressRequest.class), any(Principal.class))).thenReturn(address);

        mockMvc.perform(post("/api/address")
                .principal(() -> "testUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("New York"));
        
        verify(addressService).createAddress(any(AddressRequest.class), any(Principal.class));
    }

    @Test
    public void testDeleteAddress() throws Exception {
        UUID id = UUID.randomUUID();

        doNothing().when(addressService).deleteAddress(id);

        mockMvc.perform(delete("/api/address/" + id))
                .andExpect(status().isOk());
        
        verify(addressService).deleteAddress(id);
    }
}
