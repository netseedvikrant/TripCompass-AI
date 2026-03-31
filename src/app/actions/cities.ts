"use server";

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

let cachedCities: string[] | null = null;

export async function searchCities(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  if (!cachedCities) {
    const worldCitiesPath = path.join(process.cwd(), "worldcities.csv");
    const indianCitiesPath = path.join(process.cwd(), "Indian_Cities.csv");

    const citiesSet = new Set<string>();

    // Load World Cities
    if (fs.existsSync(worldCitiesPath)) {
      const worldContent = fs.readFileSync(worldCitiesPath, "utf-8");
      const worldRecords = parse(worldContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      worldRecords.forEach((r: any) => {
        const cityName = (r.city_ascii || r.city || "").trim();
        const country = (r.country || "").trim();
        const admin = (r.admin_name || "").trim();
        if (cityName && country) {
          const entry = admin ? `${cityName}, ${admin}, ${country}` : `${cityName}, ${country}`;
          citiesSet.add(entry);
        }
      });
    }

    // Load Indian Cities
    if (fs.existsSync(indianCitiesPath)) {
      const indianContent = fs.readFileSync(indianCitiesPath, "utf-8");
      const indianRecords = parse(indianContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      indianRecords.forEach((r: any) => {
        const cityName = (r.City || "").trim();
        const country = (r.country || "India").trim();
        const state = (r.State || "").trim();
        if (cityName) {
          const entry = state ? `${cityName}, ${state}, ${country}` : `${cityName}, ${country}`;
          citiesSet.add(entry);
        }
      });
    }

    cachedCities = Array.from(citiesSet);
  }

  const lowercaseQuery = query.toLowerCase();
  return cachedCities
    .filter(city => city.toLowerCase().includes(lowercaseQuery))
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aStarts = aLower.startsWith(lowercaseQuery);
      const bStarts = bLower.startsWith(lowercaseQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.length - b.length;
    })
    .slice(0, 8);
}
