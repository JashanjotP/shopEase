package com.thecodereveal.shopease.services;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.thecodereveal.shopease.auth.entities.User;
import com.thecodereveal.shopease.entities.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PaymentIntentServiceTest {

    @InjectMocks
    private PaymentIntentService paymentIntentService;

    @Test
    void createPaymentIntent_Success() throws StripeException {
        try (MockedStatic<PaymentIntent> mockedPaymentIntent = mockStatic(PaymentIntent.class)) {
            PaymentIntent paymentIntent = mock(PaymentIntent.class);
            when(paymentIntent.getClientSecret()).thenReturn("secret_123");

            mockedPaymentIntent.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenReturn(paymentIntent);

            Order order = new Order();
            order.setId(UUID.randomUUID());
            order.setTotalAmount(100.0);
            User user = new User();
            order.setUser(user);

            Map<String, String> result = paymentIntentService.createPaymentIntent(order);

            assertNotNull(result);
            assertEquals("secret_123", result.get("client_secret"));
            mockedPaymentIntent.verify(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)));
        }
    }
}
