package com.thecodereveal.shopease.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thecodereveal.shopease.auth.dto.OrderResponse;
import com.thecodereveal.shopease.dto.OrderDetails;
import com.thecodereveal.shopease.dto.OrderRequest;
import com.thecodereveal.shopease.services.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(orderController).build();
    }

    @Test
    void createOrder_Success() throws Exception {
        UUID orderId = UUID.randomUUID();
        UUID addressId = UUID.randomUUID();
        OrderResponse response = OrderResponse.builder().orderId(orderId).build();
        OrderRequest request = OrderRequest.builder()
                .addressId(addressId)
                .totalAmount(100.0)
                .paymentMethod("CARD")
                .build();
        
        when(orderService.createOrder(any(OrderRequest.class), any(Principal.class))).thenReturn(response);

        mockMvc.perform(post("/api/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .principal(() -> "testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(orderId.toString()));
        
        ArgumentCaptor<OrderRequest> requestCaptor = ArgumentCaptor.forClass(OrderRequest.class);
        ArgumentCaptor<Principal> principalCaptor = ArgumentCaptor.forClass(Principal.class);
        
        verify(orderService).createOrder(requestCaptor.capture(), principalCaptor.capture());
        
        assertEquals("testuser", principalCaptor.getValue().getName());
        assertEquals(addressId, requestCaptor.getValue().getAddressId());
        assertEquals(100.0, requestCaptor.getValue().getTotalAmount());
        assertEquals("CARD", requestCaptor.getValue().getPaymentMethod());
    }

    @Test
    void updatePaymentStatus_Success() throws Exception {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        
        when(orderService.updateStatus(eq("pi_123"), eq("succeeded"))).thenReturn(response);

        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("paymentIntent", "pi_123");
        requestMap.put("status", "succeeded");

        mockMvc.perform(post("/api/order/update-payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestMap)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
        
        verify(orderService).updateStatus("pi_123", "succeeded");
    }

    @Test
    void cancelOrder_Success() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(orderService).cancelOrder(eq(id), any(Principal.class));

        mockMvc.perform(post("/api/order/cancel/{id}", id)
                        .principal(() -> "testuser"))
                .andExpect(status().isOk());
        
        ArgumentCaptor<UUID> idCaptor = ArgumentCaptor.forClass(UUID.class);
        ArgumentCaptor<Principal> principalCaptor = ArgumentCaptor.forClass(Principal.class);
        
        verify(orderService).cancelOrder(idCaptor.capture(), principalCaptor.capture());
        
        assertEquals(id, idCaptor.getValue());
        assertEquals("testuser", principalCaptor.getValue().getName());
    }

    @Test
    void getOrderByUser_Success() throws Exception {
        UUID orderId = UUID.randomUUID();
        OrderDetails details = new OrderDetails();
        details.setId(orderId);
        
        when(orderService.getOrdersByUser("testuser")).thenReturn(Collections.singletonList(details));

        mockMvc.perform(get("/api/order/user")
                        .principal(() -> "testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(orderId.toString()));
        
        verify(orderService).getOrdersByUser("testuser");
    }
}
