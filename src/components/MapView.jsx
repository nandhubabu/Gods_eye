import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Deck } from '@deck.gl/core';
import { ArcLayer, ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import COUNTRIES_GEOJSON from '../data/countries.geo.json';

const COUNTRY_INDEX = Object.fromEntries(
    (COUNTRIES_GEOJSON.features || []).map((f) => [f.id, f])
);

export default function MapView({ events = [], activeWar, currentParticipants, center, zoom, onEventClick }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const deckRef = useRef(null);

    // Animation state for arcs and capture pulses
    const [time, setTime] = useState(0);

    const onEventClickRef = useRef(onEventClick);
    useEffect(() => { onEventClickRef.current = onEventClick; }, [onEventClick]);

    /* ── Animation Loop ── */
    useEffect(() => {
        let animationFrame;
        const animate = () => {
            setTime((t) => (t + 1) % 10000); // Loops continuously
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    /* ── Initialise MapLibre + Deck ONCE ── */
    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
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
                    // 3D Terrain source
                    'terrain-source': {
                        type: 'raster-dem',
                        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                        tileSize: 256,
                    }
                },
                layers: [
                    { id: 'carto-dark-layer', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 19 },
                    // Sky layer for atmospheric depth when tilted
                    {
                        id: 'sky',
                        type: 'sky',
                        paint: {
                            'sky-color': '#0a0e17',
                            'sky-horizon-blend': 0.5,
                            'sky-atmosphere-color': 'rgba(0, 229, 255, 0.2)',
                            'sky-atmosphere-halo-color': 'rgba(0, 229, 255, 0.1)'
                        }
                    }
                ],
                terrain: { source: 'terrain-source', exaggeration: 1.5 },
            },
            center: center || [10, 30],
            zoom: zoom || 2,
            pitch: 50, // Increased pitch for better 3D effect
            bearing: 0,
            antialias: true,
        });

        map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        const deck = new Deck({
            parent: mapContainerRef.current,
            style: { position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 },
            viewState: {
                longitude: map.getCenter().lng,
                latitude: map.getCenter().lat,
                zoom: map.getZoom(),
                pitch: map.getPitch(),
                bearing: map.getBearing(),
            },
            controller: false,
            layers: [],
            getTooltip: ({ object }) => {
                if (!object || (object.properties && object.properties.name)) return null;
                return {
                    html: `<div class="map-tooltip">
                        <div class="tooltip-title">${object.title || object.properties?.captureId || ''}</div>
                        ${object.date ? `<div class="tooltip-detail">${object.date} · ${object.type?.replace('_', ' ')}</div>` : ''}
                    </div>`,
                    style: { backgroundColor: 'transparent', border: 'none', padding: 0, boxShadow: 'none' },
                };
            },
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Fly to new center when war changes ── */
    useEffect(() => {
        if (mapRef.current && center) {
            mapRef.current.flyTo({ center, zoom: zoom || 4, pitch: 50, bearing: 0, duration: 2000, essential: true });
        }
    }, [center, zoom]);

    /* ── Update layers via setProps ── */
    useEffect(() => {
        if (!deckRef.current) return;

        // 1. Events for data layers
        const missiles = events.filter((e) => e.type === 'missile_strike' && e.sourceCoordinates && e.targetCoordinates);

        // 2. Base country fills (alliance role only)
        const baseParticipants = activeWar?.participants || {};
        const countryFill = (d) => {
            if (!d.id) return [0, 0, 0, 0];
            switch (baseParticipants[d.id]) {
                case 'aggressor': return [255, 61, 61, 110];
                case 'defender': return [61, 150, 255, 110];
                case 'allies': return [61, 200, 255, 70];
                case 'axis': return [255, 145, 0, 110];
                case 'both': return [180, 61, 255, 110];
                default: return [0, 0, 0, 0];
            }
        };

        // 3. Captured regions logic
        const dateToMs = (s) => new Date(s + 'T00:00:00').getTime();
        const nowMs = currentParticipants?.__currentMs ?? dateToMs('2099-01-01');

        const allCaptures = (activeWar?.captures || [])
            .slice()
            .sort((a, b) => dateToMs(a.date) - dateToMs(b.date));

        const liveFeatures = new Map();

        // 3a. Capture animation variables
        // Makes the active captured border oscillate in width and opacity
        const pulseRatio = (Math.sin(time * 0.05) + 1) / 2; // 0 to 1
        const activeLineWidth = 1.5 + (pulseRatio * 2.5);   // 1.5px to 4px
        const activeLineAlpha = 150 + (pulseRatio * 105);   // 150 to 255

        for (const cap of allCaptures) {
            if (dateToMs(cap.date) > nowMs) continue;

            const getColor = (conquerorIso) => {
                const role = baseParticipants[conquerorIso] || 'aggressor';
                switch (role) {
                    case 'axis': return [255, 160, 20, 210];
                    case 'aggressor': return [255, 70, 70, 210];
                    case 'allies': return [80, 200, 120, 210];
                    case 'defender': return [100, 180, 255, 210];
                    default: return [200, 132, 255, 210];
                }
            };

            if (cap.conqueror) {
                const color = getColor(cap.conqueror);
                // Flag the MOST RECENT capture to give it the pulse effect
                // If it happened in the last 6 months (roughly) in the timeline
                const isRecent = (nowMs - dateToMs(cap.date)) < (1000 * 60 * 60 * 24 * 180);

                if (cap.region) {
                    liveFeatures.set(cap.id, {
                        type: 'Feature',
                        id: cap.id,
                        geometry: cap.region,
                        properties: { captureId: cap.id, color, isRecent },
                    });
                } else {
                    for (const iso of (cap.conquered || [])) {
                        const feat = COUNTRY_INDEX[iso];
                        if (!feat) continue;
                        const featureId = `${cap.id}_${iso}`;
                        liveFeatures.set(featureId, {
                            type: 'Feature',
                            id: featureId,
                            geometry: feat.geometry,
                            properties: { captureId: cap.id, iso, color, isRecent },
                        });
                    }
                }
            } else {
                if (cap.region) {
                    const sig = JSON.stringify(cap.region);
                    for (const [key, feat] of liveFeatures) {
                        if (JSON.stringify(feat.geometry) === sig) liveFeatures.delete(key);
                    }
                } else {
                    for (const iso of (cap.conquered || [])) {
                        for (const [key, feat] of liveFeatures) {
                            if (feat.properties.iso === iso) liveFeatures.delete(key);
                        }
                    }
                }
            }
        }

        const captureGeoJson = {
            type: 'FeatureCollection',
            features: Array.from(liveFeatures.values()),
        };

        // 4. Heatmap data processing
        // Give higher weight to battles and events with casualties
        const getEventWeight = (e) => {
            let weight = 1;
            if (e.type === 'battle') weight = 5;
            if (e.metadata?.casualties) {
                const numStr = e.metadata.casualties.replace(/[^0-9]/g, '');
                const num = parseInt(numStr, 10);
                if (!isNaN(num) && num > 1000) weight += Math.min(10, num / 10000);
            }
            return weight;
        };

        // 5. Arc animation parameters
        // dashJustified: [dashLength, gapLength]
        const dashArray = [40, 60];
        // Move the dash along the arc based on time
        const getDashOffset = () => (time * -0.5) % 100;

        deckRef.current.setProps({
            layers: [
                // Layer 1: Heatmap (bottom)
                new HeatmapLayer({
                    id: 'casualty-heatmap',
                    data: events,
                    getPosition: d => d.coordinates || d.targetCoordinates,
                    getWeight: getEventWeight,
                    radiusPixels: 60,
                    intensity: 1.5,
                    threshold: 0.1,
                    // Soft red/orange/yellow palette
                    colorRange: [
                        [255, 61, 61, 0],
                        [255, 61, 61, 30],
                        [255, 90, 0, 80],
                        [255, 145, 0, 120],
                        [255, 200, 0, 160],
                        [255, 255, 255, 200]
                    ],
                    updateTriggers: { getPosition: [events] }
                }),

                // Layer 2: Country base tints
                new GeoJsonLayer({
                    id: 'countries',
                    data: COUNTRIES_GEOJSON,
                    stroked: true, filled: true,
                    lineWidthMinPixels: 1,
                    getLineColor: [60, 60, 60, 100],
                    getFillColor: countryFill,
                    updateTriggers: { getFillColor: [activeWar?.id] },
                    transitions: { getFillColor: { duration: 600, type: 'interpolation' } },
                    pickable: false,
                }),

                // Layer 3: Captured regions with pulse
                new GeoJsonLayer({
                    id: 'capture-regions',
                    data: captureGeoJson,
                    stroked: true, filled: true,
                    lineWidthMinPixels: 1.5,
                    getLineWidth: d => d.properties.isRecent ? activeLineWidth : 1.5,
                    getFillColor: (d) => d.properties.color,
                    getLineColor: (d) => {
                        const [r, g, b] = d.properties.color;
                        return [r, g, b, d.properties.isRecent ? activeLineAlpha : 240];
                    },
                    transitions: { getFillColor: { duration: 900, type: 'interpolation' } },
                    updateTriggers: {
                        getFillColor: [nowMs, activeWar?.id],
                        getLineColor: [nowMs, activeWar?.id, time], // time triggers pulse
                        getLineWidth: [time]
                    },
                    pickable: false,
                }),

                // Layer 4: Missile Arcs (Animated using extensions or fallback)
                // We use standard ArcLayer but animate via re-render loop on 'time'
                // Deck.gl's PathStyleExtension would be needed for dashed arcs, 
                // but we can simulate activity by oscillating the target color/width
                new ArcLayer({
                    id: 'missile-arcs',
                    data: missiles,
                    getSourcePosition: (d) => d.sourceCoordinates,
                    getTargetPosition: (d) => d.targetCoordinates,
                    getSourceColor: [255, 61, 61, 200],
                    // Flash the target color based on time
                    getTargetColor: () => [255, 180 + (Math.sin(time * 0.1) * 50), 0, 220],
                    getWidth: () => 2.5 + (Math.sin(time * 0.1) * 1.5),
                    getHeight: 0.5,
                    greatCircle: true, pickable: true,
                    onClick: ({ object }) => object && onEventClickRef.current?.(object),
                    updateTriggers: {
                        getSourcePosition: [events],
                        getTargetPosition: [events],
                        getTargetColor: [time],
                        getWidth: [time]
                    },
                }),

                // Layer 5: Missile source dots
                new ScatterplotLayer({
                    id: 'missile-sources',
                    data: missiles,
                    getPosition: (d) => d.sourceCoordinates,
                    getFillColor: [255, 61, 61, 160],
                    getRadius: 18000, radiusMinPixels: 4, radiusMaxPixels: 14,
                    pickable: false,
                    updateTriggers: { getPosition: [events] },
                }),

                // Layer 6: Missile target dots (pulse)
                new ScatterplotLayer({
                    id: 'missile-targets',
                    data: missiles,
                    getPosition: (d) => d.targetCoordinates,
                    getFillColor: () => [255, 180, 0, 150 + (Math.sin(time * 0.1) * 50)],
                    getRadius: () => 22000 + (Math.sin(time * 0.1) * 8000),
                    radiusMinPixels: 5, radiusMaxPixels: 20,
                    stroked: true, lineWidthMinPixels: 1,
                    getLineColor: [255, 180, 0, 200],
                    pickable: true,
                    onClick: ({ object }) => object && onEventClickRef.current?.(object),
                    updateTriggers: {
                        getPosition: [events],
                        getFillColor: [time],
                        getRadius: [time]
                    },
                }),
            ],
        });
    }, [events, currentParticipants, activeWar, time]); // re-run on 'time' tick

    return <div ref={mapContainerRef} className="map-wrapper" />;
}
