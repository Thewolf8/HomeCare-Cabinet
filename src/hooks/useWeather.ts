import { useCallback, useState } from 'react';
import type { WeatherData, AppSettings } from '@/types';

interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
}

export function useWeather() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeCity = useCallback(async (cityName: string): Promise<GeocodeResult | null> => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      if (!response.ok) throw new Error('Geocoding failed');
      const data = await response.json();
      if (!data.results || data.results.length === 0) return null;
      const result = data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
      };
    } catch {
      return null;
    }
  }, []);

  const fetchWeather = useCallback(async (settings: AppSettings): Promise<WeatherData | null> => {
    setLoading(true);
    setError(null);

    try {
      let lat: number;
      let lon: number;

      if (settings.cityCoordinates) {
        lat = settings.cityCoordinates.lat;
        lon = settings.cityCoordinates.lon;
      } else if (settings.city) {
        const geo = await geocodeCity(settings.city);
        if (!geo) {
          setError('City not found');
          setLoading(false);
          return null;
        }
        lat = geo.latitude;
        lon = geo.longitude;
      } else {
        setError('No city configured');
        setLoading(false);
        return null;
      }

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
      );
      if (!response.ok) throw new Error('Weather fetch failed');
      const data = await response.json();

      const weatherCode = data.current.weather_code;
      const condition = getWeatherCondition(weatherCode);

      const result: WeatherData = {
        temperature: Math.round(data.current.temperature_2m),
        condition,
        humidity: data.current.relative_humidity_2m,
        lastFetched: new Date().toISOString(),
      };

      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      setLoading(false);
      return null;
    }
  }, [geocodeCity]);

  return { fetchWeather, geocodeCity, loading, error };
}

function getWeatherCondition(code: number): WeatherData['condition'] {
  // WMO Weather interpretation codes
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2 || code === 3) return 'cloudy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95) return 'rainy';
  if (code >= 40 && code <= 49) return 'cloudy';
  return 'sunny';
}

export function getTemperatureAdvice(t: number): string {
  if (t > 28) return 'hotWeather';
  if (t >= 20) return 'warmWeather';
  if (t >= 10) return 'coolWeather';
  return 'coldWeather';
}

export function getWeatherIcon(condition: WeatherData['condition']): string {
  switch (condition) {
    case 'sunny': return 'sun';
    case 'cloudy': return 'cloud';
    case 'rainy': return 'cloud-rain';
    case 'snowy': return 'snowflake';
    case 'windy': return 'wind';
    default: return 'sun';
  }
}
