package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.dto.CategoryDto;
import com.thecodereveal.shopease.entities.Category;
import com.thecodereveal.shopease.services.CategoryService;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();
    }

    @Test
    void getCategoryById_Success() throws Exception {
        UUID id = UUID.randomUUID();
        Category category = new Category();
        category.setId(id);
        when(categoryService.getCategory(id)).thenReturn(category);

        mockMvc.perform(get("/api/category/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void getAllCategories_Success() throws Exception {
        when(categoryService.getAllCategory()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/category"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Range", "0"));
    }

    @Test
    void createCategory_Success() throws Exception {
        Category category = new Category();
        when(categoryService.createCategory(any(CategoryDto.class))).thenReturn(category);

        mockMvc.perform(post("/api/category")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isCreated());
    }

    @Test
    void updateCategory_Success() throws Exception {
        UUID id = UUID.randomUUID();
        Category category = new Category();
        when(categoryService.updateCategory(any(CategoryDto.class), eq(id))).thenReturn(category);

        mockMvc.perform(put("/api/category/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteCategory_Success() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(categoryService).deleteCategory(id);

        mockMvc.perform(delete("/api/category/{id}", id))
                .andExpect(status().isOk());
    }
}
