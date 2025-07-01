# Weather App with Redis Caching

A Spring Boot application that provides weather information with Redis caching to improve performance and reduce API calls.

## Features

- **REST API** for weather data retrieval
- **Redis Caching** with 15-minute TTL
- **Multiple endpoints** for city name and coordinates
- **Mock data support** for testing without API key
- **Health check endpoint**
- **Comprehensive error handling**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Redis server (local or remote)
- OpenWeatherMap API key (optional for demo)

## Setup Instructions

### 1. Install Redis

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**On Windows:**
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:alpine
```

### 2. Get OpenWeatherMap API Key (Optional)

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Update `application.properties` with your key

### 3. Configure Application

Update `src/main/resources/application.properties`:

```properties
# Replace with your API key (or keep demo_key for testing)
weather.api.key=YOUR_OPENWEATHER_API_KEY

# Redis configuration (adjust if needed)
spring.redis.host=localhost
spring.redis.port=6379
```

### 4. Build and Run

```bash
# Clone or create the project structure
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Get Weather by City Name
```http
GET /api/weather/city/{cityName}
```

**Example:**
```bash
curl http://localhost:8080/api/weather/city/London
```

### Get Weather by Coordinates
```http
GET /api/weather/coordinates?lat={latitude}&lon={longitude}
```

**Example:**
```bash
curl "http://localhost:8080/api/weather/coordinates?lat=51.5074&lon=-0.1278"
```

### Health Check
```http
GET /api/weather/health
```

## Sample Response

```json
{
  "cityName": "London",
  "main": {
    "temperature": 15.5,
    "feelsLike": 14.8,
    "humidity": 72,
    "pressure": 1013
  },
  "weather": [
    {
      "main": "Clouds",
      "description": "scattered clouds",
      "icon": "03d"
    }
  ],
  "wind": {
    "speed": 3.2,
    "degree": 180
  },
  "sys": {
    "country": "GB"
  }
}
```

## Caching Behavior

- **Cache Duration:** 15 minutes TTL
- **Cache Key Strategy:** 
  - City requests: `city_name`
  - Coordinate requests: `coords_lat_lon`
- **Cache Storage:** Redis with JSON serialization
- **Cache Eviction:** Automatic after TTL expires

## Testing

Run the test suite:

```bash
mvn test
```

The tests include:
- Unit tests for weather service
- Caching behavior verification
- Mock data testing
- Integration tests

## Project Structure

```
src/
├── main/
│   ├── java/com/example/weatherapp/
│   │   ├── WeatherApplication.java          # Main application class
│   │   ├── config/
│   │   │   └── RedisConfig.java            # Redis configuration
│   │   ├── controller/
│   │   │   └── WeatherController.java      # REST endpoints
│   │   ├── model/
│   │   │   └── WeatherResponse.java        # Data models
│   │   └── service/
│   │       └── WeatherService.java         # Business logic
│   └── resources/
│       └── application.properties          # Configuration
└── test/
    └── java/com/example/weatherapp/
        └── service/
            └── WeatherServiceTest.java     # Unit tests
```

## Configuration Options

### Redis Settings
```properties
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.timeout=2000ms
spring.redis.lettuce.pool.max-active=8
```

### API Settings
```properties
weather.api.key=YOUR_API_KEY
weather.api.url=https://api.openweathermap.org/data/2.5/weather
```

### Logging
```properties
logging.level.com.example.weatherapp=DEBUG
logging.level.org.springframework.cache=DEBUG
```

## Monitoring

Access Spring Boot Actuator endpoints:
- Health: `http://localhost:8080/actuator/health`
- Cache metrics: `http://localhost:8080/actuator/cache`

## Error Handling

The application handles various error scenarios:
- **Invalid city names:** Returns 404 with error message
- **Invalid coordinates:** Returns 400 with error message
- **API failures:** Returns 500 with generic error message
- **Redis connectivity issues:** Falls back to direct API calls

## Demo Mode

When using `demo_key` as the API key, the application returns mock data for testing purposes without requiring a real OpenWeatherMap API key.

## Production Considerations

1. **Security:** Use environment variables for API keys
2. **Monitoring:** Enable actuator endpoints with security
3. **Redis:** Configure Redis clustering for high availability
4. **Rate Limiting:** Implement rate limiting to prevent abuse
5. **Logging:** Configure appropriate log levels for production