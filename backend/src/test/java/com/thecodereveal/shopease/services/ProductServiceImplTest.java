package com.thecodereveal.shopease.services;

import com.thecodereveal.shopease.dto.ProductDto;
import com.thecodereveal.shopease.entities.Category;
import com.thecodereveal.shopease.entities.CategoryType;
import com.thecodereveal.shopease.entities.Product;
import com.thecodereveal.shopease.exceptions.ResourceNotFoundEx;
import com.thecodereveal.shopease.mapper.ProductMapper;
import com.thecodereveal.shopease.repositories.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    // --- Input Space Partitioning & Logic Coverage for getAllProducts ---

    /**
     * Test Case 1: categoryId is null, typeId is null
     * Logic Coverage: Both if conditions are false.
     */
    @Test
    void getAllProducts_NoFilters() {
        // Arrange
        UUID categoryId = null;
        UUID typeId = null;
        List<Product> mockProducts = Collections.singletonList(new Product());
        List<ProductDto> mockDtos = Collections.singletonList(new ProductDto());

        when(productRepository.findAll(any(Specification.class))).thenReturn(mockProducts);
        when(productMapper.getProductDtos(mockProducts)).thenReturn(mockDtos);

        // Act
        List<ProductDto> result = productService.getAllProducts(categoryId, typeId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findAll(any(Specification.class));
    }

    /**
     * Test Case 2: categoryId is valid, typeId is null
     * Logic Coverage: First if condition is true, second is false.
     */
    @Test
    void getAllProducts_CategoryFilterOnly() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        UUID typeId = null;
        List<Product> mockProducts = Collections.singletonList(new Product());
        List<ProductDto> mockDtos = Collections.singletonList(new ProductDto());

        when(productRepository.findAll(any(Specification.class))).thenReturn(mockProducts);
        when(productMapper.getProductDtos(mockProducts)).thenReturn(mockDtos);

        // Act
        List<ProductDto> result = productService.getAllProducts(categoryId, typeId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findAll(any(Specification.class));
    }

    /**
     * Test Case 3: categoryId is null, typeId is valid
     * Logic Coverage: First if condition is false, second is true.
     */
    @Test
    void getAllProducts_TypeFilterOnly() {
        // Arrange
        UUID categoryId = null;
        UUID typeId = UUID.randomUUID();
        List<Product> mockProducts = Collections.singletonList(new Product());
        List<ProductDto> mockDtos = Collections.singletonList(new ProductDto());

        when(productRepository.findAll(any(Specification.class))).thenReturn(mockProducts);
        when(productMapper.getProductDtos(mockProducts)).thenReturn(mockDtos);

        // Act
        List<ProductDto> result = productService.getAllProducts(categoryId, typeId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findAll(any(Specification.class));
    }

    /**
     * Test Case 4: categoryId is valid, typeId is valid
     * Logic Coverage: Both if conditions are true.
     */
    @Test
    void getAllProducts_BothFilters() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        UUID typeId = UUID.randomUUID();
        List<Product> mockProducts = Collections.singletonList(new Product());
        List<ProductDto> mockDtos = Collections.singletonList(new ProductDto());

        when(productRepository.findAll(any(Specification.class))).thenReturn(mockProducts);
        when(productMapper.getProductDtos(mockProducts)).thenReturn(mockDtos);

        // Act
        List<ProductDto> result = productService.getAllProducts(categoryId, typeId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findAll(any(Specification.class));
    }

    // --- Additional Tests for Coverage ---

    @Test
    void getProductBySlug_Found() {
        // Arrange
        String slug = "test-product";
        Product product = new Product();
        product.setId(UUID.randomUUID());
        Category category = new Category();
        category.setId(UUID.randomUUID());
        product.setCategory(category);
        CategoryType categoryType = new CategoryType();
        categoryType.setId(UUID.randomUUID());
        product.setCategoryType(categoryType);
        
        ProductDto productDto = new ProductDto();

        when(productRepository.findBySlug(slug)).thenReturn(product);
        when(productMapper.mapProductToDto(product)).thenReturn(productDto);

        // Act
        ProductDto result = productService.getProductBySlug(slug);

        // Assert
        assertNotNull(result);
        verify(productRepository).findBySlug(slug);
    }

    @Test
    void getProductBySlug_NotFound() {
        // Arrange
        String slug = "unknown-product";
        when(productRepository.findBySlug(slug)).thenReturn(null);

        // Act & Assert
        assertThrows(ResourceNotFoundEx.class, () -> productService.getProductBySlug(slug));
    }
    
    @Test
    void addProduct_Success() {
        // Arrange
        ProductDto inputDto = new ProductDto();
        Product mappedProduct = new Product();
        Product savedProduct = new Product();
        
        when(productMapper.mapToProductEntity(inputDto)).thenReturn(mappedProduct);
        when(productRepository.save(mappedProduct)).thenReturn(savedProduct);
        
        // Act
        Product result = productService.addProduct(inputDto);
        
        // Assert
        assertNotNull(result);
        verify(productRepository).save(mappedProduct);
    }

    @Test
    void getProductById_Found() {
        // Arrange
        UUID id = UUID.randomUUID();
        Product product = new Product();
        product.setId(id);
        Category category = new Category();
        category.setId(UUID.randomUUID());
        product.setCategory(category);
        CategoryType categoryType = new CategoryType();
        categoryType.setId(UUID.randomUUID());
        product.setCategoryType(categoryType);

        ProductDto productDto = new ProductDto();

        when(productRepository.findById(id)).thenReturn(java.util.Optional.of(product));
        when(productMapper.mapProductToDto(product)).thenReturn(productDto);

        // Act
        ProductDto result = productService.getProductById(id);

        // Assert
        assertNotNull(result);
        verify(productRepository).findById(id);
    }

    @Test
    void getProductById_NotFound() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(productRepository.findById(id)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundEx.class, () -> productService.getProductById(id));
    }

    @Test
    void updateProduct_Found() {
        // Arrange
        UUID id = UUID.randomUUID();
        ProductDto productDto = new ProductDto();
        Product existingProduct = new Product();
        existingProduct.setId(id);
        Product mappedProduct = new Product();
        Product savedProduct = new Product();

        when(productRepository.findById(id)).thenReturn(java.util.Optional.of(existingProduct));
        when(productMapper.mapToProductEntity(productDto)).thenReturn(mappedProduct);
        when(productRepository.save(mappedProduct)).thenReturn(savedProduct);

        // Act
        Product result = productService.updateProduct(productDto, id);

        // Assert
        assertNotNull(result);
        verify(productRepository).findById(id);
        verify(productRepository).save(mappedProduct);
    }

    @Test
    void updateProduct_NotFound() {
        // Arrange
        UUID id = UUID.randomUUID();
        ProductDto productDto = new ProductDto();
        when(productRepository.findById(id)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundEx.class, () -> productService.updateProduct(productDto, id));
    }

    @Test
    void fetchProductById_Found() throws Exception {
        // Arrange
        UUID id = UUID.randomUUID();
        Product product = new Product();
        when(productRepository.findById(id)).thenReturn(java.util.Optional.of(product));

        // Act
        Product result = productService.fetchProductById(id);

        // Assert
        assertNotNull(result);
        assertEquals(product, result);
    }

    @Test
    void fetchProductById_NotFound() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(productRepository.findById(id)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        assertThrows(org.apache.coyote.BadRequestException.class, () -> productService.fetchProductById(id));
    }
}
