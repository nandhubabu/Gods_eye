/**
 * GOD'S EYE — Active Global Conflicts & Strategic Flashpoints
 * Current operational theater data (2024–2026 real-world situation)
 */

export const ACTIVE_CONFLICT_ZONES = [
    {
        id: "ukraine-theater",
        name: "Eastern European Theater (Russo-Ukrainian War)",
        region: "Eastern Europe",
        belligerents: ["Ukraine", "Russian Federation"],
        status: "Active High-Intensity War",
        center: [36.5, 48.5],
        zoom: 5.5,
        summary: "High-intensity combined arms warfare along a 1,000km frontline, accompanied by strategic missile/drone strikes across infrastructure and Black Sea maritime zones.",
        occupiedRegions: ["Crimea", "Donetsk", "Luhansk", "Zaporizhzhia", "Kherson"],
        activeStrikes: [
            {
                id: "strike-ukr-1",
                type: "missile_strike",
                title: "Cruise Missile Salvo — Dnipro Energy Grid",
                sourceCoordinates: [40.2, 51.5], // Launch area inside Russia
                targetCoordinates: [35.04, 48.46], // Dnipro
                description: "Strategic missile strike involving Kh-101 cruise missiles targeting electrical substation and railway logistics.",
                date: "Today (Live)",
                metadata: {
                    weapon: "Kh-101 Air-Launched Cruise Missile",
                    interception: "Partially intercepted by Patriot PAC-3 battery",
                    target: "Critical Grid Infrastructure"
                }
            },
            {
                id: "strike-ukr-2",
                type: "missile_strike",
                title: "ATACMS Precision Strike — Sevastopol Naval Terminal",
                sourceCoordinates: [33.5, 46.8], // Kherson sector
                targetCoordinates: [33.52, 44.61], // Sevastopol Bay
                description: "Deep precision strike employing MGM-140 ATACMS cluster munitions against repair dock and radar installations.",
                date: "Today (Live)",
                metadata: {
                    weapon: "MGM-140 ATACMS Tactical Ballistic Missile",
                    effect: "Direct impact on radar assembly",
                    target: "Naval Infrastructure"
                }
            },
            {
                id: "strike-ukr-3",
                type: "missile_strike",
                title: "Iskander-M Ballistic Strike — Kharkiv Logistics Hub",
                sourceCoordinates: [36.6, 50.6], // Belgorod sector
                targetCoordinates: [36.23, 49.99], // Kharkiv
                description: "Quasi-ballistic Iskander-M trajectory hitting military staging area near northeastern beltway.",
                date: "Today (Live)",
                metadata: {
                    weapon: "9M723 Iskander-M Ballistic Missile",
                    flightTime: "3.2 minutes",
                    target: "Transit Warehouse"
                }
            },
            {
                id: "battle-ukr-1",
                type: "battle",
                title: "Pokrovsk Salient — Armored Assault & Trench Combat",
                coordinates: [37.18, 48.28],
                description: "Intense mechanized infantry clashes with continuous FPV drone interdiction and heavy glide-bomb (FAB-1500) sorties.",
                date: "Ongoing Contact",
                metadata: {
                    intensity: "Extreme",
                    sector: "Pokrovsk Tactical Axis",
                    tactics: "Gliding UMPK munitions + small-unit assaults"
                }
            },
            {
                id: "battle-ukr-2",
                type: "battle",
                title: "Chasiv Yar Canal Sector Defense",
                coordinates: [37.83, 48.59],
                description: "Elevated urban fighting along the Siverskyi Donets-Donbas canal boundary with heavy artillery barrage exchanges.",
                date: "Ongoing Contact",
                metadata: {
                    intensity: "High",
                    sector: "Bakhmut West Ridge",
                    tactics: "Artillery suppression & urban defense"
                }
            }
        ]
    },
    {
        id: "middle-east-theater",
        name: "Middle East Strategic Crisis & Levant Theater",
        region: "Middle East",
        belligerents: ["Israel", "Hezbollah", "Hamas", "Yemen Houthis", "Iran"],
        status: "Active Multi-Front Conflict",
        center: [35.5, 32.5],
        zoom: 6,
        summary: "Multi-front confrontation encompassing aerial strikes in Southern Lebanon and Gaza, ballistic missile exchanges, and naval interdictions across the Red Sea.",
        occupiedRegions: [],
        activeStrikes: [
            {
                id: "strike-me-1",
                type: "missile_strike",
                title: "Anti-Ship Ballistic Missile — Bab-el-Mandeb Strait",
                sourceCoordinates: [44.2, 15.3], // Sana'a, Yemen
                targetCoordinates: [43.4, 12.6], // Shipping lane
                description: "Houthi Qader anti-ship ballistic missile launched at commercial bulk carrier; intercepted by Arleigh Burke-class destroyer USS Mason.",
                date: "Today (Live)",
                metadata: {
                    weapon: "Qader Anti-Ship Ballistic Missile",
                    interception: "SM-2 / SM-6 naval kinetic intercept",
                    target: "Commercial Vessel (Panama Flag)"
                }
            },
            {
                id: "strike-me-2",
                type: "missile_strike",
                title: "Heavy Rocket Barrage — Upper Galilee / Meron",
                sourceCoordinates: [35.4, 33.3], // Southern Lebanon
                targetCoordinates: [35.43, 32.99], // Mount Meron Air Base
                description: "Salvo of 40 Katyusha and Falaq-2 heavy artillery rockets aimed at northern surveillance facility; Iron Dome and David's Sling active.",
                date: "Today (Live)",
                metadata: {
                    weapon: "Falaq-2 / Grad 122mm Rockets",
                    interceptors: "Iron Dome Tamir missiles",
                    target: "Air Traffic Surveillance Base"
                }
            },
            {
                id: "strike-me-3",
                type: "missile_strike",
                title: "Precision Stand-off Strike — Damascus Southern Perimeter",
                sourceCoordinates: [34.9, 32.8], // Golan airspace
                targetCoordinates: [36.28, 33.45], // Damascus
                description: "Delilah cruise missiles and Spice-250 glide bombs targeting arms transit depot and radar facility.",
                date: "Today (Live)",
                metadata: {
                    weapon: "Spice-250 Electro-Optical Guided Munitions",
                    effect: "Storage bunker neutralized",
                    target: "Weapons Transit Depot"
                }
            },
            {
                id: "battle-me-1",
                type: "battle",
                title: "Rafah / Philadelphi Corridor Security Operations",
                coordinates: [34.25, 31.29],
                description: "Ground clearance operations along the Egypt-Gaza border to neutralize subterranean smuggling networks and fortified positions.",
                date: "Ongoing Contact",
                metadata: {
                    intensity: "High",
                    sector: "Southern Gaza Buffer Zone",
                    forces: "IDF 162nd Division"
                }
            }
        ]
    },
    {
        id: "sudan-theater",
        name: "Sudan Civil War (SAF vs RSF)",
        region: "East Africa",
        belligerents: ["Sudanese Armed Forces (SAF)", "Rapid Support Forces (RSF)"],
        status: "Active High-Intensity Civil Conflict",
        center: [30.0, 15.0],
        zoom: 5.5,
        summary: "Country-wide conflict for control of the capital Khartoum, agricultural belts in Gezira, and critical regional capitals across North and South Darfur.",
        occupiedRegions: [],
        activeStrikes: [
            {
                id: "strike-sdn-1",
                type: "missile_strike",
                title: "Air Force Drone Strike — RSF Staging Base (Omdurman)",
                sourceCoordinates: [32.55, 15.6],
                targetCoordinates: [32.48, 15.65],
                description: "Bayraktar TB2 and Mohajer-6 UCAV strikes on motorized technical columns attempting to reinforce western bridgeheads.",
                date: "Today (Live)",
                metadata: {
                    weapon: "MAM-L Precision Guided Munitions",
                    effect: "Convoy disrupted",
                    target: "Armored Technicals"
                }
            },
            {
                id: "battle-sdn-1",
                type: "battle",
                title: "Siege of El Fasher (North Darfur Capital)",
                coordinates: [25.35, 13.63],
                description: "Prolonged artillery bombardment and mechanized assaults surrounding the last SAF stronghold in Darfur.",
                date: "Ongoing Siege",
                metadata: {
                    intensity: "Severe",
                    humanitarianImpact: "Critical food & medical cutoff",
                    sector: "North Darfur Central Command"
                }
            }
        ]
    },
    {
        id: "taiwan-strait",
        name: "Taiwan Strait & Western Pacific Flashpoint",
        region: "East Asia",
        belligerents: ["Taiwan / ROC", "China / PLA", "United States (Monitoring)"],
        status: "High Tension / Military Maneuvers",
        center: [120.5, 23.8],
        zoom: 6,
        summary: "Daily military pressure involving PLA J-16 fighters, H-6K bombers, and naval destroyers crossing the Median Line and entering Taiwan's southwestern ADIZ.",
        occupiedRegions: [],
        activeStrikes: [
            {
                id: "sortie-twn-1",
                type: "deployment",
                title: "Joint Combat Readiness Patrol — Southwestern ADIZ",
                coordinates: [119.2, 22.4],
                description: "Formation of 18 PLA combat aircraft (J-16, Su-30, KJ-500 AEW&C) accompanied by 6 naval vessels conducting simulated strike runs.",
                date: "Current Sortie",
                metadata: {
                    aircraftCount: "18 sorties detected",
                    response: "Taiwan ROCAF CAP patrols deployed & missile batteries on alert",
                    sector: "Bashi Channel Approach"
                }
            }
        ]
    },
    {
        id: "korean-peninsula",
        name: "Korean Peninsula DMZ & Ballistic Proving Ground",
        region: "East Asia",
        belligerents: ["DPRK (North Korea)", "ROK (South Korea)", "US Forces Korea"],
        status: "Active Strategic Stand-off",
        center: [127.5, 38.0],
        zoom: 6.5,
        summary: "Ongoing nuclear and hypersonic missile testing, GPS jamming along the Northern Limit Line, and frontline artillery mobilization.",
        occupiedRegions: [],
        activeStrikes: [
            {
                id: "strike-kor-1",
                type: "missile_strike",
                title: "Hypersonic Glide Vehicle Test Trajectory — Sea of Japan",
                sourceCoordinates: [125.7, 39.0], // Sunan launch area
                targetCoordinates: [134.5, 40.8], // East Sea impact zone
                description: "Intermediate-range solid-fuel ballistic missile test demonstrating boost-glide maneuverability outside Japanese EEZ.",
                date: "Recent Trajectory",
                metadata: {
                    weapon: "Hwasong-16B Hypersonic IRBM",
                    apogee: "101 km",
                    range: "1,000 km flight distance"
                }
            }
        ]
    }
];

// Flatten all active strikes and battles across all theaters for the global 3D layer
export const GLOBAL_ACTIVE_CONFLICT_EVENTS = ACTIVE_CONFLICT_ZONES.flatMap(theater =>
    (theater.activeStrikes || []).map(event => ({
        ...event,
        theaterName: theater.name,
        theaterId: theater.id,
    }))
);
