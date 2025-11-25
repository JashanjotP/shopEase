package com.thecodereveal.shopease.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class FileUploadServiceTest {

    @InjectMocks
    private FileUploadService fileUploadService;

    @Test
    void uploadFile_Exception() {
        // Arrange
        ReflectionTestUtils.setField(fileUploadService, "storageZone", "test-zone");
        ReflectionTestUtils.setField(fileUploadService, "fileUploadKey", "test-key");
        ReflectionTestUtils.setField(fileUploadService, "fileHostName", "http://localhost");

        MultipartFile file = mock(MultipartFile.class);
        // This will likely fail at new URL() or openConnection() or getInputStream()
        // causing an exception which is caught and returns 500.
        
        // Act
        int result = fileUploadService.uploadFile(file, "test.jpg");

        // Assert
        // It might return 500 or something else depending on where it fails.
        // If new URL fails, it returns 500.
        // If connection fails, it returns 500.
        assertEquals(500, result);
    }
}
