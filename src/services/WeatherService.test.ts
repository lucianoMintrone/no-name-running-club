import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WeatherService } from "./WeatherService";

describe("WeatherService", () => {
  const originalEnv = process.env;
  const mockFetch = vi.fn();

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
    
    // Mock global fetch
    global.fetch = mockFetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetAllMocks();
  });

  describe("getWeatherByZipCode", () => {
    it("should return null when API key is not configured", async () => {
      delete process.env.OPENWEATHER_API_KEY;

      const result = await WeatherService.getWeatherByZipCode("10001");

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return weather data on successful API call", async () => {
      process.env.OPENWEATHER_API_KEY = "test-api-key";
      
      const mockWeatherResponse = {
        main: { temp: 32.5 },
        weather: [{ description: "clear sky", icon: "01d" }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const result = await WeatherService.getWeatherByZipCode("10001");

      expect(result).toEqual({
        temperature: 33, // Rounded from 32.5
        description: "clear sky",
        icon: "01d",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.openweathermap.org/data/2.5/weather?zip=10001,US&appid=test-api-key&units=imperial",
        { cache: "no-store" }
      );
    });

    it("should return null when API returns error status", async () => {
      process.env.OPENWEATHER_API_KEY = "test-api-key";
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => "City not found",
      });

      const result = await WeatherService.getWeatherByZipCode("00000");

      expect(result).toBeNull();
    });

    it("should return null when fetch throws an error", async () => {
      process.env.OPENWEATHER_API_KEY = "test-api-key";
      
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await WeatherService.getWeatherByZipCode("10001");

      expect(result).toBeNull();
    });

    it("should handle missing weather description gracefully", async () => {
      process.env.OPENWEATHER_API_KEY = "test-api-key";
      
      const mockWeatherResponse = {
        main: { temp: 25 },
        weather: [{}], // Missing description and icon
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const result = await WeatherService.getWeatherByZipCode("10001");

      expect(result).toEqual({
        temperature: 25,
        description: "",
        icon: "",
      });
    });

    it("should handle empty weather array gracefully", async () => {
      process.env.OPENWEATHER_API_KEY = "test-api-key";
      
      const mockWeatherResponse = {
        main: { temp: 25 },
        weather: [], // Empty array
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const result = await WeatherService.getWeatherByZipCode("10001");

      expect(result).toEqual({
        temperature: 25,
        description: "",
        icon: "",
      });
    });

    it("should round temperature to nearest integer", async () => {
      process.env.OPENWEATHER_API_KEY = "test-api-key";
      
      const mockWeatherResponse = {
        main: { temp: 32.4 },
        weather: [{ description: "cloudy", icon: "04d" }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const result = await WeatherService.getWeatherByZipCode("10001");

      expect(result?.temperature).toBe(32); // 32.4 rounds to 32
    });
  });
});
