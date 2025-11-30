package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.BaseIntegrationTest;
import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.auth.repositories.UserDetailRepository;
import com.thecodereveal.shopease.dto.AddressRequest;
import com.thecodereveal.shopease.entities.Address;
import com.thecodereveal.shopease.repositories.AddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.security.Principal;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AddressIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private AddressRepository addressRepository;

    @BeforeEach
    void setUp() {
        addressRepository.deleteAll();
        userDetailRepository.deleteAll();
    }

    @Test
    void createAndDeleteAddress_Success() throws Exception {
        User user = User.builder()
                .email("addruser@example.com")
                .firstName("Addr")
                .lastName("User")
                .enabled(true)
                .build();
        user = userDetailRepository.save(user);

        String json = "{\"name\":\"Home\",\"street\":\"123 Main\",\"city\":\"Town\",\"state\":\"ST\",\"zipCode\":\"12345\",\"phoneNumber\":\"555-1212\"}";

        final String username = user.getEmail();
        Principal principal = (Principal) () -> username;

        // create address
        var res = mockMvc.perform(post("/api/address")
                        .principal(principal)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.street", is("123 Main")))
                .andReturn();

        String content = res.getResponse().getContentAsString();
        Address created = objectMapper.readValue(content, Address.class);
        assertNotNull(created.getId());
        assertTrue(addressRepository.findById(created.getId()).isPresent());

        // delete address
        mockMvc.perform(delete("/api/address/{id}", created.getId()))
                .andExpect(status().isOk());

        assertFalse(addressRepository.findById(created.getId()).isPresent());
    }

}
