package com.akilesh.weatherapp.service;

import com.akilesh.weatherapp.model.WeatherResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "weather.api.key=demo_key",
        "spring.redis.host=localhost",
        "spring.redis.port=6379"
})
class WeatherServiceTest {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    void testGetWeatherByCity() {
        String city = "London";
        WeatherResponse response = weatherService.getWeatherByCity(city);

        assertNotNull(response);
        assertEquals(city, response.getCityName());
        assertNotNull(response.getMain());
        assertNotNull(response.getWeather());
        assertFalse(response.getWeather().isEmpty());
    }

    @Test
    void testGetWeatherByCoordinates() {
        double lat = 51.5074;
        double lon = -0.1278;

        WeatherResponse response = weatherService.getWeatherByCoordinates(lat, lon);

        assertNotNull(response);
        assertNotNull(response.getCityName());
        assertNotNull(response.getMain());
        assertNotNull(response.getWeather());
        assertFalse(response.getWeather().isEmpty());
    }

    @Test
    void testCaching() {
        String city = "Paris";

        // Clear cache
        cacheManager.getCache("weather").clear();

        // First call
        long startTime = System.currentTimeMillis();
        WeatherResponse firstResponse = weatherService.getWeatherByCity(city);
        long firstCallTime = System.currentTimeMillis() - startTime;

        // Second call (should be from cache)
        startTime = System.currentTimeMillis();
        WeatherResponse secondResponse = weatherService.getWeatherByCity(city);
        long secondCallTime = System.currentTimeMillis() - startTime;

        assertNotNull(firstResponse);
        assertNotNull(secondResponse);
        assertEquals(firstResponse.getCityName(), secondResponse.getCityName());

        // Second call should be faster (from cache)
        assertTrue(secondCallTime < firstCallTime);
    }
}