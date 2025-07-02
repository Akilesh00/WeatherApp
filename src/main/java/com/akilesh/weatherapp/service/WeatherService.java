package com.akilesh.weatherapp.service;

import com.akilesh.weatherapp.model.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class WeatherService {

    @Value("${weather.api.key:demo_key}")
    private String apiKey;


    @Value("${weather.api.url:https://api.openweathermap.org/data/2.5/weather}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public WeatherService() {
        this.restTemplate = new RestTemplate();
    }

    @Cacheable(value = "weather", key = "#city")
    public WeatherResponse getWeatherByCity(String city) {
        try {
            String url = String.format("%s?q=%s&appid=%s&units=metric", apiUrl, city, apiKey);

            // For demo purposes, if using demo_key, return mock data
            if ("demo_key".equals(apiKey)) {
                return createMockWeatherData(city);
            }

            return restTemplate.getForObject(url, WeatherResponse.class);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("City not found: " + city, e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching weather data", e);
        }
    }

    @Cacheable(value = "weather", key = "'coords_' + #lat + '_' + #lon")
    public WeatherResponse getWeatherByCoordinates(double lat, double lon) {
        try {
            String url = String.format("%s?lat=%s&lon=%s&appid=%s&units=metric", apiUrl, lat, lon, apiKey);

            // For demo purposes, if using demo_key, return mock data
            if ("demo_key".equals(apiKey)) {
                return createMockWeatherDataForCoords(lat, lon);
            }

            return restTemplate.getForObject(url, WeatherResponse.class);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Invalid coordinates", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching weather data", e);
        }
    }

    private WeatherResponse createMockWeatherData(String city) {
        WeatherResponse response = new WeatherResponse();
        response.setCityName(city);

        WeatherResponse.Main main = new WeatherResponse.Main();
        main.setTemperature(22.5);
        main.setFeelsLike(24.0);
        main.setHumidity(65);
        main.setPressure(1013);
        response.setMain(main);

        WeatherResponse.Weather weather = new WeatherResponse.Weather();
        weather.setMain("Clear");
        weather.setDescription("clear sky");
        weather.setIcon("01d");
        response.setWeather(java.util.Arrays.asList(weather));

        WeatherResponse.Wind wind = new WeatherResponse.Wind();
        wind.setSpeed(3.5);
        wind.setDegree(180);
        response.setWind(wind);

        WeatherResponse.Sys sys = new WeatherResponse.Sys();
        sys.setCountry("Demo");
        response.setSys(sys);

        return response;
    }

    private WeatherResponse createMockWeatherDataForCoords(double lat, double lon) {
        WeatherResponse response = new WeatherResponse();
        response.setCityName("Location (" + lat + ", " + lon + ")");

        WeatherResponse.Main main = new WeatherResponse.Main();
        main.setTemperature(20.0);
        main.setFeelsLike(21.5);
        main.setHumidity(70);
        main.setPressure(1015);
        response.setMain(main);

        WeatherResponse.Weather weather = new WeatherResponse.Weather();
        weather.setMain("Clouds");
        weather.setDescription("scattered clouds");
        weather.setIcon("03d");
        response.setWeather(java.util.Arrays.asList(weather));

        WeatherResponse.Wind wind = new WeatherResponse.Wind();
        wind.setSpeed(2.8);
        wind.setDegree(220);
        response.setWind(wind);

        WeatherResponse.Sys sys = new WeatherResponse.Sys();
        sys.setCountry("Demo");
        response.setSys(sys);

        return response;
    }
}