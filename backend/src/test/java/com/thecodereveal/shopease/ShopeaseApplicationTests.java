package com.thecodereveal.shopease;

import com.stripe.Stripe;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ShopeaseApplicationTests {

	@Autowired
	private ShopeaseApplication shopeaseApplication;

	@Test
	void contextLoads() {
		assertNotNull(shopeaseApplication);
	}

	@Test
	void testInit() {
		ShopeaseApplication app = new ShopeaseApplication();
		String secret = "sk_test_example";
		ReflectionTestUtils.setField(app, "stripeSecret", secret);
		
		app.init();
		
		assertEquals(secret, Stripe.apiKey);
	}

	@Test
	void testCorsFilter() {
		ShopeaseApplication app = new ShopeaseApplication();
		CorsFilter filter = app.corsFilter();
		
		assertNotNull(filter);
		
		// Access the configSource field from CorsFilter
		UrlBasedCorsConfigurationSource source = (UrlBasedCorsConfigurationSource) 
				ReflectionTestUtils.getField(filter, "configSource");
		assertNotNull(source);
		
		// Verify configuration is registered for "/**"
		MockHttpServletRequest request = new MockHttpServletRequest("GET", "/any/path");
		CorsConfiguration config = source.getCorsConfiguration(request);
		assertNotNull(config, "CorsConfiguration should be registered for /**");
		
		// Verify AllowedOriginPatterns
		assertNotNull(config.getAllowedOriginPatterns());
		assertTrue(config.getAllowedOriginPatterns().contains("*"));
		
		// Verify AllowedHeaders
		List<String> expectedHeaders = Arrays.asList(
				"Origin", "Content-Type", "Accept", "responseType", 
				"Authorization", "x-authorization", "content-range", "range"
		);
		assertTrue(config.getAllowedHeaders().containsAll(expectedHeaders));
		
		// Verify AllowedMethods
		List<String> expectedMethods = Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH");
		assertTrue(config.getAllowedMethods().containsAll(expectedMethods));
		
		// Verify ExposedHeaders
		List<String> expectedExposedHeaders = Arrays.asList(
				"X-Total-Count", "content-range", "Content-Type", 
				"Accept", "X-Requested-With", "remember-me"
		);
		assertTrue(config.getExposedHeaders().containsAll(expectedExposedHeaders));
	}

}
