import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  Eye, 
  Droplets, 
  Wind, 
  Thermometer,
  MapPin,
  Search,
  Loader,
  AlertCircle
} from 'lucide-react';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get weather icon based on condition
  const getWeatherIcon = (condition, size = 64) => {
    const iconProps = { size, className: "text-white drop-shadow-lg" };
    
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} className={iconProps.className + " animate-pulse"} />;
      case 'clouds':
        return <Cloud {...iconProps} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain {...iconProps} className={iconProps.className + " animate-bounce"} />;
      case 'snow':
        return <CloudSnow {...iconProps} />;
      case 'thunderstorm':
        return <Zap {...iconProps} className={iconProps.className + " animate-pulse"} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  // Get background gradient based on weather
  const getBackgroundStyle = (condition) => {
    const baseStyle = "min-h-screen transition-all duration-1000 ease-in-out";
    
    switch (condition?.toLowerCase()) {
      case 'clear':
        return `${baseStyle} bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600`;
      case 'clouds':
        return `${baseStyle} bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600`;
      case 'rain':
      case 'drizzle':
        return `${baseStyle} bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800`;
      case 'snow':
        return `${baseStyle} bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400`;
      case 'thunderstorm':
        return `${baseStyle} bg-gradient-to-br from-gray-800 via-gray-900 to-black`;
      default:
        return `${baseStyle} bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500`;
    }
  };

  // Fetch weather data
  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/weather/city/${encodeURIComponent(searchCity)}`);
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  // Get user location and fetch weather
  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`http://localhost:8080/api/weather/coordinates?lat=${latitude}&lon=${longitude}`);
          
          if (!response.ok) {
            throw new Error('Failed to get weather for current location');
          }
          
          const data = await response.json();
          setWeather(data);
          setError('');
        } catch (err) {
          setError(err.message || 'Failed to fetch weather data');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  // Load default city on mount
  useEffect(() => {
    fetchWeather('London');
  }, []);

  const weatherCondition = weather?.weather?.[0]?.main;

  return (
    <div className={getBackgroundStyle(weatherCondition)}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-white bg-opacity-5 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-float-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
            Weather App
          </h1>
          <p className="text-xl text-white text-opacity-90 drop-shadow">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-lg text-white text-opacity-80 drop-shadow">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Enter city name..."
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-md text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
              />
              <Search className="absolute right-3 top-3 text-white text-opacity-70" size={20} />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-md rounded-lg text-white font-semibold hover:bg-opacity-30 transition-all duration-300 disabled:opacity-50 border border-white border-opacity-30"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Search'}
            </button>
          </div>
          
          <button
            onClick={getCurrentLocationWeather}
            disabled={loading}
            className="w-full mt-3 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-md rounded-lg text-white text-sm hover:bg-opacity-20 transition-all duration-300 disabled:opacity-50 border border-white border-opacity-20 flex items-center justify-center gap-2"
          >
            <MapPin size={16} />
            Use Current Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-500 bg-opacity-20 backdrop-blur-md rounded-lg border border-red-400 border-opacity-30 animate-shake">
            <div className="flex items-center gap-2 text-white">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <div className="max-w-4xl mx-auto">
            {/* Main Weather Card */}
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-8 mb-6 border border-white border-opacity-30 shadow-2xl animate-slide-up">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <MapPin className="text-white text-opacity-80" size={24} />
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {weather.name}
                    {weather.sys?.country && (
                      <span className="text-xl text-white text-opacity-80 ml-2">
                        , {weather.sys.country}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="animate-float">
                    {getWeatherIcon(weather.weather?.[0]?.main, 96)}
                  </div>
                  <div className="text-left">
                    <div className="text-6xl md:text-7xl font-bold text-white mb-2">
                      {Math.round(weather.main?.temp)}°C
                    </div>
                    <div className="text-xl text-white text-opacity-90 capitalize">
                      {weather.weather?.[0]?.description}
                    </div>
                    <div className="text-lg text-white text-opacity-80">
                      Feels like {Math.round(weather.main?.feels_like)}°C
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up" style={{animationDelay: '0.1s'}}>
                <Wind className="mx-auto mb-3 text-white text-opacity-80" size={32} />
                <div className="text-2xl font-bold text-white mb-1">
                  {weather.wind?.speed} m/s
                </div>
                <div className="text-white text-opacity-80 text-sm">Wind Speed</div>
              </div>

              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Droplets className="mx-auto mb-3 text-white text-opacity-80" size={32} />
                <div className="text-2xl font-bold text-white mb-1">
                  {weather.main?.humidity}%
                </div>
                <div className="text-white text-opacity-80 text-sm">Humidity</div>
              </div>

              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up" style={{animationDelay: '0.3s'}}>
                <Eye className="mx-auto mb-3 text-white text-opacity-80" size={32} />
                <div className="text-2xl font-bold text-white mb-1">
                  {weather.main?.pressure} hPa
                </div>
                <div className="text-white text-opacity-80 text-sm">Pressure</div>
              </div>

              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                <Thermometer className="mx-auto mb-3 text-white text-opacity-80" size={32} />
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round(weather.main?.feels_like)}°C
                </div>
                <div className="text-white text-opacity-80 text-sm">Feels Like</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-white text-opacity-60">
          <p>Powered by OpenWeatherMap API</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out both; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default WeatherApp;