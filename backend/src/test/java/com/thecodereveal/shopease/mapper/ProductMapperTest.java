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
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

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

        ProductDto productDto = new ProductDto();
        productDto.setId(UUID.randomUUID());
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
        productDto.setProductResources(Arrays.asList(resourceDto));

        Category category = new Category();
        category.setId(categoryId);
        CategoryType categoryType = new CategoryType();
        categoryType.setId(categoryTypeId);
        category.setCategoryTypes(Arrays.asList(categoryType));

        when(categoryService.getCategory(categoryId)).thenReturn(category);

        Product product = productMapper.mapToProductEntity(productDto);

        assertNotNull(product);
        assertEquals("Test Product", product.getName());
        assertEquals(categoryId, product.getCategory().getId());
        assertEquals(categoryTypeId, product.getCategoryType().getId());
        assertEquals(1, product.getProductVariants().size());
        assertEquals(1, product.getResources().size());
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
    }
}
