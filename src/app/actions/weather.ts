"use server";

import { auth } from "@/lib/auth";
import { UserService } from "@/services/UserService";
import { WeatherService } from "@/services/WeatherService";

export async function getCurrentTemperature(): Promise<number | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await UserService.findById(session.user.id);
  if (!user?.zipCode) {
    return null;
  }

  const weather = await WeatherService.getWeatherByZipCode(user.zipCode);
  return weather?.temperature ?? null;
}
