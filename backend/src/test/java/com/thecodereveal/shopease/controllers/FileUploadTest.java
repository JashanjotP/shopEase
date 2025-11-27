package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.services.FileUploadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; // Import needed
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FileUpload.class)
@AutoConfigureMockMvc(addFilters = false) // <--- THIS FIXES THE 403 ERROR
class FileUploadTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FileUploadService fileUploadService;

    @Test
    void fileUpload_ShouldReturnCreated_WhenServiceReturns201() throws Exception {
        // Arrange
        String fileName = "test-image.jpg";
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                fileName, 
                "image/jpeg", 
                "test image content".getBytes()
        );

        // Mock the service to return 201
        when(fileUploadService.uploadFile(any(), eq(fileName))).thenReturn(201);

        // Act & Assert
        mockMvc.perform(multipart("/api/file")
                        .file(file)
                        .param("fileName", fileName))
                .andExpect(status().isCreated());
    }

    @Test
    void fileUpload_ShouldReturnInternalServerError_WhenServiceReturnsError() throws Exception {
        // Arrange
        String fileName = "test-image.jpg";
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                fileName, 
                "image/jpeg", 
                "test image content".getBytes()
        );

        // Mock the service to return 500
        when(fileUploadService.uploadFile(any(), eq(fileName))).thenReturn(500);

        // Act & Assert
        mockMvc.perform(multipart("/api/file")
                        .file(file)
                        .param("fileName", fileName))
                .andExpect(status().isInternalServerError());
    }
}