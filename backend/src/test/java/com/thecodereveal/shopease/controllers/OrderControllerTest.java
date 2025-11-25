package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.auth.dto.OrderResponse;
import com.thecodereveal.shopease.dto.OrderDetails;
import com.thecodereveal.shopease.dto.OrderRequest;
import com.thecodereveal.shopease.services.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(orderController).build();
    }

    @Test
    void createOrder_Success() throws Exception {
        OrderResponse response = OrderResponse.builder().orderId(UUID.randomUUID()).build();
        when(orderService.createOrder(any(OrderRequest.class), any(Principal.class))).thenReturn(response);

        mockMvc.perform(post("/api/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}")
                        .principal(() -> "testuser"))
                .andExpect(status().isOk());
    }

    @Test
    void updatePaymentStatus_Success() throws Exception {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        when(orderService.updateStatus(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/order/update-payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"paymentIntent\":\"pi_123\", \"status\":\"succeeded\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void cancelOrder_Success() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(orderService).cancelOrder(eq(id), any(Principal.class));

        mockMvc.perform(post("/api/order/cancel/{id}", id)
                        .principal(() -> "testuser"))
                .andExpect(status().isOk());
    }

    @Test
    void getOrderByUser_Success() throws Exception {
        when(orderService.getOrdersByUser("testuser")).thenReturn(Collections.singletonList(new OrderDetails()));

        mockMvc.perform(get("/api/order/user")
                        .principal(() -> "testuser"))
                .andExpect(status().isOk());
    }
}
