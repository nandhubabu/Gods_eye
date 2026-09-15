import React, { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Deck, _GlobeView as GlobeView, MapView as DeckMapView } from '@deck.gl/core';
import { ArcLayer, ScatterplotLayer, GeoJsonLayer, PathLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import COUNTRIES_GEOJSON from '../data/countries.geo.json';
import { GLOBE_GRATICULES, densifyOrbitPath } from '../utils/globeUtils';

const COUNTRY_INDEX = Object.fromEntries(
    (COUNTRIES_GEOJSON.features || []).map((f) => [f.id, f])
);

export default function MapView({
    events = [],
    activeWar,
    currentParticipants,
    satellites = [],
    satelliteOrbits = [],
    flights = [],
    thermalHotspots = [],
    earthquakes = [],
    activeLayers = {},
    selectedEntity,
    center,
    zoom,
    onEntityClick,
    trackedEntity,
    viewMode = 'globe', // Default to 3D Globe as requested
    setViewMode,
}) {
    const containerRef = useRef(null);
    const mapLibreContainerRef = useRef(null);
    const deckCanvasRef = useRef(null);

    const mapRef = useRef(null);
    const deckRef = useRef(null);

    // Globe ViewState
    const [globeViewState, setGlobeViewState] = useState({
        longitude: center ? center[0] : 20,
        latitude: center ? center[1] : 25,
        zoom: 0.6,
        minZoom: -1.2,
        maxZoom: 14,
    });

    const [isAutoRotating, setIsAutoRotating] = useState(false);
    const [time, setTime] = useState(0);

    const onEntityClickRef = useRef(onEntityClick);
    useEffect(() => { onEntityClickRef.current = onEntityClick; }, [onEntityClick]);

    /* ── Continuous Animation Loop ── */
    useEffect(() => {
        let animationFrame;
        const animate = () => {
            setTime((t) => (t + 1) % 10000);
            if (isAutoRotating && viewMode === 'globe') {
                setGlobeViewState((prev) => ({
                    ...prev,
                    longitude: (prev.longitude + 0.15) % 360,
                }));
            }
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [isAutoRotating, viewMode]);

    /* ── Tooltip generator ── */
    const getTooltip = ({ object }) => {
        if (!object) return null;
        if (object.properties && object.properties.name && !object.entityType) return null;

        let title = object.title || object.name || object.callsign || object.id || 'Entity';
        let subtitle = '';
        let details = '';

        if (object.entityType === 'satellite') {
            subtitle = `🛰️ ${object.type?.toUpperCase()} // NORAD ${object.noradId}`;
            details = `Alt: ${object.altKm} km · Speed: ${object.speedKms} km/s`;
        } else if (object.entityType === 'flight') {
            subtitle = `✈️ ${object.aircraft} (${object.operator || object.category})`;
            details = `FL${Math.round(object.altFeet / 100)} · ${object.speedKnots} kts · Hdg: ${object.heading}°`;
        } else if (object.entityType === 'thermal') {
            subtitle = `🔥 NASA FIRMS Thermal Anomaly (${object.confidence})`;
            details = `Radiative Power: ${object.frp} MW · ${object.theater}`;
        } else if (object.entityType === 'seismic') {
            subtitle = `🌋 USGS Seismic Disturbance M${object.mag}`;
            details = `Depth: ${object.depthKm} km · ${object.place}`;
        } else if (object.type) {
            subtitle = `⚔️ ${object.type.replace('_', ' ').toUpperCase()}`;
            details = `${object.date || ''} · ${object.title || ''}`;
        }

        return {
            html: `<div class="map-tooltip">
                <div class="tooltip-title">${title}</div>
                ${subtitle ? `<div class="tooltip-detail" style="color: var(--color-accent); font-weight: 600;">${subtitle}</div>` : ''}
                ${details ? `<div class="tooltip-detail">${details}</div>` : ''}
            </div>`,
            style: { backgroundColor: 'transparent', border: 'none', padding: 0, boxShadow: 'none' },
        };
    };

    /* ── Initialize Deck.gl ── */
    useEffect(() => {
        if (!containerRef.current) return;

        if (viewMode === 'globe') {
            // Standalone 3D Spherical Globe View
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }

            const deck = new Deck({
                parent: containerRef.current,
                views: [new GlobeView({ id: 'globe', controller: true, resolution: 10 })],
                viewState: globeViewState,
                onViewStateChange: ({ viewState }) => {
                    setGlobeViewState(viewState);
                },
                getTooltip,
                layers: [],
            });

            deckRef.current = deck;

            return () => {
                deck.finalize();
                deckRef.current = null;
            };
        } else {
            // Flat 2.5D MapLibre View with Deck Overlay
            const map = new maplibregl.Map({
                container: mapLibreContainerRef.current,
                style: {
                    version: 8,
                    sources: {
                        'carto-dark': {
                            type: 'raster',
                            tiles: [
                                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                                'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                            ],
                            tileSize: 256,
                            attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
                        },
                        'terrain-source': {
                            type: 'raster-dem',
                            url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                            tileSize: 256,
                        }
                    },
                    layers: [
                        { id: 'carto-dark-layer', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 19 },
                        {
                            id: 'sky',
                            type: 'sky',
                            paint: {
                                'sky-color': '#060910',
                                'sky-horizon-blend': 0.6,
                                'sky-atmosphere-color': 'rgba(0, 229, 255, 0.25)',
                                'sky-atmosphere-halo-color': 'rgba(0, 229, 255, 0.15)'
                            }
                        }
                    ],
                    terrain: { source: 'terrain-source', exaggeration: 1.5 },
                },
                center: center || [20, 25],
                zoom: zoom || 2.2,
                pitch: 50,
                bearing: 0,
                antialias: true,
            });

            map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

            const deck = new Deck({
                parent: containerRef.current,
                style: { position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 },
                viewState: {
                    longitude: map.getCenter().lng,
                    latitude: map.getCenter().lat,
                    zoom: map.getZoom(),
                    pitch: map.getPitch(),
                    bearing: map.getBearing(),
                },
                controller: false,
                getTooltip,
                layers: [],
            });

            const syncDeck = () => {
                if (!deckRef.current) return;
                deckRef.current.setProps({
                    viewState: {
                        longitude: map.getCenter().lng,
                        latitude: map.getCenter().lat,
                        zoom: map.getZoom(),
                        pitch: map.getPitch(),
                        bearing: map.getBearing(),
                    },
                });
            };

            map.on('move', syncDeck);
            map.on('resize', syncDeck);

            mapRef.current = map;
            deckRef.current = deck;

            return () => {
                map.off('move', syncDeck);
                map.off('resize', syncDeck);
                map.remove();
                deck.finalize();
                mapRef.current = null;
                deckRef.current = null;
            };
        }
    }, [viewMode]);

    /* ── Camera tracking for tracked entity ── */
    useEffect(() => {
        if (!trackedEntity) return;
        const coords = trackedEntity.coordinates || [trackedEntity.lon, trackedEntity.lat];
        if (!coords || coords[0] === undefined || coords[1] === undefined) return;

        if (viewMode === 'globe') {
            setGlobeViewState((prev) => ({
                ...prev,
                longitude: coords[0],
                latitude: coords[1],
                zoom: Math.max(prev.zoom, 2.5),
                transitionDuration: 800,
            }));
        } else if (mapRef.current) {
            mapRef.current.flyTo({
                center: [coords[0], coords[1]],
                zoom: Math.max(mapRef.current.getZoom(), 4.5),
                speed: 1.2,
                essential: true,
            });
        }
    }, [trackedEntity, viewMode]);

    /* ── Fly to center on center change ── */
    useEffect(() => {
        if (!center || trackedEntity) return;
        if (viewMode === 'globe') {
            setGlobeViewState((prev) => ({
                ...prev,
                longitude: center[0],
                latitude: center[1],
                zoom: zoom ? Math.min(zoom * 0.4, 4) : 0.8,
                transitionDuration: 1500,
            }));
        } else if (mapRef.current) {
            mapRef.current.flyTo({ center, zoom: zoom || 3.5, pitch: 50, bearing: 0, duration: 1500, essential: true });
        }
    }, [center, zoom, trackedEntity, viewMode]);

    /* ── Update layers on Deck.gl ── */
    useEffect(() => {
        if (!deckRef.current) return;

        const layers = [];
        const pulse = (Math.sin(time * 0.08) + 1) / 2; // 0 to 1
        const isGlobe = viewMode === 'globe';

        // 0. GLOBE WIREFRAME GRATICULES (Latitude / Longitude coordinate grid)
        if (isGlobe) {
            layers.push(
                new PathLayer({
                    id: 'globe-graticules',
                    data: GLOBE_GRATICULES,
                    getPath: d => d.path,
                    getColor: d => d.isEquator ? [0, 229, 255, 110] : [0, 229, 255, 30],
                    getWidth: d => d.isEquator ? 1.5 : 0.8,
                    widthMinPixels: 1,
                    pickable: false,
                })
            );
        }

        // 1. BASE COUNTRIES & GEOPOLITICAL TENSION TINTS
        const ACTIVE_TENSION_COUNTRIES = {
            UKR: [61, 150, 255, 110], // Ukraine (Defensive blue)
            RUS: [255, 61, 61, 110],  // Russia (Aggressor red)
            ISR: [61, 180, 255, 110], // Israel
            LBN: [255, 145, 0, 110],  // Lebanon
            YEM: [255, 61, 61, 110],  // Yemen (Houthis)
            IRN: [255, 100, 0, 110],  // Iran
            SDN: [255, 145, 0, 110],  // Sudan
            TWN: [61, 200, 255, 110], // Taiwan
            CHN: [255, 80, 80, 90],   // China
            PRK: [255, 61, 61, 110],  // North Korea
            KOR: [61, 180, 255, 90],  // South Korea
        };

        const countryFill = (d) => {
            if (!d.id) return isGlobe ? [16, 24, 38, 240] : [0, 0, 0, 0];
            if (activeLayers.conflicts !== false && ACTIVE_TENSION_COUNTRIES[d.id]) {
                return ACTIVE_TENSION_COUNTRIES[d.id];
            }
            return isGlobe ? [16, 24, 38, 240] : [0, 0, 0, 0];
        };

        layers.push(
            new GeoJsonLayer({
                id: 'countries',
                data: COUNTRIES_GEOJSON,
                stroked: true,
                filled: true,
                lineWidthMinPixels: 1,
                getLineColor: [45, 65, 95, 160],
                getFillColor: countryFill,
                updateTriggers: { getFillColor: [activeLayers.conflicts, isGlobe] },
                pickable: false,
            })
        );

        // 2. ACTIVE CONFLICT STRIKES, BATTLES & SORTIES
        if (activeLayers.conflicts !== false && events.length > 0) {
            const missiles = events.filter((e) => e.type === 'missile_strike' && e.sourceCoordinates && e.targetCoordinates);
            const battles = events.filter((e) => e.type === 'battle' && e.coordinates);
            const deployments = events.filter((e) => e.type === 'deployment' && e.coordinates);

            // Ballistic & Cruise Missile Arcs
            if (missiles.length > 0) {
                layers.push(
                    new ArcLayer({
                        id: 'missile-arcs',
                        data: missiles,
                        getSourcePosition: d => d.sourceCoordinates,
                        getTargetPosition: d => d.targetCoordinates,
                        getSourceColor: [255, 61, 61, 200],
                        getTargetColor: () => [255, 180 + (Math.sin(time * 0.1) * 50), 0, 220],
                        getWidth: () => 2.5 + (Math.sin(time * 0.1) * 1.5),
                        getHeight: isGlobe ? 0.35 : 0.5,
                        greatCircle: true,
                        pickable: true,
                        onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                        updateTriggers: { getTargetColor: [time], getWidth: [time] },
                    })
                );

                // Missile Targets & Impacts
                layers.push(
                    new ScatterplotLayer({
                        id: 'missile-targets',
                        data: missiles,
                        getPosition: d => d.targetCoordinates,
                        getFillColor: () => [255, 60, 0, 180 + (pulse * 70)],
                        getRadius: isGlobe ? 38000 : 22000,
                        radiusMinPixels: 6,
                        radiusMaxPixels: 20,
                        stroked: true,
                        lineWidthMinPixels: 1.5,
                        getLineColor: [255, 200, 0, 240],
                        pickable: true,
                        onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                        updateTriggers: { getFillColor: [time], getRadius: [time] },
                    })
                );
            }

            // Active Ground Engagements & Battles
            if (battles.length > 0) {
                layers.push(
                    new ScatterplotLayer({
                        id: 'ground-battles',
                        data: battles,
                        getPosition: d => d.coordinates,
                        getFillColor: () => [255, 145, 0, 160 + (pulse * 80)],
                        getRadius: isGlobe ? 45000 : 25000,
                        radiusMinPixels: 6,
                        radiusMaxPixels: 22,
                        stroked: true,
                        lineWidthMinPixels: 2,
                        getLineColor: [255, 61, 61, 220],
                        pickable: true,
                        onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                        updateTriggers: { getFillColor: [time], getRadius: [time] },
                    })
                );
            }

            // Military Air / Naval Deployments
            if (deployments.length > 0) {
                layers.push(
                    new ScatterplotLayer({
                        id: 'military-deployments',
                        data: deployments,
                        getPosition: d => d.coordinates,
                        getFillColor: [0, 229, 255, 200],
                        getRadius: isGlobe ? 32000 : 18000,
                        radiusMinPixels: 5,
                        radiusMaxPixels: 16,
                        stroked: true,
                        lineWidthMinPixels: 1.5,
                        getLineColor: [255, 255, 255, 220],
                        pickable: true,
                        onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                    })
                );
            }
        }

        // 3. SATELLITE ORBITAL LINES & FLEET
        if (activeLayers.satellites !== false && satellites.length > 0) {
            // Orbital Lines (densified so lines follow the 3D spherical curve perfectly!)
            if (satelliteOrbits.length > 0) {
                const densifiedOrbits = satelliteOrbits.map(o => ({
                    ...o,
                    densifiedPath: isGlobe ? densifyOrbitPath(o.path, 2.5) : o.path,
                }));

                layers.push(
                    new PathLayer({
                        id: 'satellite-orbit-paths',
                        data: densifiedOrbits,
                        getPath: d => d.densifiedPath,
                        getColor: d => {
                            if (d.type === 'station') return [0, 229, 255, 140];
                            if (d.type === 'recon') return [255, 61, 61, 140];
                            if (d.type === 'starlink') return [255, 180, 0, 110];
                            return [180, 130, 255, 120];
                        },
                        getWidth: isGlobe ? 2.5 : 1.5,
                        widthMinPixels: 1.5,
                        pickable: false,
                    })
                );
            }

            // Satellite Markers
            layers.push(
                new ScatterplotLayer({
                    id: 'satellite-fleet',
                    data: satellites.map(s => ({ ...s, entityType: 'satellite' })),
                    getPosition: d => isGlobe ? [d.lon, d.lat, 0] : d.coordinates,
                    getFillColor: d => {
                        if (selectedEntity?.id === d.id) return [255, 255, 255, 255];
                        if (d.type === 'station') return [0, 229, 255, 240];
                        if (d.type === 'recon') return [255, 61, 61, 240];
                        if (d.type === 'starlink') return [255, 180, 0, 220];
                        return [192, 132, 252, 230];
                    },
                    getRadius: isGlobe ? 45000 : 28000,
                    radiusMinPixels: 6,
                    radiusMaxPixels: 18,
                    stroked: true,
                    lineWidthMinPixels: 2,
                    getLineColor: d => selectedEntity?.id === d.id ? [0, 229, 255, 255] : [255, 255, 255, 200],
                    pickable: true,
                    onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                    updateTriggers: {
                        getFillColor: [selectedEntity?.id],
                        getLineColor: [selectedEntity?.id],
                        getPosition: [satellites],
                    },
                })
            );
        }

        // 4. FLIGHT ROUTE ARCS & AIRCRAFT
        if (activeLayers.flights !== false && flights.length > 0) {
            const flightsWithCorridors = flights.filter(f => f.originCoords && f.destCoords);
            if (flightsWithCorridors.length > 0) {
                layers.push(
                    new ArcLayer({
                        id: 'flight-corridor-arcs',
                        data: flightsWithCorridors,
                        getSourcePosition: d => d.originCoords,
                        getTargetPosition: d => d.destCoords,
                        getSourceColor: [0, 229, 255, 40],
                        getTargetColor: [0, 229, 255, 90],
                        getWidth: 1.2,
                        getHeight: isGlobe ? 0.2 : 0.15,
                        greatCircle: true,
                        pickable: false,
                    })
                );
            }

            layers.push(
                new ScatterplotLayer({
                    id: 'aircraft-fleet',
                    data: flights.map(f => ({ ...f, entityType: 'flight' })),
                    getPosition: d => [d.lon, d.lat, 0],
                    getFillColor: d => {
                        if (selectedEntity?.icao24 === d.icao24) return [255, 255, 255, 255];
                        if (d.category === 'military') return [255, 70, 70, 240];
                        if (d.category === 'cargo') return [192, 132, 252, 220];
                        return [0, 229, 255, 230];
                    },
                    getRadius: isGlobe ? 30000 : 18000,
                    radiusMinPixels: 4.5,
                    radiusMaxPixels: 14,
                    stroked: true,
                    lineWidthMinPixels: 1.5,
                    getLineColor: d => selectedEntity?.icao24 === d.icao24 ? [255, 215, 0, 255] : [10, 14, 23, 220],
                    pickable: true,
                    onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                    updateTriggers: {
                        getPosition: [flights],
                        getFillColor: [selectedEntity?.icao24],
                        getLineColor: [selectedEntity?.icao24],
                    }
                })
            );
        }

        // 5. THERMAL ANOMALIES & EXPLOSIONS
        if (activeLayers.thermal !== false && thermalHotspots.length > 0) {
            layers.push(
                new ScatterplotLayer({
                    id: 'thermal-hotspots',
                    data: thermalHotspots.map(t => ({ ...t, entityType: 'thermal' })),
                    getPosition: d => [d.lon, d.lat, 0],
                    getFillColor: () => [255, 60, 0, 160 + (pulse * 90)],
                    getRadius: isGlobe ? 45000 : 28000,
                    radiusMinPixels: 6,
                    radiusMaxPixels: 22,
                    stroked: true,
                    lineWidthMinPixels: 2,
                    getLineColor: () => [255, 200, 0, 220],
                    pickable: true,
                    onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                    updateTriggers: { getFillColor: [time], getRadius: [time] }
                })
            );
        }

        // 6. USGS SEISMIC & EARTHQUAKES
        if (activeLayers.seismic !== false && earthquakes.length > 0) {
            layers.push(
                new ScatterplotLayer({
                    id: 'seismic-disturbances',
                    data: earthquakes.map(q => ({ ...q, entityType: 'seismic' })),
                    getPosition: d => [d.lon, d.lat, 0],
                    getFillColor: d => {
                        if (d.alert === 'red' || d.mag >= 6) return [255, 61, 61, 180];
                        if (d.alert === 'orange' || d.mag >= 5.5) return [255, 145, 0, 170];
                        return [255, 215, 0, 150];
                    },
                    getRadius: d => (d.mag || 4) * (isGlobe ? 10000 : 8000) + (pulse * 5000),
                    radiusMinPixels: 6,
                    radiusMaxPixels: 22,
                    stroked: true,
                    lineWidthMinPixels: 1.5,
                    getLineColor: [255, 255, 255, 200],
                    pickable: true,
                    onClick: ({ object }) => object && onEntityClickRef.current?.(object),
                    updateTriggers: { getRadius: [time] }
                })
            );
        }

        // 7. TARGET LOCK RETICLE OVER SELECTED ENTITY
        if (selectedEntity) {
            const coords = [selectedEntity.lon, selectedEntity.lat, 0];
            if (coords[0] !== undefined && coords[1] !== undefined) {
                layers.push(
                    new ScatterplotLayer({
                        id: 'target-lock-reticle',
                        data: [{ position: coords }],
                        getPosition: d => d.position,
                        getFillColor: [0, 0, 0, 0],
                        getRadius: isGlobe ? 65000 : 40000,
                        radiusMinPixels: 18,
                        radiusMaxPixels: 40,
                        stroked: true,
                        lineWidthMinPixels: 2.5,
                        getLineColor: () => [0, 229, 255, 220 + (pulse * 35)],
                        pickable: false,
                        updateTriggers: { getRadius: [time], getLineColor: [time] }
                    })
                );
            }
        }

        deckRef.current.setProps({ layers });
    }, [
        events, currentParticipants, activeWar, time,
        satellites, satelliteOrbits, flights, thermalHotspots, earthquakes,
        activeLayers, selectedEntity, viewMode
    ]);

    return (
        <div ref={containerRef} className={`map-wrapper ${viewMode === 'globe' ? 'globe-mode' : 'flat-mode'}`}>
            {/* MapLibre 2.5D container used only in flat mode */}
            {viewMode === 'map' && (
                <div ref={mapLibreContainerRef} className="maplibre-container" />
            )}

            {/* Tactical Viewport Controls (Globe vs Map & Auto-Rotate) */}
            <div className="tactical-view-controls">
                <div className="view-mode-pill glass-panel">
                    <button
                        className={`view-mode-btn ${viewMode === 'globe' ? 'active' : ''}`}
                        onClick={() => setViewMode && setViewMode('globe')}
                        title="Switch to 3D Planetary Globe (Ideal for viewing satellite orbits & flight curves)"
                    >
                        🌐 3D GLOBE
                    </button>
                    <button
                        className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
                        onClick={() => setViewMode && setViewMode('map')}
                        title="Switch to 2.5D Tactical Flat Map"
                    >
                        🗺️ FLAT MAP
                    </button>
                </div>

                {viewMode === 'globe' && (
                    <button
                        className={`globe-rotate-btn glass-panel ${isAutoRotating ? 'active' : ''}`}
                        onClick={() => setIsAutoRotating(p => !p)}
                        title={isAutoRotating ? 'Pause Planetary Rotation' : 'Enable Planetary Auto-Rotation'}
                    >
                        {isAutoRotating ? '⏸ PAUSE ROTATION' : '🔄 AUTO ROTATE'}
                    </button>
                )}
            </div>
        </div>
    );
}
