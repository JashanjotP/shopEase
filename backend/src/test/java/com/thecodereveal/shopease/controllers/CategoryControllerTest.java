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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.mockito.Mockito.verify;
import static org.hamcrest.Matchers.*;

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
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.toString())));
        verify(categoryService).getCategory(id);
    }

    @Test
    void getAllCategories_Success() throws Exception {
        UUID id = UUID.randomUUID();
        Category category = new Category();
        category.setId(id);
        when(categoryService.getAllCategory()).thenReturn(Collections.singletonList(category));

        mockMvc.perform(get("/api/category"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Range", "1"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(id.toString())));
        verify(categoryService).getAllCategory();
    }

    @Test
    void createCategory_Success() throws Exception {
        UUID id = UUID.randomUUID();
        Category category = new Category();
        category.setId(id);
        category.setName("Electronics");
        
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName("Electronics");
        
        when(categoryService.createCategory(any(CategoryDto.class))).thenReturn(category);

        mockMvc.perform(post("/api/category")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Electronics\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(id.toString())))
                .andExpect(jsonPath("$.name", is("Electronics")));
        
        org.mockito.ArgumentCaptor<CategoryDto> captor = org.mockito.ArgumentCaptor.forClass(CategoryDto.class);
        verify(categoryService).createCategory(captor.capture());
        assertEquals("Electronics", captor.getValue().getName());
    }

    @Test
    void updateCategory_Success() throws Exception {
        UUID id = UUID.randomUUID();
        Category category = new Category();
        category.setId(id);
        category.setName("Updated Electronics");
        
        when(categoryService.updateCategory(any(CategoryDto.class), eq(id))).thenReturn(category);

        mockMvc.perform(put("/api/category/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Updated Electronics\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.toString())))
                .andExpect(jsonPath("$.name", is("Updated Electronics")));
        
        org.mockito.ArgumentCaptor<CategoryDto> captor = org.mockito.ArgumentCaptor.forClass(CategoryDto.class);
        verify(categoryService).updateCategory(captor.capture(), eq(id));
        assertEquals("Updated Electronics", captor.getValue().getName());
    }

    @Test
    void deleteCategory_Success() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(categoryService).deleteCategory(id);

        mockMvc.perform(delete("/api/category/{id}", id))
                .andExpect(status().isOk());
        verify(categoryService).deleteCategory(id);
    }

    @Test
    void deleteCategory_ReturnsNonNullResponse() {
        UUID id = UUID.randomUUID();
        doNothing().when(categoryService).deleteCategory(id);

        var response = categoryController.deleteCategory(id);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
