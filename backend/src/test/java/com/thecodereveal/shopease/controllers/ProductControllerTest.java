package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.dto.ProductDto;
import com.thecodereveal.shopease.entities.Product;
import com.thecodereveal.shopease.services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
    }

    @Test
    void getAllProducts_NoParams() throws Exception {
        when(productService.getAllProducts(null, null)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Range", "0"))
                .andExpect(jsonPath("$").isArray());
        verify(productService).getAllProducts(null, null);
    }

    @Test
    void getAllProducts_WithSlug() throws Exception {
        String slug = "test-slug";
        ProductDto productDto = new ProductDto();
        when(productService.getProductBySlug(slug)).thenReturn(productDto);

        mockMvc.perform(get("/api/products").param("slug", slug))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Range", "1"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1));
        verify(productService).getProductBySlug(slug);
    }

    // FIX 1: Kills Mutation on getProductById (Replaced return value with null)
    @Test
    void getProductById_Success() throws Exception {
        UUID id = UUID.randomUUID();
        ProductDto productDto = new ProductDto();
        productDto.setId(id); // Ensure the DTO has the ID set

        when(productService.getProductById(id)).thenReturn(productDto);

        mockMvc.perform(get("/api/products/{id}", id))
                .andExpect(status().isOk())
                // Asserting content exists ensures return value was NOT null
                .andExpect(jsonPath("$.id").value(id.toString())); 
        
        verify(productService).getProductById(id);
    }

    @Test
    void createProduct_Success() throws Exception {
        Product product = new Product();
        product.setId(UUID.randomUUID());
        when(productService.addProduct(any(ProductDto.class))).thenReturn(product);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isCreated());
        verify(productService).addProduct(any(ProductDto.class));
    }

    // FIX 2: Kills Mutation on updateProduct (Replaced return value with null)
    @Test
    void updateProduct_Success() throws Exception {
        UUID id = UUID.randomUUID();
        Product product = new Product();
        product.setId(id); // Ensure the entity has the ID set

        when(productService.updateProduct(any(ProductDto.class), eq(id))).thenReturn(product);

        mockMvc.perform(put("/api/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                // Asserting content exists ensures return value was NOT null
                .andExpect(jsonPath("$.id").value(id.toString())); 

        verify(productService).updateProduct(any(ProductDto.class), eq(id));
    }
}