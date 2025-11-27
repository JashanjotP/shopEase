package com.thecodereveal.shopease.mapper;

import com.thecodereveal.shopease.dto.ProductDto;
import com.thecodereveal.shopease.dto.ProductResourceDto;
import com.thecodereveal.shopease.dto.ProductVariantDto;
import com.thecodereveal.shopease.entities.*;
import com.thecodereveal.shopease.services.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.verify;

public class ProductMapperTest {

    @InjectMocks
    private ProductMapper productMapper;

    @Mock
    private CategoryService categoryService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testMapToProductEntity() {
        UUID categoryId = UUID.randomUUID();
        UUID categoryTypeId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();

        ProductDto productDto = new ProductDto();
        productDto.setId(productId);
        productDto.setName("Test Product");
        productDto.setDescription("Description");
        productDto.setBrand("Brand");
        productDto.setNewArrival(true);
        productDto.setPrice(BigDecimal.valueOf(100.0));
        productDto.setRating(4.5f);
        productDto.setSlug("test-product");
        productDto.setCategoryId(categoryId);
        productDto.setCategoryTypeId(categoryTypeId);

        ProductVariantDto variantDto = new ProductVariantDto();
        variantDto.setColor("Red");
        variantDto.setSize("M");
        variantDto.setStockQuantity(10);
        productDto.setVariants(Arrays.asList(variantDto));

        ProductResourceDto resourceDto = new ProductResourceDto();
        resourceDto.setName("Image");
        resourceDto.setUrl("http://image.com");
        resourceDto.setIsPrimary(true);
        resourceDto.setType("IMAGE");
        productDto.setProductResources(Arrays.asList(resourceDto));

        Category category = new Category();
        category.setId(categoryId);
        CategoryType categoryType = new CategoryType();
        categoryType.setId(categoryTypeId);
        category.setCategoryTypes(Arrays.asList(categoryType));

        when(categoryService.getCategory(categoryId)).thenReturn(category);

        Product product = productMapper.mapToProductEntity(productDto);

        assertNotNull(product);
        assertEquals(productId, product.getId());
        assertEquals("Test Product", product.getName());
        assertEquals("Description", product.getDescription());
        assertEquals("Brand", product.getBrand());
        assertTrue(product.isNewArrival());
        assertEquals(BigDecimal.valueOf(100.0), product.getPrice());
        assertEquals(4.5f, product.getRating());
        assertEquals("test-product", product.getSlug());
        
        assertEquals(categoryId, product.getCategory().getId());
        assertEquals(categoryTypeId, product.getCategoryType().getId());
        
        assertEquals(1, product.getProductVariants().size());
        ProductVariant mappedVariant = product.getProductVariants().get(0);
        assertEquals("Red", mappedVariant.getColor());
        assertEquals("M", mappedVariant.getSize());
        assertEquals(10, mappedVariant.getStockQuantity());
        assertEquals(product, mappedVariant.getProduct());
        
        assertEquals(1, product.getResources().size());
        Resources mappedResource = product.getResources().get(0);
        assertEquals("Image", mappedResource.getName());
        assertEquals("http://image.com", mappedResource.getUrl());
        assertTrue(mappedResource.getIsPrimary());
        assertEquals("IMAGE", mappedResource.getType());
        assertEquals(product, mappedResource.getProduct());
        
        verify(categoryService).getCategory(categoryId);
    }

    @Test
    void testMapToProductEntity_WithIdsInSubLists() {
        UUID categoryId = UUID.randomUUID();
        UUID variantId = UUID.randomUUID();
        UUID resourceId = UUID.randomUUID();

        ProductDto productDto = new ProductDto();
        productDto.setCategoryId(categoryId);
        
        ProductVariantDto variantDto = new ProductVariantDto();
        variantDto.setId(variantId);
        productDto.setVariants(Arrays.asList(variantDto));

        ProductResourceDto resourceDto = new ProductResourceDto();
        resourceDto.setId(resourceId);
        productDto.setProductResources(Arrays.asList(resourceDto));

        Category category = new Category();
        category.setId(categoryId);
        category.setCategoryTypes(Collections.emptyList()); // Fix NPE
        when(categoryService.getCategory(categoryId)).thenReturn(category);

        Product product = productMapper.mapToProductEntity(productDto);

        assertNotNull(product);
        assertEquals(1, product.getProductVariants().size());
        assertEquals(variantId, product.getProductVariants().get(0).getId());
        
        assertEquals(1, product.getResources().size());
        assertEquals(resourceId, product.getResources().get(0).getId());
    }

// ...existing code...
    @Test
    void testMapToProductEntity_NullFields() {
        ProductDto productDto = new ProductDto();
        productDto.setName("Minimal Product");
        productDto.setCategoryId(UUID.randomUUID());
        // ID, Variants, Resources are null

        when(categoryService.getCategory(any(UUID.class))).thenReturn(null);

        Product product = productMapper.mapToProductEntity(productDto);

        assertNotNull(product);
        assertEquals("Minimal Product", product.getName());
        assertNull(product.getId());
        assertNull(product.getCategory());
        assertNull(product.getProductVariants());
        assertNull(product.getResources());
        verify(categoryService).getCategory(any(UUID.class));
    }

    @Test
    void testMapToProductEntity_CategoryTypeNotFound() {
        UUID categoryId = UUID.randomUUID();
        UUID categoryTypeId = UUID.randomUUID();

        ProductDto productDto = new ProductDto();
        productDto.setCategoryId(categoryId);
        productDto.setCategoryTypeId(categoryTypeId);

        Category category = new Category();
        category.setId(categoryId);
        // Empty category types list, so filter will find nothing
        category.setCategoryTypes(new ArrayList<>());

        when(categoryService.getCategory(categoryId)).thenReturn(category);

        Product product = productMapper.mapToProductEntity(productDto);

        assertNotNull(product);
        assertEquals(category, product.getCategory());
        assertNull(product.getCategoryType());
        verify(categoryService).getCategory(categoryId);
    }

    @Test
    public void testMapProductToDto() {
        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setName("Test Product");
        product.setBrand("Brand");
        product.setPrice(BigDecimal.valueOf(100.0));
        product.setNewArrival(true);
        product.setRating(4.5f);
        product.setDescription("Description");
        product.setSlug("test-product");

        Resources resource = new Resources();
        resource.setUrl("http://image.com");
        resource.setIsPrimary(true);
        product.setResources(Arrays.asList(resource));

        ProductDto productDto = productMapper.mapProductToDto(product);

        assertNotNull(productDto);
        assertEquals("Test Product", productDto.getName());
        assertEquals("http://image.com", productDto.getThumbnail());
    }

    @Test
    public void testGetProductDtos() {
        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setName("Test Product");
        Resources resource = new Resources();
        resource.setUrl("http://image.com");
        resource.setIsPrimary(true);
        product.setResources(Arrays.asList(resource));

        List<ProductDto> dtos = productMapper.getProductDtos(Arrays.asList(product));

        assertNotNull(dtos);
        assertEquals(1, dtos.size());
    }

    @Test
    public void testMapProductVariantListToDto() {
        ProductVariant variant = new ProductVariant();
        variant.setId(UUID.randomUUID());
        variant.setColor("Red");
        variant.setSize("M");
        variant.setStockQuantity(10);

        List<ProductVariantDto> dtos = productMapper.mapProductVariantListToDto(Arrays.asList(variant));

        assertNotNull(dtos);
        assertEquals(1, dtos.size());
        assertEquals("Red", dtos.get(0).getColor());
    }

    @Test
    public void testMapProductResourcesListDto() {
        Resources resource = new Resources();
        resource.setId(UUID.randomUUID());
        resource.setName("Image");
        resource.setUrl("http://image.com");
        resource.setIsPrimary(true);
        resource.setType("IMAGE");

        List<ProductResourceDto> dtos = productMapper.mapProductResourcesListDto(Arrays.asList(resource));

        assertNotNull(dtos);
        assertEquals(1, dtos.size());
        assertEquals("http://image.com", dtos.get(0).getUrl());
    }
}
