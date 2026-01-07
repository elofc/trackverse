// Manual Data Import (CSV/JSON)

import { ImportResult } from "./types";

// Manual Import Mapping
export type ManualImportMapping = {
  date: string;
  event?: string;
  time?: string;
  place?: string;
  meetName?: string;
  notes?: string;
};

// Parse CSV string to array of objects
export function parseCSV(csvString: string): Record<string, string>[] {
  const lines = csvString.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index].trim().replace(/^["']|["']$/g, "");
    });
    rows.push(row);
  }

  return rows;
}

// Parse a single CSV line (handles quoted values with commas)
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

// Detect column mapping from headers
export function detectColumnMapping(headers: string[]): ManualImportMapping {
  const mapping: ManualImportMapping = { date: "" };

  const datePatterns = ["date", "meet_date", "competition_date", "event_date"];
  const eventPatterns = ["event", "event_name", "discipline", "race"];
  const timePatterns = ["time", "result", "mark", "performance", "pr"];
  const placePatterns = ["place", "position", "rank", "finish"];
  const meetPatterns = ["meet", "meet_name", "competition", "race_name"];
  const notesPatterns = ["notes", "comments", "description"];

  for (const header of headers) {
    const h = header.toLowerCase();

    if (datePatterns.some((p) => h.includes(p))) {
      mapping.date = header;
    } else if (eventPatterns.some((p) => h.includes(p))) {
      mapping.event = header;
    } else if (timePatterns.some((p) => h.includes(p))) {
      mapping.time = header;
    } else if (placePatterns.some((p) => h.includes(p))) {
      mapping.place = header;
    } else if (meetPatterns.some((p) => h.includes(p))) {
      mapping.meetName = header;
    } else if (notesPatterns.some((p) => h.includes(p))) {
      mapping.notes = header;
    }
  }

  return mapping;
}

// Validate and parse date
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Try various date formats
  const formats = [
    // ISO format
    /^(\d{4})-(\d{2})-(\d{2})$/,
    // US format
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,
    // European format
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  // Try native Date parsing as fallback
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// Parse time/performance string to seconds
export function parsePerformance(timeStr: string): number | null {
  if (!timeStr) return null;

  const cleaned = timeStr.trim();

  // Format: MM:SS.ss or M:SS.ss
  const minSecMatch = cleaned.match(/^(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?$/);
  if (minSecMatch) {
    const minutes = parseInt(minSecMatch[1], 10);
    const seconds = parseInt(minSecMatch[2], 10);
    const hundredths = minSecMatch[3] ? parseInt(minSecMatch[3].padEnd(2, "0"), 10) : 0;
    return minutes * 60 + seconds + hundredths / 100;
  }

  // Format: HH:MM:SS or H:MM:SS
  const hourMinSecMatch = cleaned.match(/^(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d{1,2}))?$/);
  if (hourMinSecMatch) {
    const hours = parseInt(hourMinSecMatch[1], 10);
    const minutes = parseInt(hourMinSecMatch[2], 10);
    const seconds = parseInt(hourMinSecMatch[3], 10);
    const hundredths = hourMinSecMatch[4] ? parseInt(hourMinSecMatch[4].padEnd(2, "0"), 10) : 0;
    return hours * 3600 + minutes * 60 + seconds + hundredths / 100;
  }

  // Format: SS.ss (just seconds)
  const secMatch = cleaned.match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (secMatch) {
    const seconds = parseInt(secMatch[1], 10);
    const hundredths = secMatch[2] ? parseInt(secMatch[2].padEnd(2, "0"), 10) : 0;
    return seconds + hundredths / 100;
  }

  // Format: distance (e.g., "6.45m" for long jump)
  const distanceMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*m$/i);
  if (distanceMatch) {
    return parseFloat(distanceMatch[1]);
  }

  return null;
}

// Import meet results from CSV
export type MeetResult = {
  date: string;
  event: string;
  time: number;
  place?: number;
  meetName?: string;
  notes?: string;
};

export function importMeetResults(
  data: Record<string, string>[],
  mapping: ManualImportMapping
): { results: MeetResult[]; errors: ImportResult["errors"] } {
  const results: MeetResult[] = [];
  const errors: ImportResult["errors"] = [];

  data.forEach((row, index) => {
    const rowNum = index + 2; // Account for header row

    // Parse date
    const dateStr = row[mapping.date];
    const date = parseDate(dateStr);
    if (!date) {
      errors.push({ row: rowNum, message: `Invalid date: "${dateStr}"` });
      return;
    }

    // Parse time/performance
    const timeStr = mapping.time ? row[mapping.time] : "";
    const time = parsePerformance(timeStr);
    if (time === null) {
      errors.push({ row: rowNum, message: `Invalid time/performance: "${timeStr}"` });
      return;
    }

    // Parse optional fields
    const event = mapping.event ? row[mapping.event] : "Unknown";
    const placeStr = mapping.place ? row[mapping.place] : "";
    const place = placeStr ? parseInt(placeStr, 10) : undefined;
    const meetName = mapping.meetName ? row[mapping.meetName] : undefined;
    const notes = mapping.notes ? row[mapping.notes] : undefined;

    results.push({
      date: date.toISOString(),
      event,
      time,
      place: isNaN(place as number) ? undefined : place,
      meetName,
      notes,
    });
  });

  return { results, errors };
}

// Import workouts from JSON
export type ImportedWorkoutData = {
  date: string;
  name: string;
  type: string;
  duration?: number;
  distance?: number;
  notes?: string;
};

export function importWorkoutsFromJSON(jsonString: string): {
  workouts: ImportedWorkoutData[];
  errors: ImportResult["errors"];
} {
  const errors: ImportResult["errors"] = [];

  try {
    const data = JSON.parse(jsonString);
    const workouts: ImportedWorkoutData[] = [];

    const items = Array.isArray(data) ? data : [data];

    items.forEach((item, index) => {
      if (!item.date) {
        errors.push({ row: index + 1, message: "Missing required field: date" });
        return;
      }

      const date = parseDate(item.date);
      if (!date) {
        errors.push({ row: index + 1, message: `Invalid date: "${item.date}"` });
        return;
      }

      workouts.push({
        date: date.toISOString(),
        name: item.name || "Imported Workout",
        type: item.type || "other",
        duration: item.duration,
        distance: item.distance,
        notes: item.notes,
      });
    });

    return { workouts, errors };
  } catch (e) {
    return {
      workouts: [],
      errors: [{ row: 0, message: "Invalid JSON format" }],
    };
  }
}

// Generate sample CSV template
export function generateCSVTemplate(type: "results" | "workouts"): string {
  if (type === "results") {
    return `date,event,time,place,meet_name,notes
2026-01-15,100m,11.25,2,Winter Invitational,Wind: +1.2
2026-01-15,200m,23.45,1,Winter Invitational,Season best
2026-01-22,Long Jump,6.35m,3,Regional Championships,`;
  }

  return `date,name,type,duration,distance,notes
2026-01-10,Morning Run,easy_run,45,8.5,Recovery day
2026-01-11,Track Workout,interval,60,6.0,400m repeats x 8
2026-01-12,Tempo Run,tempo,35,7.0,Felt strong`;
}

// Validate import file
export function validateImportFile(
  file: File
): Promise<{ valid: boolean; error?: string; type?: "csv" | "json" }> {
  return new Promise((resolve) => {
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      resolve({ valid: false, error: "File too large (max 5MB)" });
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
      resolve({ valid: true, type: "csv" });
    } else if (extension === "json") {
      resolve({ valid: true, type: "json" });
    } else {
      resolve({ valid: false, error: "Unsupported file type. Use CSV or JSON." });
    }
  });
}
