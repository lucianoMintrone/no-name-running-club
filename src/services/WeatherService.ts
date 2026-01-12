/**
 * Weather service using OpenWeatherMap API
 * Docs: https://openweathermap.org/current
 */

export interface WeatherData {
  temperature: number; // in Fahrenheit
  description: string;
  icon: string;
}

export class WeatherService {
  private static readonly API_BASE = "https://api.openweathermap.org/data/2.5/weather";

  /**
   * Get current weather by zip code (US)
   */
  static async getWeatherByZipCode(zipCode: string): Promise<WeatherData | null> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.warn("OPENWEATHER_API_KEY not configured");
      return null;
    }

    try {
      const url = `${this.API_BASE}?zip=${zipCode},US&appid=${apiKey}&units=imperial`;
      const response = await fetch(url, { 
        cache: "no-store" // Don't cache during development to make debugging easier
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Weather API error:", response.status, response.statusText, errorText);
        return null;
      }

      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0]?.description || "",
        icon: data.weather[0]?.icon || "",
      };
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      return null;
    }
  }
}
