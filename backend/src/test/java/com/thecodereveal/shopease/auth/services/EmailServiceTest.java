package com.thecodereveal.shopease.auth.services;

import com.thecodereveal.shopease.auth.entities.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void sendMail_Success() {
        ReflectionTestUtils.setField(emailService, "sender", "test@shopease.com");
        User user = new User();
        user.setEmail("user@example.com");
        user.setVerificationCode("123456");

        doNothing().when(javaMailSender).send(any(SimpleMailMessage.class));

        String result = emailService.sendMail(user);

        assertEquals("Email sent", result);
    }

    @Test
    void sendMail_Failure() {
        ReflectionTestUtils.setField(emailService, "sender", "test@shopease.com");
        User user = new User();
        user.setEmail("user@example.com");

        doThrow(new RuntimeException("Mail error")).when(javaMailSender).send(any(SimpleMailMessage.class));

        String result = emailService.sendMail(user);

        assertEquals("Error while Sending Mail", result);
    }
}
