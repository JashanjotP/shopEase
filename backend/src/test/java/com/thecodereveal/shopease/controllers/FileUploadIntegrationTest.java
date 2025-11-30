package com.thecodereveal.shopease.controllers;

import com.thecodereveal.shopease.BaseIntegrationTest;
import com.thecodereveal.shopease.services.FileUploadService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class FileUploadIntegrationTest extends BaseIntegrationTest {

    @MockBean
    private FileUploadService fileUploadService;

    @Test
    void fileUpload_ReturnsCreated_OnSuccess() throws Exception {
        given(fileUploadService.uploadFile(any(), eq("test.jpg"))).willReturn(201);

        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "fake-image-bytes".getBytes());

        mockMvc.perform(multipart("/api/file").file(file).param("fileName", "test.jpg"))
                .andExpect(status().isCreated());
    }

    @Test
    void fileUpload_ReturnsServerError_OnFailure() throws Exception {
        given(fileUploadService.uploadFile(any(), eq("bad.jpg"))).willReturn(500);

        MockMultipartFile file = new MockMultipartFile("file", "bad.jpg", MediaType.IMAGE_JPEG_VALUE, "data".getBytes());

        mockMvc.perform(multipart("/api/file").file(file).param("fileName", "bad.jpg"))
                .andExpect(status().isInternalServerError());
    }

}
