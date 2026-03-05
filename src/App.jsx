import React, { useState, useEffect, useCallback, useRef } from 'react';
import MapView from './components/MapView';
import WARS from './data/wars';

/* ── Helpers ── */
const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const dateToMs = (dateStr) => new Date(dateStr + 'T00:00:00').getTime();

const msToDateStr = (ms) => {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const typeLabel = (type) => {
    switch (type) {
        case 'missile_strike': return '🚀 Missile Strike';
        case 'deployment': return '🪖 Deployment';
        case 'battle': return '⚔️ Battle';
        case 'capture': return '🏴 Territory Capture';
        default: return type;
    }
};

/* ── Filter types ── */
const ALL_TYPES = ['missile_strike', 'deployment', 'battle', 'capture'];

export default function App() {
    const [activeWarId, setActiveWarId] = useState(WARS[0].id);
    const [activeFilters, setActiveFilters] = useState(new Set(ALL_TYPES));
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1);
    const playIntervalRef = useRef(null);

    const war = WARS.find((w) => w.id === activeWarId);
    const startMs = dateToMs(war.startDate);
    const endMs = dateToMs(war.endDate);

    const [currentMs, setCurrentMs] = useState(startMs);

    /* Reset timeline when war changes */
    useEffect(() => {
        setCurrentMs(dateToMs(war.startDate));
        setSelectedEvent(null);
        setIsPlaying(false);
    }, [activeWarId]);

    /* Auto-play logic */
    useEffect(() => {
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        if (!isPlaying) return;

        // Each tick advances time by ~30 days * speed
        const tickMs = 30 * 24 * 60 * 60 * 1000 * playSpeed;
        playIntervalRef.current = setInterval(() => {
            setCurrentMs((prev) => {
                if (prev >= endMs) {
                    setIsPlaying(false);
                    return endMs;
                }
                return Math.min(prev + tickMs, endMs);
            });
        }, 600);

        return () => clearInterval(playIntervalRef.current);
    }, [isPlaying, playSpeed, endMs]);

    /* Filter events by current time and type */
    const allEvents = [...war.events, ...(war.captures || [])];
    const visibleEvents = allEvents.filter((e) => {
        const eventMs = dateToMs(e.date);
        return eventMs <= currentMs && activeFilters.has(e.type);
    });

    /* Stats */
    const stats = {
        missiles: visibleEvents.filter((e) => e.type === 'missile_strike').length,
        deployments: visibleEvents.filter((e) => e.type === 'deployment').length,
        battles: visibleEvents.filter((e) => e.type === 'battle').length,
        captures: (war.captures || []).filter((c) => dateToMs(c.date) <= currentMs).length,
    };

    /* Compute dynamic territory assignments from capture events */
    const currentParticipants = (() => {
        // Start with the war's static participants
        const result = { ...(war.participants || {}) };
        const captures = war.captures || [];
        // Apply each capture event that has already occurred on the timeline
        const sorted = [...captures].sort((a, b) => dateToMs(a.date) - dateToMs(b.date));
        for (const ev of sorted) {
            if (dateToMs(ev.date) > currentMs) continue;
            for (const country of ev.conquered) {
                if (ev.conqueror) {
                    // Mark the country as occupied by the conqueror's side
                    const conquerorRole = result[ev.conqueror] || 'aggressor';
                    result[country] = `${conquerorRole}_occupied`;
                } else {
                    // Liberation — restore original role from war.participants
                    if (war.participants && war.participants[country]) {
                        result[country] = war.participants[country];
                    } else {
                        delete result[country];
                    }
                }
            }
        }
        result.__currentMs = currentMs;
        return result;
    })();

    const toggleFilter = useCallback((type) => {
        setActiveFilters((prev) => {
            const next = new Set(prev);
            if (next.has(type)) {
                if (next.size > 1) next.delete(type); // keep at least one
            } else {
                next.add(type);
            }
            return next;
        });
    }, []);

    const togglePlay = () => {
        if (currentMs >= endMs) {
            setCurrentMs(startMs);
        }
        setIsPlaying((p) => !p);
    };

    const cycleSpeed = () => {
        setPlaySpeed((s) => (s === 1 ? 3 : s === 3 ? 6 : 1));
    };

    /* Timeline slider value as 0–1000 */
    const sliderValue = endMs === startMs ? 0 : Math.round(((currentMs - startMs) / (endMs - startMs)) * 1000);
    const progressPct = (sliderValue / 1000) * 100;

    const handleSlider = (e) => {
        const ratio = Number(e.target.value) / 1000;
        setCurrentMs(Math.round(startMs + ratio * (endMs - startMs)));
        setIsPlaying(false);
    };

    /* Event markers on timeline */
    const timelineMarkers = allEvents.map((ev) => ({
        pct: ((dateToMs(ev.date) - startMs) / (endMs - startMs)) * 100,
        active: dateToMs(ev.date) <= currentMs,
        type: ev.type,
    }));

    return (
        <div className="app-container">

            {/* ── Map ── */}
            <MapView
                events={visibleEvents}
                activeWar={war}
                currentParticipants={currentParticipants}
                center={war.center}
                zoom={war.zoom}
                onEventClick={setSelectedEvent}
            />

            {/* ── Header ── */}
            <header className="app-header">
                <div className="logo">
                    <div className="logo-icon">👁</div>
                    <span className="logo-text">GOD'S EYE</span>
                </div>

                <div className="header-controls">
                    {ALL_TYPES.map((type) => (
                        <button
                            key={type}
                            className={`filter-btn ${activeFilters.has(type) ? 'active' : ''}`}
                            onClick={() => toggleFilter(type)}
                            id={`filter-${type}`}
                        >
                            <span className={`dot ${type === 'missile_strike' ? 'missile' : type === 'deployment' ? 'deployment' : type === 'battle' ? 'battle' : 'capture'}`} />
                            {type === 'missile_strike' ? 'Missiles' : type === 'deployment' ? 'Deployments' : type === 'battle' ? 'Battles' : 'Captures'}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── War selector (left panel) ── */}
            <nav className="war-selector" id="war-selector">
                {WARS.map((w) => (
                    <button
                        key={w.id}
                        className={`war-chip ${w.id === activeWarId ? 'active' : ''}`}
                        onClick={() => setActiveWarId(w.id)}
                        id={`war-chip-${w.id}`}
                    >
                        <span className="war-chip-year">{w.yearRange}</span>
                        {w.name}
                    </button>
                ))}
            </nav>

            {/* ── Stats bar (right side) ── */}
            <aside className="stats-bar" id="stats-bar">
                <div className="stat-card">
                    <div className="stat-label">Missile Strikes</div>
                    <div className="stat-value danger">{stats.missiles}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Deployments</div>
                    <div className="stat-value">{stats.deployments}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Battles</div>
                    <div className="stat-value warning">{stats.battles}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Captures</div>
                    <div className="stat-value" style={{ color: 'var(--color-accent-captures, #c084fc)' }}>{stats.captures}</div>
                </div>
            </aside>

            {/* ── Timeline ── */}
            <div className="timeline-container" id="timeline-container">
                <div className="timeline-date-display">
                    <span className="timeline-current-date">{formatDate(msToDateStr(currentMs))}</span>
                </div>

                <div className="timeline-bar">
                    {/* Markers */}
                    <div className="timeline-markers">
                        {timelineMarkers.map((m, i) => (
                            <div
                                key={i}
                                className={`timeline-marker ${m.active ? 'active' : ''}`}
                                style={{ left: `${m.pct}%` }}
                            />
                        ))}
                    </div>

                    {/* Visual track */}
                    <div className="timeline-track">
                        <div className="timeline-progress" style={{ width: `${progressPct}%` }} />
                    </div>

                    {/* Invisible range input for dragging */}
                    <input
                        type="range"
                        className="timeline-input"
                        min={0}
                        max={1000}
                        value={sliderValue}
                        onChange={handleSlider}
                        id="timeline-slider"
                    />
                </div>

                <div className="timeline-range">
                    <span className="timeline-label">{war.startDate.slice(0, 4)}</span>
                    <span className="timeline-label">{war.endDate.slice(0, 4)}</span>
                </div>

                <div className="timeline-controls">
                    <button
                        className="play-btn"
                        onClick={togglePlay}
                        id="play-pause-btn"
                        title={isPlaying ? 'Pause' : 'Play timeline'}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button
                        className="play-btn"
                        onClick={() => { setCurrentMs(startMs); setIsPlaying(false); }}
                        id="reset-btn"
                        title="Reset to start"
                    >
                        ⏮
                    </button>
                    <button
                        className="play-btn"
                        onClick={cycleSpeed}
                        id="speed-btn"
                        title="Change playback speed"
                        style={{ width: 'auto', padding: '0 12px', borderRadius: '18px' }}
                    >
                        <span className="speed-label">{playSpeed}×</span>
                    </button>
                </div>
            </div>

            {/* ── Info Panel overlay ── */}
            <div
                className={`info-panel-overlay ${selectedEvent ? 'open' : ''}`}
                onClick={() => setSelectedEvent(null)}
            />

            {/* ── Info Panel ── */}
            <aside className={`info-panel glass-panel ${selectedEvent ? 'open' : ''}`} id="info-panel">
                <div className="info-panel-header">
                    <span className="info-panel-title">
                        {selectedEvent ? typeLabel(selectedEvent.type) : 'Event Details'}
                    </span>
                    <button
                        className="info-panel-close"
                        onClick={() => setSelectedEvent(null)}
                        id="info-panel-close"
                    >✕</button>
                </div>

                {selectedEvent && (
                    <div className="info-panel-content animate-fade-in">
                        <div className="info-section">
                            <div className="info-section-label">Event</div>
                            <div className="info-section-value" style={{ fontWeight: 600, fontSize: '1rem' }}>
                                {selectedEvent.title}
                            </div>
                        </div>

                        <div className="info-section">
                            <div className="info-section-label">Type</div>
                            <span className={`info-badge ${selectedEvent.type}`}>
                                {typeLabel(selectedEvent.type)}
                            </span>
                        </div>

                        <div className="info-section">
                            <div className="info-section-label">Date</div>
                            <div className="info-section-value info-coords">
                                {formatDate(selectedEvent.date)}
                            </div>
                        </div>

                        <div className="info-section">
                            <div className="info-section-label">Description</div>
                            <div className="info-section-value">{selectedEvent.description}</div>
                        </div>

                        {selectedEvent.metadata && (
                            <div className="info-section">
                                <div className="info-section-label">Details</div>
                                {Object.entries(selectedEvent.metadata).map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'capitalize', minWidth: '80px' }}>
                                            {k}
                                        </span>
                                        <span style={{ color: 'var(--color-text-primary)', fontSize: '0.8rem' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedEvent.sourceCoordinates && (
                            <div className="info-section">
                                <div className="info-section-label">Coordinates</div>
                                <div className="info-coords">
                                    Source: {selectedEvent.sourceCoordinates[1].toFixed(2)}°, {selectedEvent.sourceCoordinates[0].toFixed(2)}°
                                </div>
                                <div className="info-coords" style={{ marginTop: '4px' }}>
                                    Target: {selectedEvent.targetCoordinates[1].toFixed(2)}°, {selectedEvent.targetCoordinates[0].toFixed(2)}°
                                </div>
                            </div>
                        )}


                        {selectedEvent.type === 'capture' && (
                            <div className="info-section">
                                <div className="info-section-label">Territory Change</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {selectedEvent.conqueror && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', minWidth: '80px' }}>Occupied by</span>
                                            <span style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 600 }}>{selectedEvent.conqueror}</span>
                                        </div>
                                    )}
                                    {!selectedEvent.conqueror && (
                                        <div style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>✓ Liberation</div>
                                    )}
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', minWidth: '80px' }}>Regions</span>
                                        <span style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem' }}>{(selectedEvent.conquered || []).join(', ')}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedEvent.coordinates && !selectedEvent.sourceCoordinates && (
                            <div className="info-section">
                                <div className="info-section-label">Location</div>
                                <div className="info-coords">
                                    {selectedEvent.coordinates[1].toFixed(2)}°N, {selectedEvent.coordinates[0].toFixed(2)}°E
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </aside>

        </div>
    );
}
