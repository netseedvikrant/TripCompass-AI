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

    // Use a map to deduplicate by (City + Country)
    // Key: cityName|country, Value: full entry string
    const citiesMap = new Map<string, string>();

    function addCity(name: string, admin: string, country: string) {
      const cityName = name.trim();
      const countryName = country.trim();
      const adminName = admin.trim();
      
      if (!cityName || !countryName) return;

      const key = `${cityName.toLowerCase()}|${countryName.toLowerCase()}`;
      const entry = adminName ? `${cityName}, ${adminName}, ${countryName}` : `${cityName}, ${countryName}`;

      // If we already have this city/country, prefer the one with admin info
      const existing = citiesMap.get(key);
      if (!existing || (!existing.includes(",") && adminName)) {
        // Simple heuristic: if existing is just "Delhi, India" and new is "Delhi, Delhi, India", replace
        // Or if we have nothing, add it.
        // Actually, more robust: if existing has 1 comma and new has 2, replace.
        const existingCommas = (existing?.match(/,/g) || []).length;
        const newCommas = (entry.match(/,/g) || []).length;
        if (!existing || newCommas > existingCommas) {
          citiesMap.set(key, entry);
        }
      }
    }

    // Load World Cities
    if (fs.existsSync(worldCitiesPath)) {
      const worldContent = fs.readFileSync(worldCitiesPath, "utf-8");
      const worldRecords = parse(worldContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      worldRecords.forEach((r: any) => {
        addCity(r.city_ascii || r.city, r.admin_name, r.country);
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
        addCity(r.City, r.State, r.country || "India");
      });
    }

    cachedCities = Array.from(citiesMap.values());
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
