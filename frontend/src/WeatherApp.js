import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Memoize time update to reduce re-renders
  const timeString = useMemo(() => ({
    date: currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }), [currentTime]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  const getWeatherIcon = useCallback((condition, size = 96) => {
  const conditionLower = condition?.toLowerCase();
  const iconProps = { size, className: "text-white drop-shadow-lg" };

  // if ([ 'clouds'].includes(conditionLower)) {
  //   return (
  //     <div className="w-[300px] h-[300px] mx-auto backgroundColor: 'transparent'">
  //       <iframe 
  //         src="https://my.spline.design/untitled-fhTI4YBjhoKvQcVN3DFvqNRb/?transparent=1&autoplay=1&controls=0"
  //         style={{ border: 'none',background: 'transparent' }}
  //         width="100%" 
  //         height="100%" 
  //         allow="autoplay; fullscreen"
  //         title="3D Weather Animation"
  //       ></iframe>
  //     </div>
  //   );
  // }

  switch (conditionLower) {
    case 'clouds':
         return <Cloud {...iconProps} />;
    case 'clear':
      return <Sun {...iconProps} className={iconProps.className + " animate-rotate"} />;
    case 'rain':
    case 'drizzle':
      return <CloudRain {...iconProps} className={iconProps.className + " animate-pulse"} />;
    case 'snow':
      return <CloudSnow {...iconProps} />;
    case 'thunderstorm':
      return <Zap {...iconProps} className={iconProps.className + " animate-pulse"} />;
    default:
      return <Sun {...iconProps} />;
  }
}, []);


  // Memoize background style to prevent recalculation
  const backgroundStyle = useMemo(() => {
    const condition = weather?.weather?.[0]?.main;
    const baseStyle = "min-h-screen transition-all duration-1000 ease-in-out";
    
    switch (condition?.toLowerCase()) {
      case 'clear':
        return `${baseStyle} bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-400`;

      case 'clouds':
        return `${baseStyle} bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600`;
      case 'rain':
      case 'drizzle':
        return `${baseStyle} bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800`;
      case 'snow':
        return `${baseStyle} bg-gradient-to-br from-white via-blue-100 to-blue-200`;
      case 'thunderstorm':
        return `${baseStyle} bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900`;
      default:
        return `${baseStyle} bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500`;
    }
  }, [weather?.weather?.[0]?.main]);

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
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    fetchWeather(city);
  }, [city]);

  // Get user location and fetch weather
  const getCurrentLocationWeather = useCallback(() => {
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
  }, []);

  // Load default city on mount
//   useEffect(() => {
//     fetchWeather('London');
//   }, []);

  const weatherCondition = weather?.weather?.[0]?.main;

  return (
    <div className={backgroundStyle} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Google Fonts Import */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      {/* Optimized background elements with hardware acceleration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl animate-float blur-sm transform-gpu"></div>
        <div className="absolute top-60 right-20 w-28 h-28 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl animate-float-delayed blur-sm transform-gpu"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-gradient-to-br from-white/10 to-white/5 rounded-full animate-float-slow blur-sm transform-gpu"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-white/25 to-white/10 rounded-xl animate-float blur-sm transform-gpu"></div>
        
        {/* Simplified grid pattern */}
        <div className="absolute inset-0 opacity-5 transform-gpu">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header - Separated from time to reduce re-renders */}
        <div className="text-center mb-12 relative">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Weather
              </span>
              <span className="block text-4xl md:text-5xl font-light text-white/90 mt-2">
                Dashboard
              </span>
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
          </div>
          
          {/* Time display in separate component to isolate re-renders */}
          <TimeDisplay timeString={timeString} />
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
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-md text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 transform-gpu"
              />
              <Search className="absolute right-3 top-3 text-white text-opacity-70" size={20} />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-md rounded-lg text-white font-semibold hover:bg-opacity-30 transition-all duration-300 disabled:opacity-50 border border-white border-opacity-30 transform-gpu"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Search'}
            </button>
          </div>
          
          <button
            onClick={getCurrentLocationWeather}
            disabled={loading}
            className="w-full mt-3 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-md rounded-lg text-white text-sm hover:bg-opacity-20 transition-all duration-300 disabled:opacity-50 border border-white border-opacity-20 flex items-center justify-center gap-2 transform-gpu"
          >
            <MapPin size={16} />
            Use Current Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-500 bg-opacity-20 backdrop-blur-md rounded-lg border border-red-400 border-opacity-30 animate-shake transform-gpu">
            <div className="flex items-center gap-2 text-white">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <WeatherDisplay weather={weather} getWeatherIcon={getWeatherIcon} />
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-white text-opacity-60">
          <p>Powered by OpenWeatherMap API</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) translateZ(0); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg) translateZ(0); 
          }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) translateZ(0); 
          }
          50% { 
            transform: translateY(-15px) rotate(-180deg) translateZ(0); 
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) translateZ(0); 
          }
          50% { 
            transform: translateY(-10px) translateZ(0); 
          }
        }
        
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(-20px) translateZ(0); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) translateZ(0); 
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px) translateZ(0); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) translateZ(0); 
          }
        }
        
        @keyframes shake {
          0%, 100% { 
            transform: translateX(0) translateZ(0); 
          }
          25% { 
            transform: translateX(-5px) translateZ(0); 
          }
          75% { 
            transform: translateX(5px) translateZ(0); 
          }
        }
        
        .animate-float { 
          animation: float 6s ease-in-out infinite;
          will-change: transform;
        }
        .animate-float-delayed { 
          animation: float-delayed 8s ease-in-out infinite;
          will-change: transform;
        }
        .animate-float-slow { 
          animation: float-slow 10s ease-in-out infinite;
          will-change: transform;
        }
        .animate-fade-in { 
          animation: fade-in 1s ease-out;
          will-change: opacity, transform;
        }
        .animate-slide-up { 
          animation: slide-up 0.6s ease-out both;
          will-change: opacity, transform;
        }
        .animate-shake { 
          animation: shake 0.5s ease-in-out;
          will-change: transform;
        }
        
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

// Separate component for time to reduce re-renders
const TimeDisplay = React.memo(({ timeString }) => (
  <div className="mt-8 space-y-2">
    <p className="text-xl font-medium text-white/90 drop-shadow tracking-wide">
      {timeString.date}
    </p>
    <p className="text-xl text-white drop-shadow tabular-nums">
      {timeString.time}
    </p>
  </div>
));

// Separate component for weather display
const WeatherDisplay = React.memo(({ weather, getWeatherIcon }) => (
  <div className="max-w-4xl mx-auto">
    {/* Main Weather Card */}
    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-8 mb-6 border border-white border-opacity-30 shadow-2xl animate-slide-up transform-gpu">
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
          <div>
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
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up transform-gpu" style={{animationDelay: '0.1s'}}>
        <Wind className="mx-auto mb-3 text-white text-opacity-80" size={32} />
        <div className="text-2xl font-bold text-white mb-1">
          {weather.wind?.speed} m/s
        </div>
        <div className="text-white text-opacity-80 text-sm">Wind Speed</div>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up transform-gpu" style={{animationDelay: '0.2s'}}>
        <Droplets className="mx-auto mb-3 text-white text-opacity-80" size={32} />
        <div className="text-2xl font-bold text-white mb-1">
          {weather.main?.humidity}%
        </div>
        <div className="text-white text-opacity-80 text-sm">Humidity</div>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up transform-gpu" style={{animationDelay: '0.3s'}}>
        <Eye className="mx-auto mb-3 text-white text-opacity-80" size={32} />
        <div className="text-2xl font-bold text-white mb-1">
          {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : `${weather.main?.pressure} hPa`}
        </div>
        <div className="text-white text-opacity-80 text-sm">
          {weather.visibility ? 'Visibility' : 'Pressure'}
        </div>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-30 text-center animate-slide-up transform-gpu" style={{animationDelay: '0.4s'}}>
        <Thermometer className="mx-auto mb-3 text-white text-opacity-80" size={32} />
        <div className="text-2xl font-bold text-white mb-1">
          {Math.round(weather.main?.feels_like)}°C
        </div>
        <div className="text-white text-opacity-80 text-sm">Feels Like</div>
      </div>
    </div>
  </div>
));

export default WeatherApp;