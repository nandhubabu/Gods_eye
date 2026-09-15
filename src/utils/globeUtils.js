/**
 * God's Eye 3D Globe Utility
 * Generates coordinate graticules (equator, meridians, parallels)
 * and densified orbital paths for realistic 3D spherical rendering.
 */

// Generate globe graticule grid lines (parallels & meridians)
export function generateGlobeGraticules() {
    const lines = [];

    // Parallels (Latitude circles)
    for (let lat = -75; lat <= 75; lat += 15) {
        const path = [];
        for (let lon = -180; lon <= 180; lon += 5) {
            path.push([lon, lat, 0]);
        }
        lines.push({
            id: `parallel-${lat}`,
            path,
            isEquator: lat === 0,
            isTropic: Math.abs(lat) === 23.5,
        });
    }

    // Meridians (Longitude lines)
    for (let lon = -180; lon < 180; lon += 15) {
        const path = [];
        for (let lat = -85; lat <= 85; lat += 5) {
            path.push([lon, lat, 0]);
        }
        lines.push({
            id: `meridian-${lon}`,
            path,
            isMeridian: lon === 0 || lon === 180,
        });
    }

    return lines;
}

export const GLOBE_GRATICULES = generateGlobeGraticules();

/**
 * Densify orbital path points so lines curve smoothly on the 3D globe
 */
export function densifyOrbitPath(path, maxDegStep = 3) {
    if (!path || path.length < 2) return path;
    const densified = [];

    for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];
        densified.push(p1);

        // Check if segment crosses antimeridian
        let dLon = p2[0] - p1[0];
        if (Math.abs(dLon) > 180) {
            // crosses antimeridian, break segment to avoid straight cut
            continue;
        }

        const dLat = p2[1] - p1[1];
        const dist = Math.sqrt(dLon * dLon + dLat * dLat);
        const steps = Math.ceil(dist / maxDegStep);

        for (let s = 1; s < steps; s++) {
            const frac = s / steps;
            const lon = p1[0] + dLon * frac;
            const lat = p1[1] + dLat * frac;
            const alt = (p1[2] || 0) + ((p2[2] || 0) - (p1[2] || 0)) * frac;
            densified.push([lon, lat, alt]);
        }
    }

    if (path.length > 0) {
        densified.push(path[path.length - 1]);
    }
    return densified;
}
