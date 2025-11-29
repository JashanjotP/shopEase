package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.BaseIntegrationTest;
import com.thecodereveal.shopease.entities.Category;
import com.thecodereveal.shopease.repositories.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CategoryIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
    }

    @Test
    void createCategory_Success() throws Exception {
        String json = "{\"name\":\"Electronics\",\"code\":\"ELEC\",\"description\":\"Electronics category\"}";

        MvcResult result = mockMvc.perform(post("/api/category")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name", is("Electronics")))
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Category created = objectMapper.readValue(content, Category.class);
        assertNotNull(created.getId());
        assertTrue(categoryRepository.findById(created.getId()).isPresent());
    }

    @Test
    void getCategoryById_Success() throws Exception {
        Category category = Category.builder()
                .name("Books")
                .code("BOOK")
                .description("Books category")
                .build();
        category = categoryRepository.save(category);

        mockMvc.perform(get("/api/category/{id}", category.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(category.getId().toString())))
                .andExpect(jsonPath("$.name", is("Books")));
    }

    @Test
    void updateCategory_Success() throws Exception {
        Category category = Category.builder()
                .name("Home")
                .code("HOME")
                .description("Home category")
                .build();
        category = categoryRepository.save(category);

        String updateJson = "{\"name\":\"Home & Garden\",\"code\":\"HOME\",\"description\":\"Updated description\"}";

        mockMvc.perform(put("/api/category/{id}", category.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(category.getId().toString())))
                .andExpect(jsonPath("$.name", is("Home & Garden")));

        Category updated = categoryRepository.findById(category.getId()).orElseThrow();
        assertEquals("Home & Garden", updated.getName());
        assertEquals("Updated description", updated.getDescription());
    }

    @Test
    void deleteCategory_Success() throws Exception {
        Category category = Category.builder()
                .name("Toys")
                .code("TOYS")
                .description("Toys category")
                .build();
        category = categoryRepository.save(category);

        mockMvc.perform(delete("/api/category/{id}", category.getId()))
                .andExpect(status().isOk());

        assertFalse(categoryRepository.findById(category.getId()).isPresent());
    }

    @Test
    void getAllCategories_Success() throws Exception {
        Category c1 = Category.builder().name("A").code("A").description("A").build();
        Category c2 = Category.builder().name("B").code("B").description("B").build();
        categoryRepository.save(c1);
        categoryRepository.save(c2);

        mockMvc.perform(get("/api/category"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Range", "2"))
                .andExpect(jsonPath("$", hasSize(2)));
    }

}
