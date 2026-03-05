import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Deck } from '@deck.gl/core';
import { ArcLayer, ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import COUNTRIES_GEOJSON from '../data/countries.geo.json';

/**
 * MapView — renders a MapLibre base map with Deck.gl overlay layers.
 *
 * Props:
 *  - events:       filtered war events to display
 *  - activeWar:    the currently selected war object containing participants
 *  - center:       [lng, lat]
 *  - zoom:         number
 *  - onEventClick: (event) => void
 */
export default function MapView({ events = [], activeWar, currentParticipants, center, zoom, onEventClick }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const deckRef = useRef(null);
    const [viewState, setViewState] = useState(null);

    /* ── Initialise MapLibre ── */
    useEffect(() => {
        if (mapRef.current) return;

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
                },
                layers: [
                    {
                        id: 'carto-dark-layer',
                        type: 'raster',
                        source: 'carto-dark',
                        minzoom: 0,
                        maxzoom: 19,
                    },
                ],
            },
            center: center || [10, 30],
            zoom: zoom || 2,
            pitch: 35,
            bearing: 0,
            antialias: true,
        });

        map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        map.on('move', () => {
            const c = map.getCenter();
            setViewState({
                longitude: c.lng,
                latitude: c.lat,
                zoom: map.getZoom(),
                pitch: map.getPitch(),
                bearing: map.getBearing(),
            });
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    /* ── Fly to new center when war changes ── */
    useEffect(() => {
        if (mapRef.current && center) {
            mapRef.current.flyTo({
                center,
                zoom: zoom || 3,
                pitch: 35,
                bearing: 0,
                duration: 2000,
                essential: true,
            });
        }
    }, [center, zoom]);

    /* ── Deck.gl overlay ── */
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        // Separate events by type
        const missiles = events.filter((e) => e.type === 'missile_strike' && e.sourceCoordinates && e.targetCoordinates);
        const points = events.filter((e) => e.type !== 'missile_strike' || !e.sourceCoordinates);

        const typeColor = (type) => {
            switch (type) {
                case 'missile_strike': return [255, 61, 61];
                case 'deployment': return [0, 229, 255];
                case 'battle': return [255, 145, 0];
                default: return [200, 200, 200];
            }
        };

        // Cleanup previous deck
        if (deckRef.current) {
            deckRef.current.finalize();
            deckRef.current = null;
        }

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
            layers: [
                new GeoJsonLayer({
                    id: 'countries',
                    data: COUNTRIES_GEOJSON,
                    stroked: true,
                    filled: true,
                    lineWidthMinPixels: 1,
                    getLineColor: [60, 60, 60, 100],
                    getFillColor: (d) => {
                        // Use dynamic currentParticipants if available, else fall back to activeWar.participants
                        const participants = currentParticipants || (activeWar && activeWar.participants) || {};
                        if (!d.id) return [0, 0, 0, 0];
                        const role = participants[d.id];
                        switch (role) {
                            // Base alliance roles
                            case 'aggressor': return [255, 61, 61, 110];    // Red
                            case 'defender': return [61, 150, 255, 110];   // Blue
                            case 'allies': return [61, 200, 255, 70];    // Light blue
                            case 'axis': return [255, 145, 0, 110];    // Orange
                            case 'both': return [180, 61, 255, 110];   // Purple
                            // Occupied territory roles (lighter, distinct tones)
                            case 'aggressor_occupied': return [255, 80, 80, 160]; // Bright red — occupied by an aggressor
                            case 'axis_occupied': return [255, 160, 20, 160]; // Amber — axis-occupied
                            case 'allies_occupied': return [80, 200, 120, 160]; // Green — allies-occupied
                            case 'defender_occupied': return [100, 180, 255, 160]; // Sky blue — occupied by defender
                            default: return [0, 0, 0, 0];
                        }
                    },
                    updateTriggers: {
                        getFillColor: [currentParticipants, activeWar],
                    },
                    pickable: false
                }),
                new ArcLayer({
                    id: 'missile-arcs',
                    data: missiles,
                    getSourcePosition: (d) => d.sourceCoordinates,
                    getTargetPosition: (d) => d.targetCoordinates,
                    getSourceColor: [255, 61, 61, 200],
                    getTargetColor: [255, 180, 0, 220],
                    getWidth: 2.5,
                    getHeight: 0.5,
                    greatCircle: true,
                    pickable: true,
                    onClick: ({ object }) => object && onEventClick && onEventClick(object),
                    updateTriggers: {
                        getSourcePosition: [events],
                        getTargetPosition: [events],
                    },
                }),
                new ScatterplotLayer({
                    id: 'missile-sources',
                    data: missiles,
                    getPosition: (d) => d.sourceCoordinates,
                    getFillColor: [255, 61, 61, 160],
                    getRadius: 18000,
                    radiusMinPixels: 4,
                    radiusMaxPixels: 14,
                    pickable: false,
                    updateTriggers: { getPosition: [events] },
                }),
                new ScatterplotLayer({
                    id: 'missile-targets',
                    data: missiles,
                    getPosition: (d) => d.targetCoordinates,
                    getFillColor: [255, 180, 0, 200],
                    getRadius: 22000,
                    radiusMinPixels: 5,
                    radiusMaxPixels: 16,
                    stroked: true,
                    lineWidthMinPixels: 1,
                    getLineColor: [255, 180, 0, 120],
                    pickable: true,
                    onClick: ({ object }) => object && onEventClick && onEventClick(object),
                    updateTriggers: { getPosition: [events] },
                }),
                new ScatterplotLayer({
                    id: 'event-points',
                    data: points,
                    getPosition: (d) => d.coordinates,
                    getFillColor: (d) => typeColor(d.type),
                    getRadius: 20000,
                    radiusMinPixels: 5,
                    radiusMaxPixels: 18,
                    stroked: true,
                    lineWidthMinPixels: 1,
                    getLineColor: (d) => [...typeColor(d.type), 100],
                    pickable: true,
                    onClick: ({ object }) => object && onEventClick && onEventClick(object),
                    updateTriggers: { getPosition: [events], getFillColor: [events] },
                }),
            ],
            getTooltip: ({ object }) => {
                if (!object) return null;
                // Exclude tooltip for countries layer if it becomes pickable later
                if (object.properties && object.properties.name) return null;
                return {
                    html: `<div class="map-tooltip">
            <div class="tooltip-title">${object.title}</div>
            <div class="tooltip-detail">${object.date} · ${object.type.replace('_', ' ')}</div>
          </div>`,
                    style: {
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 0,
                        boxShadow: 'none',
                    },
                };
            },
        });

        deckRef.current = deck;

        // Sync deck viewState to map movement
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

        return () => {
            map.off('move', syncDeck);
            map.off('resize', syncDeck);
            if (deckRef.current) {
                deckRef.current.finalize();
                deckRef.current = null;
            }
        };
    }, [events, onEventClick, currentParticipants, activeWar]);

    return <div ref={mapContainerRef} className="map-wrapper" />;
}
