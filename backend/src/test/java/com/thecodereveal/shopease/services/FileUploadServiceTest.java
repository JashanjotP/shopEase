package com.thecodereveal.shopease.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;
import java.io.IOException;
import java.io.InputStream;
import java.io.ByteArrayInputStream;

@ExtendWith(MockitoExtension.class)
class FileUploadServiceTest {

    @InjectMocks
    private FileUploadService fileUploadService;

    @Test
    void uploadFile_Exception() throws IOException {
        // Arrange
        ReflectionTestUtils.setField(fileUploadService, "storageZone", "test-zone");
        ReflectionTestUtils.setField(fileUploadService, "fileUploadKey", "test-key");
        ReflectionTestUtils.setField(fileUploadService, "fileHostName", "http://localhost");

        MultipartFile file = mock(MultipartFile.class);
        when(file.getSize()).thenReturn(100L);
        // We can't easily mock the connection failure to happen AFTER getSize but BEFORE getInputStream
        // But getSize is called before the try block that opens streams.
        
        // Act
        int result = fileUploadService.uploadFile(file, "test.jpg");

        // Assert
        assertEquals(500, result);
        verify(file).getSize();
    }

}
