import React, { useState, useEffect, useCallback } from 'react';
import MapView from './components/MapView';
import TacticalHUD from './components/TacticalHUD';
import { ACTIVE_CONFLICT_ZONES, GLOBAL_ACTIVE_CONFLICT_EVENTS } from './data/activeConflicts';
import { fetchLiveSatellites, propagateSatellite, getSatelliteOrbitPath } from './services/satelliteService';
import { fetchLiveFlights, interpolateFlightPosition } from './services/flightService';
import { ACTIVE_THERMAL_HOTSPOTS, LIVE_INTEL_DISPATCHES, fetchLiveEarthquakes } from './services/incidentService';
import { audio } from './services/audioService';

export default function App() {
    // 3D Globe vs Flat Map (defaults to 3D Globe)
    const [viewMode, setViewMode] = useState('globe');

    // Layer visibility switches
    const [activeLayers, setActiveLayers] = useState({
        satellites: true,
        flights: true,
        conflicts: true,
        thermal: true,
        seismic: true,
    });

    // Real-Time Domain Data States
    const [rawSatellites, setRawSatellites] = useState([]);
    const [liveSatellites, setLiveSatellites] = useState([]);
    const [satelliteOrbits, setSatelliteOrbits] = useState([]);

    const [rawFlights, setRawFlights] = useState([]);
    const [liveFlights, setLiveFlights] = useState([]);

    const [activeConflictEvents] = useState(GLOBAL_ACTIVE_CONFLICT_EVENTS);
    const [thermalHotspots] = useState(ACTIVE_THERMAL_HOTSPOTS);
    const [earthquakes, setEarthquakes] = useState([]);
    const [liveDispatches] = useState(LIVE_INTEL_DISPATCHES);

    // Selected & Tracked Entity
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [trackedEntity, setTrackedEntity] = useState(null);
    const [cameraCenter, setCameraCenter] = useState([20, 25]);
    const [cameraZoom, setCameraZoom] = useState(0.8);

    /* ── Layer Switch Toggle ── */
    const toggleLayer = useCallback((layerKey) => {
        audio.playBeep(1100, 0.05);
        setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
    }, []);

    /* ── 1. Ingest Real-Time Feeds on Mount ── */
    useEffect(() => {
        // Satellites
        fetchLiveSatellites().then((sats) => {
            setRawSatellites(sats);
            const now = Date.now();
            const propagated = sats.map((s) => propagateSatellite(s, now));
            setLiveSatellites(propagated);

            // Generate orbital path ribbons for key stations and constellations
            const orbits = sats.slice(0, 10).map((s) => ({
                id: s.noradId,
                name: s.name,
                type: s.type,
                path: getSatelliteOrbitPath(s, now, 60),
            }));
            setSatelliteOrbits(orbits);
        });

        // Flights
        fetchLiveFlights().then((flights) => {
            setRawFlights(flights);
            setLiveFlights(flights.map((f) => interpolateFlightPosition(f, 0)));
        });

        // Earthquakes
        fetchLiveEarthquakes().then((quakes) => {
            setEarthquakes(quakes);
        });

        // Sound initial alert
        setTimeout(() => {
            audio.playRadarSweep();
        }, 1000);
    }, []);

    /* ── 2. Real-Time Orbital & Flight Movement Loop (Every Second) ── */
    useEffect(() => {
        let elapsedSec = 0;
        const interval = setInterval(() => {
            elapsedSec += 1;
            const now = Date.now();

            // Propagate satellites
            if (rawSatellites.length > 0 && activeLayers.satellites) {
                const propagated = rawSatellites.map((s) => propagateSatellite(s, now));
                setLiveSatellites(propagated);

                setSelectedEntity((prev) => {
                    if (prev?.entityType === 'satellite') {
                        const updated = propagated.find((s) => s.noradId === prev.noradId);
                        return updated ? { ...prev, ...updated } : prev;
                    }
                    return prev;
                });
            }

            // Propagate flights (dead reckoning)
            if (rawFlights.length > 0 && activeLayers.flights) {
                const interpolated = rawFlights.map((f) => interpolateFlightPosition(f, elapsedSec * 2));
                setLiveFlights(interpolated);

                setSelectedEntity((prev) => {
                    if (prev?.entityType === 'flight') {
                        const updated = interpolated.find((f) => f.icao24 === prev.icao24);
                        return updated ? { ...prev, ...updated } : prev;
                    }
                    return prev;
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [rawSatellites, rawFlights, activeLayers.satellites, activeLayers.flights]);

    /* Handle Entity Selection on Map */
    const handleEntityClick = useCallback((entity) => {
        if (!entity) return;
        audio.playTargetLock();
        setSelectedEntity(entity);
    }, []);

    /* Fly to Target */
    const handleFlyToTarget = useCallback((entity) => {
        if (!entity) return;
        const coords = entity.coordinates || [entity.lon, entity.lat];
        if (coords && coords[0] !== undefined && coords[1] !== undefined) {
            setCameraCenter([coords[0], coords[1]]);
            setCameraZoom(3.5);
        }
    }, []);

    /* Select Active Conflict Theater */
    const handleSelectTheater = useCallback((theater) => {
        if (!theater || !theater.center) return;
        setCameraCenter(theater.center);
        setCameraZoom(theater.zoom || 3.5);
        setSelectedEntity({
            id: theater.id,
            title: theater.name,
            entityType: 'theater',
            lat: theater.center[1],
            lon: theater.center[0],
            description: theater.summary,
            operator: (theater.belligerents || []).join(' vs '),
            status: theater.status,
            metadata: {
                region: theater.region,
                status: theater.status,
                strikesRecorded: `${(theater.activeStrikes || []).length} kinetic incidents logged`
            }
        });
    }, []);

    /* Aggregate Global Stats */
    const stats = {
        satellites: liveSatellites.length,
        flights: liveFlights.length,
        conflicts: activeConflictEvents.length,
        thermal: thermalHotspots.length,
        seismic: earthquakes.length,
    };

    return (
        <div className="app-container">
            {/* ── 3D Spherical Globe & Planetary Map ── */}
            <MapView
                events={activeConflictEvents}
                satellites={liveSatellites}
                satelliteOrbits={satelliteOrbits}
                flights={liveFlights}
                thermalHotspots={thermalHotspots}
                earthquakes={earthquakes}
                activeLayers={activeLayers}
                selectedEntity={selectedEntity}
                center={cameraCenter}
                zoom={cameraZoom}
                onEntityClick={handleEntityClick}
                trackedEntity={trackedEntity}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* ── Real-Time Situational Intelligence HUD ── */}
            <TacticalHUD
                activeLayers={activeLayers}
                toggleLayer={toggleLayer}
                stats={stats}
                selectedEntity={selectedEntity}
                setSelectedEntity={setSelectedEntity}
                trackedEntity={trackedEntity}
                setTrackedEntity={setTrackedEntity}
                onFlyToTarget={handleFlyToTarget}
                liveDispatches={liveDispatches}
                activeTheaters={ACTIVE_CONFLICT_ZONES}
                onSelectTheater={handleSelectTheater}
            />
        </div>
    );
}
