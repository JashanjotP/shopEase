package com.thecodereveal.shopease.services;

import com.stripe.model.PaymentIntent;
import com.thecodereveal.shopease.auth.dto.OrderResponse;
import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.dto.OrderDetails;
import com.thecodereveal.shopease.dto.OrderItemRequest;
import com.thecodereveal.shopease.dto.OrderRequest;
import com.thecodereveal.shopease.entities.*;
import com.thecodereveal.shopease.repositories.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.security.Principal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductService productService;

    @Mock
    private PaymentIntentService paymentIntentService;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_Success() throws Exception {
        // Arrange
        OrderRequest request = new OrderRequest();
        request.setAddressId(UUID.randomUUID());
        request.setTotalAmount(100.0);
        request.setPaymentMethod("CARD");
        request.setOrderItemRequests(Collections.singletonList(new OrderItemRequest()));

        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("testuser");

        User user = new User();
        Address address = new Address();
        address.setId(request.getAddressId());
        user.setAddressList(Collections.singletonList(address));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(user);

        Product product = new Product();
        when(productService.fetchProductById(any())).thenReturn(product);

        Order savedOrder = new Order();
        savedOrder.setId(UUID.randomUUID());
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        Map<String, String> paymentIntentMap = new HashMap<>();
        paymentIntentMap.put("client_secret", "secret");
        when(paymentIntentService.createPaymentIntent(any(Order.class))).thenReturn(paymentIntentMap);

        // Act
        OrderResponse response = orderService.createOrder(request, principal);

        // Assert
        assertNotNull(response);
        assertEquals(savedOrder.getId(), response.getOrderId());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void getOrdersByUser_Success() {
        String username = "testuser";
        User user = new User();
        when(userDetailsService.loadUserByUsername(username)).thenReturn(user);

        Order order = new Order();
        order.setId(UUID.randomUUID());
        order.setOrderItemList(new ArrayList<>());
        when(orderRepository.findByUser(user)).thenReturn(Collections.singletonList(order));

        List<OrderDetails> result = orderService.getOrdersByUser(username);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void cancelOrder_Success() {
        UUID orderId = UUID.randomUUID();
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("testuser");

        User user = new User();
        user.setId(UUID.randomUUID());
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(user);

        Order order = new Order();
        order.setUser(user);
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        orderService.cancelOrder(orderId, principal);

        assertEquals(OrderStatus.CANCELLED, order.getOrderStatus());
        verify(orderRepository).save(order);
    }
    
    @Test
    void updateStatus_Success() {
        String paymentIntentId = "pi_123";
        String status = "succeeded";
        
        try (MockedStatic<PaymentIntent> mockedPaymentIntent = mockStatic(PaymentIntent.class)) {
            PaymentIntent paymentIntent = mock(PaymentIntent.class);
            when(paymentIntent.getStatus()).thenReturn("succeeded");
            when(paymentIntent.getPaymentMethod()).thenReturn("card");
            
            Map<String, String> metadata = new HashMap<>();
            UUID orderId = UUID.randomUUID();
            metadata.put("orderId", orderId.toString());
            when(paymentIntent.getMetadata()).thenReturn(metadata);
            
            mockedPaymentIntent.when(() -> PaymentIntent.retrieve(paymentIntentId)).thenReturn(paymentIntent);
            
            Order order = new Order();
            order.setId(orderId);
            Payment payment = new Payment();
            order.setPayment(payment);
            
            when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
            when(orderRepository.save(any(Order.class))).thenReturn(order);
            
            Map<String, String> result = orderService.updateStatus(paymentIntentId, status);
            
            assertNotNull(result);
            assertEquals(orderId.toString(), result.get("orderId"));
            assertEquals(OrderStatus.IN_PROGRESS, order.getOrderStatus());
        }
    }
}
