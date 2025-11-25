package com.thecodereveal.shopease.services;

import com.thecodereveal.shopease.dto.CategoryDto;
import com.thecodereveal.shopease.dto.CategoryTypeDto;
import com.thecodereveal.shopease.entities.Category;
import com.thecodereveal.shopease.entities.CategoryType;
import com.thecodereveal.shopease.exceptions.ResourceNotFoundEx;
import com.thecodereveal.shopease.repositories.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void getCategory_Found() {
        UUID id = UUID.randomUUID();
        Category category = new Category();
        category.setId(id);
        when(categoryRepository.findById(id)).thenReturn(Optional.of(category));

        Category result = categoryService.getCategory(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    void getCategory_NotFound() {
        UUID id = UUID.randomUUID();
        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        Category result = categoryService.getCategory(id);

        assertNull(result);
    }

    @Test
    void createCategory_Success() {
        CategoryDto dto = new CategoryDto();
        dto.setName("Test Category");
        dto.setCode("TEST");
        dto.setDescription("Test Description");
        
        CategoryTypeDto typeDto = new CategoryTypeDto();
        typeDto.setName("Type 1");
        typeDto.setCode("T1");
        dto.setCategoryTypes(Collections.singletonList(typeDto));

        Category savedCategory = new Category();
        savedCategory.setId(UUID.randomUUID());
        savedCategory.setName("Test Category");

        when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);

        Category result = categoryService.createCategory(dto);

        assertNotNull(result);
        assertEquals(savedCategory.getId(), result.getId());
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void getAllCategory_Success() {
        List<Category> categories = Collections.singletonList(new Category());
        when(categoryRepository.findAll()).thenReturn(categories);

        List<Category> result = categoryService.getAllCategory();

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void updateCategory_Found() {
        UUID id = UUID.randomUUID();
        CategoryDto dto = new CategoryDto();
        dto.setName("Updated Name");
        dto.setCategoryTypes(new ArrayList<>());

        Category existingCategory = new Category();
        existingCategory.setId(id);
        existingCategory.setCategoryTypes(new ArrayList<>());

        when(categoryRepository.findById(id)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(existingCategory);

        Category result = categoryService.updateCategory(dto, id);

        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        verify(categoryRepository).save(existingCategory);
    }

    @Test
    void updateCategory_NotFound() {
        UUID id = UUID.randomUUID();
        CategoryDto dto = new CategoryDto();
        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundEx.class, () -> categoryService.updateCategory(dto, id));
    }

    @Test
    void deleteCategory_Success() {
        UUID id = UUID.randomUUID();
        doNothing().when(categoryRepository).deleteById(id);

        categoryService.deleteCategory(id);

        verify(categoryRepository).deleteById(id);
    }

    @Test
    void updateCategory_WithTypes() {
        UUID id = UUID.randomUUID();
        UUID typeId = UUID.randomUUID();
        
        CategoryDto dto = new CategoryDto();
        dto.setName("Updated Name");
        
        CategoryTypeDto existingTypeDto = new CategoryTypeDto();
        existingTypeDto.setId(typeId);
        existingTypeDto.setName("Updated Type");
        existingTypeDto.setCode("UT");
        
        CategoryTypeDto newTypeDto = new CategoryTypeDto();
        newTypeDto.setName("New Type");
        newTypeDto.setCode("NT");
        
        dto.setCategoryTypes(Arrays.asList(existingTypeDto, newTypeDto));

        Category existingCategory = new Category();
        existingCategory.setId(id);
        
        CategoryType existingType = new CategoryType();
        existingType.setId(typeId);
        existingType.setName("Old Type");
        existingType.setCode("OT");
        
        List<CategoryType> existingTypes = new ArrayList<>();
        existingTypes.add(existingType);
        existingCategory.setCategoryTypes(existingTypes);

        when(categoryRepository.findById(id)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Category result = categoryService.updateCategory(dto, id);

        assertNotNull(result);
        assertEquals(2, result.getCategoryTypes().size());
        
        CategoryType updatedType = result.getCategoryTypes().stream().filter(t -> t.getId() != null).findFirst().orElse(null);
        assertNotNull(updatedType);
        assertEquals("Updated Type", updatedType.getName());
        
        CategoryType newType = result.getCategoryTypes().stream().filter(t -> t.getId() == null).findFirst().orElse(null);
        assertNotNull(newType);
        assertEquals("New Type", newType.getName());
    }
}
