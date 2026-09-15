import React, { useState, useEffect } from 'react';
import { audio } from '../services/audioService';

export default function TacticalHUD({
    activeLayers,
    toggleLayer,
    stats,
    selectedEntity,
    setSelectedEntity,
    trackedEntity,
    setTrackedEntity,
    onFlyToTarget,
    liveDispatches = [],
    activeTheaters = [],
    onSelectTheater,
}) {
    const [zuluTime, setZuluTime] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

    // Live UTC Clock
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0');
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            setZuluTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSoundToggle = () => {
        const enabled = audio.toggleSound();
        setSoundEnabled(enabled);
    };

    const handleTrackToggle = () => {
        audio.playBeep(1200, 0.06);
        if (trackedEntity) {
            setTrackedEntity(null);
        } else if (selectedEntity) {
            setTrackedEntity(selectedEntity);
        }
    };

    return (
        <>
            {/* ════════════════ TOP EXECUTIVE STATUS BAR ════════════════ */}
            <header className="tactical-top-bar glass-panel">
                <div className="top-bar-left">
                    <div className="brand-logo" onClick={() => audio.playRadarSweep()}>
                        <div className="radar-eye">
                            <div className="radar-sweep" />
                            <div className="radar-core">👁</div>
                        </div>
                        <div className="brand-text-block">
                            <span className="brand-title">GOD'S EYE</span>
                            <span className="brand-subtitle">GLOBAL SITUATIONAL INTELLIGENCE</span>
                        </div>
                    </div>

                    <div className="live-status-badge">
                        <span className="live-indicator-dot" />
                        <span>LIVE GLOBAL SURVEILLANCE</span>
                    </div>
                </div>

                <div className="top-bar-center">
                    <div className="zulu-clock-box">
                        <span className="zulu-icon">🌐</span>
                        <span className="zulu-time-display">{zuluTime || 'UTC CLOCK SYNC...'}</span>
                    </div>
                </div>

                <div className="top-bar-right">
                    <div className="domain-stats-pill">
                        <span className="stat-item" title="Satellites in Orbit">
                            <span className="icon">🛰️</span> {stats.satellites || 0} Sats
                        </span>
                        <span className="stat-separator">|</span>
                        <span className="stat-item" title="Aircraft in Transit">
                            <span className="icon">✈️</span> {stats.flights || 0} Flights
                        </span>
                        <span className="stat-separator">|</span>
                        <span className="stat-item" title="Active War Strikes & Battles">
                            <span className="icon">⚔️</span> {stats.conflicts || 0} Strikes
                        </span>
                        <span className="stat-separator">|</span>
                        <span className="stat-item" title="Thermal Anomalies (NASA FIRMS)">
                            <span className="icon">🔥</span> {stats.thermal || 0} Thermal
                        </span>
                        <span className="stat-separator">|</span>
                        <span className="stat-item" title="Earthquakes (USGS)">
                            <span className="icon">🌋</span> {stats.seismic || 0} Seismic
                        </span>
                    </div>

                    <button
                        className={`audio-btn ${soundEnabled ? 'sound-on' : 'sound-off'}`}
                        onClick={handleSoundToggle}
                        title={soundEnabled ? 'Audio cues enabled' : 'Audio muted'}
                    >
                        {soundEnabled ? '🔊 AUDIO' : '🔇 MUTED'}
                    </button>
                </div>
            </header>

            {/* ════════════════ LEFT SITUATIONAL MATRIX ════════════════ */}
            {isLeftCollapsed ? (
                <button
                    className="drawer-expand-btn glass-panel"
                    onClick={() => setIsLeftCollapsed(false)}
                    title="Expand Layers & Theaters Panel"
                >
                    ☰ SENSORS &amp; THEATERS
                </button>
            ) : (
                <aside className="left-c2-drawer glass-panel">
                    <div className="drawer-header">
                        <span className="drawer-title">GLOBAL SITUATION LAYERS</span>
                        <button
                            className="drawer-collapse-btn"
                            onClick={() => setIsLeftCollapsed(true)}
                            title="Collapse Panel for Unobstructed Globe View"
                        >
                            ◀
                        </button>
                    </div>

                {/* Layer Toggles */}
                <div className="layer-matrix-section">
                    <div className="section-subtitle">LAYER VISIBILITY</div>
                    <div className="layer-switches-grid">
                        <button
                            className={`layer-switch-btn ${activeLayers.satellites ? 'active' : ''}`}
                            onClick={() => toggleLayer('satellites')}
                        >
                            <span className="layer-icon">🛰️</span>
                            <span className="layer-name">Satellite Orbits</span>
                            <span className="layer-count">{stats.satellites}</span>
                        </button>

                        <button
                            className={`layer-switch-btn ${activeLayers.flights ? 'active' : ''}`}
                            onClick={() => toggleLayer('flights')}
                        >
                            <span className="layer-icon">✈️</span>
                            <span className="layer-name">Air Traffic Corridors</span>
                            <span className="layer-count">{stats.flights}</span>
                        </button>

                        <button
                            className={`layer-switch-btn ${activeLayers.conflicts ? 'active' : ''}`}
                            onClick={() => toggleLayer('conflicts')}
                        >
                            <span className="layer-icon">⚔️</span>
                            <span className="layer-name">Active Wars &amp; Strikes</span>
                            <span className="layer-count">{stats.conflicts}</span>
                        </button>

                        <button
                            className={`layer-switch-btn ${activeLayers.thermal ? 'active' : ''}`}
                            onClick={() => toggleLayer('thermal')}
                        >
                            <span className="layer-icon">🔥</span>
                            <span className="layer-name">Thermal Explosions (FIRMS)</span>
                            <span className="layer-count">{stats.thermal}</span>
                        </button>

                        <button
                            className={`layer-switch-btn ${activeLayers.seismic ? 'active' : ''}`}
                            onClick={() => toggleLayer('seismic')}
                        >
                            <span className="layer-icon">🌋</span>
                            <span className="layer-name">Earthquakes (USGS)</span>
                            <span className="layer-count">{stats.seismic}</span>
                        </button>
                    </div>
                </div>

                {/* Active Global Conflict Theaters */}
                <div className="theaters-section">
                    <div className="section-subtitle">
                        <span className="pulse-red-dot" /> ACTIVE CONFLICT THEATERS
                    </div>
                    <div className="theaters-list">
                        {activeTheaters.map((theater) => (
                            <button
                                key={theater.id}
                                className="theater-card-btn"
                                onClick={() => {
                                    audio.playBeep(1000);
                                    if (onSelectTheater) onSelectTheater(theater);
                                }}
                            >
                                <div className="theater-header-line">
                                    <span className="theater-status-tag">{theater.status}</span>
                                    <span className="theater-region">{theater.region}</span>
                                </div>
                                <div className="theater-title">{theater.name}</div>
                                <div className="theater-meta">
                                    <span>{(theater.belligerents || []).join(' vs ')}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>
            )}

            {/* ════════════════ RIGHT OBJECT DOSSIER / DETAILS ════════════════ */}
            <aside className={`right-telemetry-drawer glass-panel ${selectedEntity ? 'open' : ''}`}>
                <div className="telemetry-header">
                    <div className="telemetry-title-group">
                        <span className="telemetry-tag">OBJECT DOSSIER</span>
                        <span className="telemetry-subtag">
                            {selectedEntity?.entityType?.toUpperCase() || selectedEntity?.type?.toUpperCase() || 'DETAILS'}
                        </span>
                    </div>
                    <button
                        className="telemetry-close-btn"
                        onClick={() => { audio.playBeep(700); setSelectedEntity(null); setTrackedEntity(null); }}
                        title="Close Dossier"
                    >
                        ✕
                    </button>
                </div>

                {selectedEntity && (
                    <div className="telemetry-body animate-fade-in">
                        {/* Title & Classification Banner */}
                        <div className="target-name-banner">
                            <div className="target-id">
                                {selectedEntity.title || selectedEntity.name || selectedEntity.callsign || selectedEntity.id}
                            </div>
                            <div className="target-class">
                                {selectedEntity.entityType === 'satellite' && `🛰️ Orbital Asset · ${selectedEntity.purpose || selectedEntity.type}`}
                                {selectedEntity.entityType === 'flight' && `✈️ Aircraft · ${selectedEntity.aircraft || 'Commercial / Military'}`}
                                {selectedEntity.entityType === 'thermal' && `🔥 Thermal Anomaly · ${selectedEntity.confidence}`}
                                {selectedEntity.entityType === 'seismic' && `🌋 Seismic Event · M ${selectedEntity.mag}`}
                                {selectedEntity.type === 'missile_strike' && '🚀 Kinetic Missile Strike'}
                                {selectedEntity.type === 'battle' && '⚔️ Ground Engagement'}
                                {selectedEntity.type === 'deployment' && '🪖 Military Deployment'}
                            </div>
                        </div>

                        {/* Telemetry Metrics */}
                        <div className="telemetry-grid">
                            <div className="grid-cell">
                                <span className="cell-label">LATITUDE</span>
                                <span className="cell-value">
                                    {selectedEntity.lat !== undefined ? `${Number(selectedEntity.lat).toFixed(4)}°` : 'N/A'}
                                </span>
                            </div>
                            <div className="grid-cell">
                                <span className="cell-label">LONGITUDE</span>
                                <span className="cell-value">
                                    {selectedEntity.lon !== undefined ? `${Number(selectedEntity.lon).toFixed(4)}°` : 'N/A'}
                                </span>
                            </div>

                            {selectedEntity.altKm !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">ORBIT ALTITUDE</span>
                                    <span className="cell-value cyan">{selectedEntity.altKm} km</span>
                                </div>
                            )}

                            {selectedEntity.altFeet !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">BARO ALTITUDE</span>
                                    <span className="cell-value cyan">{selectedEntity.altFeet.toLocaleString()} ft</span>
                                </div>
                            )}

                            {selectedEntity.speedKms !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">ORBITAL VELOCITY</span>
                                    <span className="cell-value amber">{selectedEntity.speedKms} km/s</span>
                                </div>
                            )}

                            {selectedEntity.speedKnots !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">AIR SPEED</span>
                                    <span className="cell-value amber">{selectedEntity.speedKnots} kts</span>
                                </div>
                            )}

                            {selectedEntity.heading !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">HEADING</span>
                                    <span className="cell-value">{selectedEntity.heading}°</span>
                                </div>
                            )}

                            {selectedEntity.mag !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">MAGNITUDE</span>
                                    <span className="cell-value red">M {selectedEntity.mag}</span>
                                </div>
                            )}

                            {selectedEntity.depthKm !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">FOCAL DEPTH</span>
                                    <span className="cell-value">{selectedEntity.depthKm} km</span>
                                </div>
                            )}

                            {selectedEntity.frp !== undefined && (
                                <div className="grid-cell">
                                    <span className="cell-label">FIRE RADIATIVE POWER</span>
                                    <span className="cell-value red">{selectedEntity.frp} MW</span>
                                </div>
                            )}
                        </div>

                        {/* Situation Details */}
                        <div className="intelligence-narrative-section">
                            <div className="narrative-label">SITUATION SUMMARY</div>
                            <div className="narrative-text">
                                {selectedEntity.description || selectedEntity.purpose || selectedEntity.place || 'Real-time telemetry verified.'}
                            </div>

                            {selectedEntity.metadata && (
                                <div className="metadata-block">
                                    {Object.entries(selectedEntity.metadata).map(([k, v]) => (
                                        <div key={k} className="detail-row">
                                            <span className="row-key">{k.toUpperCase()}</span>
                                            <span className="row-val">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedEntity.operator && (
                                <div className="detail-row">
                                    <span className="row-key">OPERATOR</span>
                                    <span className="row-val">{selectedEntity.operator}</span>
                                </div>
                            )}
                            {selectedEntity.origin && selectedEntity.destination && (
                                <div className="detail-row">
                                    <span className="row-key">FLIGHT CORRIDOR</span>
                                    <span className="row-val cyan">{selectedEntity.origin} ➔ {selectedEntity.destination}</span>
                                </div>
                            )}
                            {selectedEntity.country && (
                                <div className="detail-row">
                                    <span className="row-key">STATE / NATION</span>
                                    <span className="row-val">{selectedEntity.country}</span>
                                </div>
                            )}
                        </div>

                        {/* Navigation Actions */}
                        <div className="telemetry-actions">
                            <button
                                className="action-btn fly-btn"
                                onClick={() => {
                                    audio.playBeep(1200);
                                    if (onFlyToTarget) onFlyToTarget(selectedEntity);
                                }}
                            >
                                🌐 FOCUS ON GLOBE
                            </button>

                            {(selectedEntity.entityType === 'satellite' || selectedEntity.entityType === 'flight') && (
                                <button
                                    className={`action-btn track-btn ${trackedEntity ? 'tracking' : ''}`}
                                    onClick={handleTrackToggle}
                                >
                                    {trackedEntity ? '🔓 STOP FOLLOWING' : '📍 FOLLOW IN REAL-TIME'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </aside>

            {/* ════════════════ BOTTOM SITUATION TICKER & THEATER JUMPERS ════════════════ */}
            <footer className="tactical-bottom-bar glass-panel">
                <div className="theater-jumpers-bar">
                    <span className="jumpers-label">HOTSPOTS:</span>
                    {activeTheaters.map((theater) => (
                        <button
                            key={theater.id}
                            className="theater-jump-pill"
                            onClick={() => {
                                audio.playBeep(1100);
                                if (onSelectTheater) onSelectTheater(theater);
                            }}
                            title={`Inspect ${theater.name}`}
                        >
                            <span className="pill-dot" />
                            {theater.name.split('(')[0].trim()}
                        </button>
                    ))}
                </div>

                <div className="intel-ticker-wrap">
                    <div className="ticker-label">
                        <span className="live-radar-dot" /> LIVE INTEL
                    </div>
                    <div className="ticker-viewport">
                        <div className="ticker-marquee">
                            {liveDispatches.map((d, i) => (
                                <span key={i} className="ticker-item">
                                    <strong className="ticker-source">[{d.source}]</strong> {d.text}
                                    <span className="ticker-bullet">◆</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
