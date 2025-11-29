package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.BaseIntegrationTest;
import com.thecodereveal.shopease.entities.Category;
import com.thecodereveal.shopease.entities.CategoryType;
import com.thecodereveal.shopease.entities.Product;
import com.thecodereveal.shopease.entities.Resources;
import com.thecodereveal.shopease.repositories.CategoryRepository;
import com.thecodereveal.shopease.repositories.OrderRepository;
import com.thecodereveal.shopease.repositories.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Category persistedCategory;
    private CategoryType persistedType;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category category = Category.builder()
                .name("Electronics")
                .code("ELEC")
                .description("Electronics")
                .build();

        CategoryType type = new CategoryType();
        type.setName("Mobile");
        type.setCode("MOB");
        type.setDescription("Mobile phones");
        type.setCategory(category);

        category.setCategoryTypes(List.of(type));

        persistedCategory = categoryRepository.save(category);
        persistedType = persistedCategory.getCategoryTypes().get(0);
    }

    @Test
    void createAndGetProduct_Success() throws Exception {
        String json = String.format(
                "{\"name\":\"Test Phone\",\"description\":\"Nice phone\",\"price\":99.99,\"brand\":\"Acme\",\"isNewArrival\":true,\"slug\":\"test-phone\",\"categoryId\":\"%s\",\"categoryTypeId\":\"%s\",\"productResources\":[{\"name\":\"thumb\",\"url\":\"http://example.com/thumb.jpg\",\"type\":\"IMAGE\",\"isPrimary\":true}]}",
                persistedCategory.getId(), persistedType.getId());

        MvcResult result = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name", is("Test Phone")))
                .andReturn();

        String content = result.getResponse().getContentAsString();
        Product created = objectMapper.readValue(content, Product.class);
        assertNotNull(created.getId());

        // fetch by id
        mockMvc.perform(get("/api/products/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().toString())))
                .andExpect(jsonPath("$.name", is("Test Phone")));

        // fetch by slug
        mockMvc.perform(get("/api/products").param("slug", "test-phone"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Range", "1"))
                .andExpect(jsonPath("$[0].name", is("Test Phone")));
    }

    @Test
    void getAllProducts_Success() throws Exception {
        Resources r1 = new Resources();
        r1.setIsPrimary(true);
        r1.setUrl("http://example.com/p1.jpg");
        r1.setName("p1-thumb");
        r1.setType("IMAGE");

        Product p1 = Product.builder()
                .name("P1")
                .description("p1")
                .price(new BigDecimal("10.00"))
                .brand("B")
                .isNewArrival(true)
                .slug("p1")
                .category(persistedCategory)
                .categoryType(persistedType)
                .build();
        p1.setResources(List.of(r1));
        r1.setProduct(p1);

        Resources r2 = new Resources();
        r2.setIsPrimary(true);
        r2.setUrl("http://example.com/p2.jpg");
        r2.setName("p2-thumb");
        r2.setType("IMAGE");

        Product p2 = Product.builder()
                .name("P2")
                .description("p2")
                .price(new BigDecimal("20.00"))
                .brand("B2")
                .isNewArrival(false)
                .slug("p2")
                .category(persistedCategory)
                .categoryType(persistedType)
                .build();
        p2.setResources(List.of(r2));
        r2.setProduct(p2);

        productRepository.save(p1);
        productRepository.save(p2);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Range", "2"))
                .andExpect(jsonPath("$", hasSize(2)));
    }

}
