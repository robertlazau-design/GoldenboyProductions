// Where the sun is over Portland, worked out in the browser (no API, no
// network). Within about two minutes of published sunrise, sunset and golden
// hour times for Portland (Nov 2026 check), plenty for planning a shoot. Used
// by SunClock in effects.tsx.
//
// Golden hour here means the sun is between 6° above and 4° below the
// horizon, the window photographers usually plan around.

export const PORTLAND = { lat: 45.5152, lon: -122.6784, timeZone: 'America/Los_Angeles' };

const RAD = Math.PI / 180;
const MINUTE = 60_000;

/** Sun elevation in degrees (no refraction) at a moment and place. */
export function sunElevation(at: Date, lat = PORTLAND.lat, lon = PORTLAND.lon): number {
  const n = at.getTime() / 86_400_000 + 2440587.5 - 2451545.0; // days since J2000
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * RAD;
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const eps = (23.439 - 0.0000004 * n) * RAD;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
  const gmstHours = (18.697374558 + 24.06570982441908 * n) % 24;
  const hourAngle = (gmstHours * 15 + lon) * RAD - ra;
  const phi = lat * RAD;
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(hourAngle)) / RAD;
}

const dayKey = (at: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);

export type SunDay = {
  sunrise: Date;
  sunset: Date;
  morningGolden: [Date, Date];
  eveningGolden: [Date, Date];
};

/** Sunrise, sunset and both golden hours for the local day that contains `at`. */
export function sunDay(at: Date, place = PORTLAND): SunDay | null {
  const key = dayKey(at, place.timeZone);
  // Walk the minutes of that local day (the window covers any UTC offset).
  const start = Math.floor(at.getTime() / MINUTE) * MINUTE - 30 * 60 * MINUTE;
  let prev: { t: number; el: number } | null = null;
  const up: Record<string, number> = {};
  const down: Record<string, number> = {};
  const marks = { golden: 6, rise: -0.833, blue: -4 } as const;
  for (let t = start; t <= start + 60 * 60 * MINUTE; t += MINUTE) {
    const d = new Date(t);
    if (dayKey(d, place.timeZone) !== key) { prev = null; continue; }
    const el = sunElevation(d, place.lat, place.lon);
    if (prev) {
      for (const [name, level] of Object.entries(marks)) {
        // the exact crossing between the two samples, rounded to the minute
        const cross = () => Math.round((prev!.t + ((level - prev!.el) / (el - prev!.el)) * (t - prev!.t)) / MINUTE) * MINUTE;
        if (prev.el < level && el >= level && up[name] === undefined) up[name] = cross();
        if (prev.el >= level && el < level && down[name] === undefined) down[name] = cross();
      }
    }
    prev = { t, el };
  }
  if ([up.rise, down.rise, up.golden, down.golden, up.blue, down.blue].some(v => v === undefined)) return null;
  return {
    sunrise: new Date(up.rise),
    sunset: new Date(down.rise),
    morningGolden: [new Date(up.blue), new Date(up.golden)],
    eveningGolden: [new Date(down.golden), new Date(down.blue)],
  };
}

export const formatTime = (at: Date, timeZone = PORTLAND.timeZone) =>
  new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(at);
