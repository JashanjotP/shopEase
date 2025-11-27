package com.thecodereveal.shopease.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockedConstruction;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileUploadServiceTest {

    @InjectMocks
    private FileUploadService fileUploadService;

    @Test
    void uploadFile_Success() throws IOException {
        // 1. Arrange: Setup Service Properties
        String zone = "test-zone";
        String key = "test-key";
        String host = "http://localhost";
        String fileName = "test.jpg";
        byte[] fileContent = "Hello World".getBytes();

        ReflectionTestUtils.setField(fileUploadService, "storageZone", zone);
        ReflectionTestUtils.setField(fileUploadService, "fileUploadKey", key);
        ReflectionTestUtils.setField(fileUploadService, "fileHostName", host);

        // 2. Arrange: Mock the Input File
        MultipartFile file = mock(MultipartFile.class);
        when(file.getSize()).thenReturn((long) fileContent.length);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream(fileContent));

        // 3. Arrange: Mock the Connection and Output Stream
        // We use ByteArrayOutputStream to capture what the service writes
        HttpURLConnection mockConnection = mock(HttpURLConnection.class);
        ByteArrayOutputStream captorOutputStream = new ByteArrayOutputStream();
        
        when(mockConnection.getOutputStream()).thenReturn(captorOutputStream);
        when(mockConnection.getResponseCode()).thenReturn(201); // Simulate Created/Success

        // 4. Act: Intercept "new URL(...)" construction
        // This requires 'mockito-inline' dependency to mock final classes/constructors
        try (MockedConstruction<URL> mockedUrl = mockConstruction(URL.class,
                (mock, context) -> {
                    // When the service calls url.openConnection(), return our mock connection
                    when(mock.openConnection()).thenReturn(mockConnection);
                })) {

            int result = fileUploadService.uploadFile(file, fileName);

            // 5. Assert: Verify Return Value (Kills Mutation 501, 531)
            assertEquals(201, result);

            // 6. Assert: Verify Connection Configuration (Kills Mutations 301, 311, 321, 331)
            verify(mockConnection).setRequestMethod("PUT");
            verify(mockConnection).setRequestProperty("AccessKey", key);
            verify(mockConnection).setRequestProperty("Content-Type", "application/octet-stream");
            verify(mockConnection).setDoOutput(true);

            // 7. Assert: Verify Data Write (Kills Mutations 431, 441)
            // The service wraps the stream in BufferedOutputStream. 
            // The try-with-resources in the service closes it, flushing data to our captor.
            assertArrayEquals(fileContent, captorOutputStream.toByteArray(), 
                "The file content written to the stream should match the input");
        }
    }

    @Test
    void uploadFile_Exception() throws IOException {
        // Arrange
        ReflectionTestUtils.setField(fileUploadService, "storageZone", "test-zone");
        ReflectionTestUtils.setField(fileUploadService, "fileUploadKey", "test-key");
        ReflectionTestUtils.setField(fileUploadService, "fileHostName", "http://localhost");

        MultipartFile file = mock(MultipartFile.class);
        // Force an exception immediately when checking size (before streams open)
        when(file.getSize()).thenThrow(new RuntimeException("File error"));

        // Act
        int result = fileUploadService.uploadFile(file, "test.jpg");

        // Assert (Kills Mutation 531)
        assertEquals(500, result);
    }
}