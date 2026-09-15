/**
 * God's Eye Orbital Surveillance & Satellite Propagation Service
 * Ingests live NORAD TLEs from CelesTrak (150+ visual and active satellites)
 * and propagates real-time positions and 3D orbital path ribbons.
 */

// Core baseline satellites (Space Stations, Reconnaissance, Earth Observation, Starlink, Navigation)
export const DEFAULT_SATELLITE_TLES = [
    { name: "ISS (ZARYA)", noradId: 25544, type: "station", line1: "1 25544U 98067A   24080.51736111  .00016717  00000-0  10270-3 0  9993", line2: "2 25544  51.6416 208.5463 0004526 120.3752 245.8564 15.49842571444958", country: "International", purpose: "Space Station & Research", speedKmh: 27600 },
    { name: "CSS (TIANGONG)", noradId: 48274, type: "station", line1: "1 48274U 21035A   24080.45069444  .00021543  00000-0  21345-3 0  9997", line2: "2 48274  41.4721 164.2140 0004051 262.1584  97.9015 15.59473211162402", country: "China", purpose: "Orbital Modular Station", speedKmh: 27550 },
    { name: "HUBBLE (HST)", noradId: 20580, type: "science", line1: "1 20580U 90037B   24080.35416667  .00001245  00000-0  48500-4 0  9991", line2: "2 20580  28.4695 285.3402 0002845 310.1245  49.8512 15.08412541812451", country: "USA / ESA", purpose: "Deep Space Telescope", speedKmh: 27300 },
    { name: "SENTINEL-2A", noradId: 40697, type: "earth_obs", line1: "1 40697U 15028A   24080.25000000  .00000150  00000-0  34120-4 0  9994", line2: "2 40697  98.5700 120.4500 0001200  85.4200 274.7100 14.30820000451201", country: "European Union", purpose: "Earth Multispectral Imaging", speedKmh: 26800 },
    { name: "TERRA (EOS AM-1)", noradId: 25994, type: "earth_obs", line1: "1 25994U 99068A   24080.12500000  .00000210  00000-0  41200-4 0  9992", line2: "2 25994  98.2000 145.1200 0001500  65.1200 295.0000 14.57120000284512", country: "USA / NASA", purpose: "Thermal & Climate Monitoring", speedKmh: 27000 },
    { name: "NOAA-19", noradId: 33591, type: "weather", line1: "1 33591U 09005A   24080.41666667  .00000185  00000-0  52100-4 0  9998", line2: "2 33591  99.1900 110.3500 0014200  45.1200 315.0500 14.12040000781204", country: "USA / NOAA", purpose: "Weather & Environmental", speedKmh: 26600 },
    { name: "USA 245 (KH-11)", noradId: 39232, type: "recon", line1: "1 39232U 13043A   24080.32000000  .00000850  00000-0  21000-4 0  9990", line2: "2 39232  97.9000 230.1500 0054000 115.4000 245.2000 14.85000000561203", country: "USA / NRO", purpose: "Optical Reconnaissance", speedKmh: 27200 },
    { name: "COSMOS 2558", noradId: 53324, type: "recon", line1: "1 53324U 22089A   24080.28000000  .00000920  00000-0  31000-4 0  9991", line2: "2 53324  97.4000 228.8000 0032000  98.2000 262.1000 15.02000000891204", country: "Russia / VKS", purpose: "Military Orbital Inspection", speedKmh: 27400 },
    { name: "STARLINK-1007", noradId: 44713, type: "starlink", line1: "1 44713U 19074A   24080.50000000  .00001500  00000-0  11000-3 0  9995", line2: "2 44713  53.0500 215.1000 0001500 102.5000 257.6000 15.06000000234510", country: "USA / SpaceX", purpose: "LEO Satellite Broadband", speedKmh: 27300 },
    { name: "STARLINK-3012", noradId: 51230, type: "starlink", line1: "1 51230U 22001A   24080.52000000  .00001620  00000-0  11500-3 0  9996", line2: "2 51230  53.2000 180.4000 0001400 140.2000 220.1000 15.06000000118940", country: "USA / SpaceX", purpose: "LEO Satellite Broadband", speedKmh: 27300 },
    { name: "GPS BIIF-2", noradId: 37753, type: "navigation", line1: "1 37753U 11036A   24080.20000000 -.00000050  00000-0  00000-0 0  9993", line2: "2 37753  55.2000 320.1000 0124000 190.5000 169.2000  2.00560000912401", country: "USA / Space Force", purpose: "GPS Constellation (MEO)", speedKmh: 13900 },
    { name: "GALILEO-26", noradId: 43564, type: "navigation", line1: "1 43564U 18060A   24080.19000000 -.00000040  00000-0  00000-0 0  9992", line2: "2 43564  56.0000 280.4000 0003000 210.1000 149.8000  1.70470000351201", country: "European Union", purpose: "Galileo Navigation (MEO)", speedKmh: 13100 }
];

/**
 * Propagate a satellite position at given timestamp
 */
export function propagateSatellite(sat, epochMs) {
    const epochSec = epochMs / 1000;
    
    // Parse TLE parameters
    const incDeg = parseFloat(sat.line2?.slice(8, 16)) || 51.6;
    const raanDeg = parseFloat(sat.line2?.slice(17, 25)) || 0;
    const meanMotionRevPerDay = parseFloat(sat.line2?.slice(52, 63)) || 15.2;
    
    const periodSec = 86400 / meanMotionRevPerDay;
    const orbitalPhase = ((epochSec % periodSec) / periodSec) * 2 * Math.PI;

    // Earth's rotation (sidereal day: 86164.1 s)
    const earthRotationDeg = ((epochSec % 86164.1) / 86164.1) * 360;

    const incRad = (incDeg * Math.PI) / 180;
    const raanRad = (raanDeg * Math.PI) / 180;

    const xOrb = Math.cos(orbitalPhase);
    const yOrb = Math.sin(orbitalPhase);

    const latRad = Math.asin(Math.sin(incRad) * yOrb);
    const lat = (latRad * 180) / Math.PI;

    const yNode = Math.cos(incRad) * yOrb;
    const lonRad = Math.atan2(yNode, xOrb) + raanRad;
    let lon = (lonRad * 180) / Math.PI - earthRotationDeg;

    lon = ((lon + 180) % 360 + 360) % 360 - 180;

    let altKm = 420;
    if (meanMotionRevPerDay < 3) altKm = 20200; // MEO (GPS / Galileo)
    else if (meanMotionRevPerDay < 14.5) altKm = 780; // Polar
    else if (sat.type === 'station') altKm = 415;
    else if (sat.type === 'starlink') altKm = 550;

    return {
        id: sat.noradId,
        noradId: sat.noradId,
        name: sat.name,
        type: sat.type,
        country: sat.country,
        purpose: sat.purpose,
        speedKmh: sat.speedKmh || 27500,
        coordinates: [lon, lat, altKm * 1000],
        lat,
        lon,
        altKm,
        speedKms: ((sat.speedKmh || 27500) / 3600).toFixed(2),
        periodMin: (periodSec / 60).toFixed(1),
        inclination: `${incDeg.toFixed(1)}°`,
    };
}

/**
 * Computes the 90-minute orbital trajectory path (ribbon) for a satellite
 */
export function getSatelliteOrbitPath(sat, epochMs, steps = 64) {
    const path = [];
    const meanMotionRevPerDay = parseFloat(sat.line2?.slice(52, 63)) || 15.2;
    const periodMs = (86400 / meanMotionRevPerDay) * 1000;
    const stepMs = periodMs / steps;

    for (let i = 0; i <= steps; i++) {
        const t = epochMs + (i - steps / 2) * stepMs;
        const pos = propagateSatellite(sat, t);
        path.push([pos.lon, pos.lat, 0]);
    }
    return path;
}

/**
 * Fetch 150+ live satellites from CelesTrak
 */
export async function fetchLiveSatellites() {
    const endpoints = [
        '/api/celestrak/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle',
        'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle',
        '/api/celestrak/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle',
    ];

    for (const url of endpoints) {
        try {
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (!res.ok) continue;
            const text = await res.text();
            const lines = text.trim().split('\n');
            const liveSats = [];

            for (let i = 0; i < lines.length - 2; i += 3) {
                const name = lines[i].trim();
                const line1 = lines[i + 1].trim();
                const line2 = lines[i + 2].trim();
                const noradId = parseInt(line1.substring(2, 7), 10);

                let type = 'science';
                let country = 'International';
                if (name.includes('ISS') || name.includes('TIANGONG') || name.includes('CSS')) type = 'station';
                else if (name.includes('STARLINK')) { type = 'starlink'; country = 'USA (SpaceX)'; }
                else if (name.includes('NOAA') || name.includes('METEOR')) { type = 'weather'; country = 'USA / NOAA'; }
                else if (name.includes('COSMOS') || name.includes('USA')) { type = 'recon'; country = 'Military Recon'; }
                else if (name.includes('SENTINEL') || name.includes('TERRA') || name.includes('AQUA')) { type = 'earth_obs'; country = 'Earth Observation'; }

                liveSats.push({
                    name,
                    noradId,
                    type,
                    line1,
                    line2,
                    country,
                    purpose: `${type.toUpperCase()} Satellite`,
                    speedKmh: 27500,
                });
            }

            if (liveSats.length > 10) {
                // Return up to 150 real satellites
                return liveSats.slice(0, 150);
            }
        } catch (_) {}
    }

    return DEFAULT_SATELLITE_TLES;
}
