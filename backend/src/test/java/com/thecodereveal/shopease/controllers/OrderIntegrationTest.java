package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.BaseIntegrationTest;
import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.auth.repositories.UserDetailRepository;
import com.thecodereveal.shopease.entities.*;
import com.thecodereveal.shopease.repositories.CategoryRepository;
import com.thecodereveal.shopease.repositories.OrderRepository;
import com.thecodereveal.shopease.repositories.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Category persistedCategory;
    private CategoryType persistedType;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userDetailRepository.deleteAll();

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
    void createGetAndCancelOrder_Flow() throws Exception {
        // create product
        Product product = Product.builder()
                .name("XPhone")
                .description("Nice phone")
                .price(new BigDecimal("199.99"))
                .brand("Acme")
                .isNewArrival(true)
                .slug("xphone")
                .category(persistedCategory)
                .categoryType(persistedType)
                .build();

        product = productRepository.save(product);

        // create user with address
        Address address = Address.builder()
                .street("123 Main")
                .city("Town")
                .state("ST")
                .zipCode("12345")
                .phoneNumber("555-1212")
                .name("Home")
                .build();

        User user = User.builder()
                .email("testuser@example.com")
                .firstName("Test")
                .lastName("User")
                .enabled(true)
                .build();

        address.setUser(user);
        user.setAddressList(List.of(address));

        user = userDetailRepository.save(user);

        UUIDHolder idHolder = new UUIDHolder();

        // build order request JSON
        String orderJson = String.format(
                "{\"addressId\":\"%s\",\"orderItemRequests\":[{\"productId\":\"%s\",\"quantity\":1}],\"totalAmount\":199.99,\"paymentMethod\":\"COD\"}",
                user.getAddressList().get(0).getId(), product.getId());

        final String username = user.getEmail();
        Principal principal = (Principal) () -> username;

        MvcResult createRes = mockMvc.perform(post("/api/order")
                        .principal(principal)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(orderJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").exists())
                .andExpect(jsonPath("$.paymentMethod", is("COD")))
                .andReturn();

        String content = createRes.getResponse().getContentAsString();
        Map<?,?> map = objectMapper.readValue(content, Map.class);
        String orderId = String.valueOf(map.get("orderId"));
        assertNotNull(orderId);

        // verify order saved
        java.util.UUID oid = java.util.UUID.fromString(orderId);
        com.thecodereveal.shopease.entities.Order saved = orderRepository.findById(oid).orElseThrow();
        assertEquals(OrderStatus.PENDING, saved.getOrderStatus());

        // get orders by user
        mockMvc.perform(get("/api/order/user").principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(orderId)));

        // cancel order
        mockMvc.perform(post("/api/order/cancel/{id}", oid).principal(principal))
                .andExpect(status().isOk());

        com.thecodereveal.shopease.entities.Order cancelled = orderRepository.findById(oid).orElseThrow();
        assertEquals(OrderStatus.CANCELLED, cancelled.getOrderStatus());
    }

    // small helper to satisfy compilation for lambdas (not used otherwise)
    private static class UUIDHolder { }

}
