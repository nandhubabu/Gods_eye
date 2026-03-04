/**
 * GOD'S EYE — Mock War Event Data
 *
 * Each war contains an array of events. Each event has:
 *  - id, type, title, date, description
 *  - coordinates (source / target for arcs, position for points)
 *  - metadata (casualties, forces, etc.)
 */

const WARS = [
    {
        id: 'ww2',
        name: 'World War II',
        yearRange: '1939–1945',
        startDate: '1939-09-01',
        endDate: '1945-09-02',
        center: [10, 50],
        zoom: 3,
        description:
            'The deadliest conflict in human history, involving more than 30 countries and resulting in 70–85 million fatalities.',
        events: [
            // ── Deployments ──
            {
                id: 'ww2-d1',
                type: 'deployment',
                title: 'German forces invade Poland',
                date: '1939-09-01',
                coordinates: [20.0, 52.0],
                description:
                    'Operation Fall Weiss — Germany launched a massive attack on Poland from the north, south, and west, marking the start of WWII.',
                metadata: { forces: '1,500,000 troops', side: 'Axis' },
            },
            {
                id: 'ww2-d2',
                type: 'deployment',
                title: 'British Expeditionary Force in France',
                date: '1939-10-01',
                coordinates: [-1.0, 49.5],
                description:
                    'Britain deployed the BEF to northern France to support French defensive positions along the Belgian border.',
                metadata: { forces: '390,000 troops', side: 'Allies' },
            },
            {
                id: 'ww2-d3',
                type: 'deployment',
                title: 'Soviet forces on the Eastern Front',
                date: '1941-06-22',
                coordinates: [37.6, 55.75],
                description:
                    'After Operation Barbarossa began, the Soviet Union mobilized millions of soldiers to defend Moscow and the western front.',
                metadata: { forces: '5,000,000+ troops', side: 'Allies' },
            },
            {
                id: 'ww2-d4',
                type: 'deployment',
                title: 'U.S. forces arrive in Britain',
                date: '1942-01-26',
                coordinates: [-1.5, 51.5],
                description:
                    'The first American troops arrived in the UK, beginning the massive buildup for the eventual D-Day invasion.',
                metadata: { forces: '2,000,000+ troops (by 1944)', side: 'Allies' },
            },
            {
                id: 'ww2-d5',
                type: 'deployment',
                title: 'Japanese forces in Southeast Asia',
                date: '1941-12-08',
                coordinates: [103.8, 1.35],
                description:
                    'Japan launched simultaneous invasions of Malaya, Hong Kong, the Philippines, and other territories across the Pacific.',
                metadata: { forces: '800,000+ troops', side: 'Axis' },
            },

            // ── Battles ──
            {
                id: 'ww2-b1',
                type: 'battle',
                title: 'Battle of Stalingrad',
                date: '1942-08-23',
                coordinates: [44.5, 48.7],
                description:
                    'One of the bloodiest battles in history. The Soviet defense of Stalingrad became the turning point of the Eastern Front.',
                metadata: { casualties: '~2,000,000 total', duration: 'Aug 1942 – Feb 1943', side: 'Both' },
            },
            {
                id: 'ww2-b2',
                type: 'battle',
                title: 'Battle of Midway',
                date: '1942-06-04',
                coordinates: [-177.4, 28.2],
                description:
                    'A decisive naval battle in the Pacific. The U.S. Navy sank four Japanese fleet carriers, shifting the balance of power.',
                metadata: { casualties: '~3,500', duration: 'Jun 4–7, 1942', side: 'Both' },
            },
            {
                id: 'ww2-b3',
                type: 'battle',
                title: 'D-Day — Normandy Landings',
                date: '1944-06-06',
                coordinates: [-0.86, 49.37],
                description:
                    'Operation Overlord — Allied forces launched the largest seaborne invasion in history on the beaches of Normandy, France.',
                metadata: { casualties: '~10,000 Allied on Day 1', duration: 'Jun 6, 1944 onward', side: 'Allies' },
            },
            {
                id: 'ww2-b4',
                type: 'battle',
                title: 'Battle of the Bulge',
                date: '1944-12-16',
                coordinates: [5.9, 50.3],
                description:
                    "Germany's last major offensive on the Western Front, aimed at splitting Allied forces in the Ardennes forest.",
                metadata: { casualties: '~186,000 total', duration: 'Dec 1944 – Jan 1945', side: 'Both' },
            },
            {
                id: 'ww2-b5',
                type: 'battle',
                title: 'Battle of Berlin',
                date: '1945-04-16',
                coordinates: [13.4, 52.52],
                description:
                    "The final major offensive in the European theater. Soviet forces encircled and captured Berlin, leading to Germany's surrender.",
                metadata: { casualties: '~350,000', duration: 'Apr 16 – May 2, 1945', side: 'Both' },
            },

            // ── Missile Strikes / Bombings (Arcs) ──
            {
                id: 'ww2-m1',
                type: 'missile_strike',
                title: 'V-2 Rocket attacks on London',
                date: '1944-09-08',
                sourceCoordinates: [6.1, 52.5],
                targetCoordinates: [-0.12, 51.5],
                description:
                    'Germany launched V-2 ballistic missiles from the Netherlands, striking London and southeast England — the first long-range ballistic missile attacks in history.',
                metadata: { casualties: '~2,754 killed in London', weapon: 'V-2 Rocket' },
            },
            {
                id: 'ww2-m2',
                type: 'missile_strike',
                title: 'Atomic bombing of Hiroshima',
                date: '1945-08-06',
                sourceCoordinates: [141.98, 11.35],
                targetCoordinates: [132.45, 34.39],
                description:
                    'The United States dropped the atomic bomb "Little Boy" on Hiroshima from the B-29 Enola Gay, launched from Tinian island.',
                metadata: { casualties: '~140,000', weapon: 'Little Boy (Uranium bomb)' },
            },
            {
                id: 'ww2-m3',
                type: 'missile_strike',
                title: 'Atomic bombing of Nagasaki',
                date: '1945-08-09',
                sourceCoordinates: [141.98, 11.35],
                targetCoordinates: [129.87, 32.77],
                description:
                    "Three days after Hiroshima, a second atomic bomb \"Fat Man\" was dropped on Nagasaki, leading to Japan's unconditional surrender.",
                metadata: { casualties: '~70,000', weapon: 'Fat Man (Plutonium bomb)' },
            },
            {
                id: 'ww2-m4',
                type: 'missile_strike',
                title: 'Blitz — bombing of London',
                date: '1940-09-07',
                sourceCoordinates: [8.0, 50.0],
                targetCoordinates: [-0.12, 51.5],
                description:
                    'The German Luftwaffe began sustained strategic bombing of London and other British cities in an attempt to break British morale.',
                metadata: { casualties: '~43,000 civilians killed', weapon: 'Luftwaffe bombers' },
            },
            {
                id: 'ww2-m5',
                type: 'missile_strike',
                title: 'Bombing of Dresden',
                date: '1945-02-13',
                sourceCoordinates: [-1.0, 52.0],
                targetCoordinates: [13.74, 51.05],
                description:
                    'Allied forces conducted a controversial strategic bombing of Dresden, causing a firestorm that destroyed much of the city center.',
                metadata: { casualties: '~25,000', weapon: 'RAF & USAAF bombers' },
            },
        ],
    },

    {
        id: 'gulf-war',
        name: 'Gulf War',
        yearRange: '1990–1991',
        startDate: '1990-08-02',
        endDate: '1991-02-28',
        center: [45, 30],
        zoom: 5,
        description:
            "A coalition of 35 nations led by the United States fought against Iraq in response to Iraq's invasion and annexation of Kuwait.",
        events: [
            {
                id: 'gw-d1',
                type: 'deployment',
                title: 'U.S. forces deploy to Saudi Arabia',
                date: '1990-08-07',
                coordinates: [46.7, 24.7],
                description:
                    'Operation Desert Shield — The U.S. began deploying hundreds of thousands of troops to Saudi Arabia to deter further Iraqi aggression.',
                metadata: { forces: '700,000 coalition troops', side: 'Coalition' },
            },
            {
                id: 'gw-d2',
                type: 'deployment',
                title: 'Iraqi forces occupy Kuwait',
                date: '1990-08-02',
                coordinates: [47.97, 29.37],
                description:
                    'Iraq invaded Kuwait with 100,000 troops and 700 tanks, seizing control of the country within two days.',
                metadata: { forces: '100,000 troops', side: 'Iraq' },
            },
            {
                id: 'gw-b1',
                type: 'battle',
                title: 'Battle of Khafji',
                date: '1991-01-29',
                coordinates: [48.5, 28.4],
                description:
                    'The first major ground engagement of the war. Iraqi forces briefly occupied the Saudi coastal town of Khafji before being repelled.',
                metadata: { casualties: '~100 coalition, ~300 Iraqi', duration: 'Jan 29–Feb 1, 1991', side: 'Both' },
            },
            {
                id: 'gw-b2',
                type: 'battle',
                title: '100 Hour Ground War',
                date: '1991-02-24',
                coordinates: [46.5, 30.0],
                description:
                    'Operation Desert Sabre — the coalition ground assault that liberated Kuwait in just 100 hours with overwhelming armored force.',
                metadata: { casualties: '~300 coalition, ~20,000 Iraqi', duration: 'Feb 24–28, 1991', side: 'Both' },
            },
            {
                id: 'gw-m1',
                type: 'missile_strike',
                title: 'Scud missile attacks on Israel',
                date: '1991-01-18',
                sourceCoordinates: [44.0, 33.3],
                targetCoordinates: [34.8, 32.1],
                description:
                    'Iraq launched Scud missiles at Israel to provoke Israeli retaliation and fracture the Arab coalition against Iraq.',
                metadata: { casualties: '~74 (indirect)', weapon: 'Al-Hussein Scud' },
            },
            {
                id: 'gw-m2',
                type: 'missile_strike',
                title: 'Coalition air campaign — Baghdad',
                date: '1991-01-17',
                sourceCoordinates: [46.7, 24.7],
                targetCoordinates: [44.36, 33.31],
                description:
                    'Operation Desert Storm began with massive air strikes against Baghdad, targeting government and military infrastructure.',
                metadata: { casualties: 'Classified', weapon: 'Tomahawk cruise missiles, F-117 stealth bombers' },
            },
            {
                id: 'gw-m3',
                type: 'missile_strike',
                title: 'Scud attack on Dhahran barracks',
                date: '1991-02-25',
                sourceCoordinates: [44.0, 33.3],
                targetCoordinates: [50.1, 26.27],
                description:
                    'A Scud missile struck U.S. Army barracks in Dhahran, Saudi Arabia — the deadliest single attack on coalition forces.',
                metadata: { casualties: '28 killed, 98 wounded', weapon: 'Al-Hussein Scud' },
            },
        ],
    },

    {
        id: 'ukraine-russia',
        name: 'Russia–Ukraine War',
        yearRange: '2022–Present',
        startDate: '2022-02-24',
        endDate: '2025-12-31',
        center: [35, 49],
        zoom: 5.5,
        description:
            "A major armed conflict triggered by Russia's full - scale invasion of Ukraine on 24 February 2022, the largest military conflict in Europe since WWII.",
        events: [
            {
                id: 'ua-d1',
                type: 'deployment',
                title: 'Russian forces invade from multiple axes',
                date: '2022-02-24',
                coordinates: [30.5, 50.45],
                description:
                    'Russia launched a multi-pronged invasion of Ukraine from Belarus, Russia, and Crimea, aiming to rapidly capture Kyiv.',
                metadata: { forces: '~190,000 troops initially', side: 'Russia' },
            },
            {
                id: 'ua-d2',
                type: 'deployment',
                title: 'Ukrainian Territorial Defense mobilized',
                date: '2022-02-25',
                coordinates: [30.52, 50.45],
                description:
                    'Ukraine activated its Territorial Defense Forces and began distributing weapons to civilian volunteers across the country.',
                metadata: { forces: '~900,000 total armed forces', side: 'Ukraine' },
            },
            {
                id: 'ua-b1',
                type: 'battle',
                title: 'Battle of Kyiv',
                date: '2022-02-25',
                coordinates: [30.52, 50.45],
                description:
                    'Russian forces advanced on Kyiv from the north. Fierce Ukrainian resistance, including at Hostomel airport, halted the advance. Russia withdrew from the Kyiv axis in April 2022.',
                metadata: { casualties: 'Thousands on both sides', duration: 'Feb–Apr 2022', side: 'Both' },
            },
            {
                id: 'ua-b2',
                type: 'battle',
                title: 'Siege of Mariupol',
                date: '2022-03-01',
                coordinates: [37.55, 47.1],
                description:
                    'Russian forces besieged the port city of Mariupol for over two months. Ukrainian forces, including the Azov Regiment, made a last stand at the Azovstal steel plant.',
                metadata: { casualties: '~25,000+ civilian deaths', duration: 'Feb–May 2022', side: 'Both' },
            },
            {
                id: 'ua-b3',
                type: 'battle',
                title: 'Battle of Bakhmut',
                date: '2022-08-01',
                coordinates: [38.0, 48.6],
                description:
                    'The longest and bloodiest battle of the war. Russian forces, including Wagner Group mercenaries, fought for months to capture the city.',
                metadata: { casualties: 'Tens of thousands', duration: 'Aug 2022 – May 2023', side: 'Both' },
            },
            {
                id: 'ua-m1',
                type: 'missile_strike',
                title: 'Missile strike on Kramatorsk railway station',
                date: '2022-04-08',
                coordinates: [37.6, 48.73],
                description:
                    'A Russian Tochka-U missile struck the Kramatorsk railway station, where thousands of civilians were waiting to evacuate.',
                metadata: { casualties: '~60 killed, 100+ wounded', weapon: 'Tochka-U ballistic missile' },
            },
            {
                id: 'ua-m2',
                type: 'missile_strike',
                title: 'Cruise missile strikes on Kyiv',
                date: '2022-10-10',
                sourceCoordinates: [45.0, 55.0],
                targetCoordinates: [30.52, 50.45],
                description:
                    'Russia launched a massive wave of cruise missile and drone strikes targeting Ukrainian energy infrastructure across the country.',
                metadata: { casualties: '19 killed, 100+ wounded', weapon: 'Kalibr & Kh-101 cruise missiles' },
            },
            {
                id: 'ua-m3',
                type: 'missile_strike',
                title: 'Strike on Dnipro apartment building',
                date: '2023-01-14',
                sourceCoordinates: [45.0, 55.0],
                targetCoordinates: [35.04, 48.46],
                description:
                    'A Russian Kh-22 missile struck a residential apartment building in Dnipro, causing catastrophic collapse and civilian casualties.',
                metadata: { casualties: '46 killed, 80+ wounded', weapon: 'Kh-22 anti-ship missile' },
            },
        ],
    },
    {
        id: 'israel-hamas',
        name: 'Israel–Hamas War',
        yearRange: '2023–Present',
        startDate: '2023-10-07',
        endDate: '2025-12-31',
        center: [34.78, 31.5],
        zoom: 7.5,
        description:
            "An ongoing major armed conflict in the Levant, triggered by a massive Hamas-led attack on Israel, resulting in an Israeli ground invasion of the Gaza Strip.",
        events: [
            {
                id: 'ih-d1',
                type: 'deployment',
                title: 'Hamas initiates Operation Al-Aqsa Flood',
                date: '2023-10-07',
                coordinates: [34.35, 31.42],
                description:
                    "Thousands of Palestinian militants breached the Gaza–Israel barrier, attacking Israeli military bases and civilian communities.",
                metadata: { forces: '~3,000 militants', side: 'Hamas' },
            },
            {
                id: 'ih-m1',
                type: 'missile_strike',
                title: 'Initial Rocket Barrage on Israel',
                date: '2023-10-07',
                sourceCoordinates: [34.46, 31.5],
                targetCoordinates: [34.78, 32.08],
                description:
                    "Hamas launched thousands of rockets (reported 3,000 to 5,000) over a few hours, overwhelming the Iron Dome defense system.",
                metadata: { casualties: 'Dozens from rockets alone', weapon: 'Qassam and unguided rockets' },
            },
            {
                id: 'ih-b1',
                type: 'battle',
                title: 'Battle of Sderot',
                date: '2023-10-07',
                coordinates: [34.59, 31.52],
                description:
                    "Militants infiltrated the Israeli city of Sderot and took over the local police station, leading to a multi-day firefight with the IDF.",
                metadata: { casualties: '~70 Israelis killed', duration: 'Oct 7–8, 2023', side: 'Both' },
            },
            {
                id: 'ih-d2',
                type: 'deployment',
                title: 'IDF Ground Invasion of Gaza',
                date: '2023-10-27',
                coordinates: [34.46, 31.53],
                description:
                    "Following heavy airstrikes, Israeli ground forces invaded the Gaza Strip with the stated goal of destroying Hamas's military capabilities.",
                metadata: { forces: 'Initial force of tens of thousands', side: 'Israel' },
            },
            {
                id: 'ih-b2',
                type: 'battle',
                title: 'Siege of Gaza City / Al-Shifa Hospital',
                date: '2023-11-02',
                coordinates: [34.46, 31.5],
                description:
                    "IDF forces encircled Gaza City and eventually raided Al-Shifa Hospital, claiming it was used as a Hamas command center.",
                metadata: { casualties: 'Heavy civilian and combatant casualties', duration: 'Nov 2023', side: 'Both' },
            },
            {
                id: 'ih-m2',
                type: 'missile_strike',
                title: 'Iranian Missile Attack on Israel',
                date: '2024-04-13',
                sourceCoordinates: [51.38, 35.68],
                targetCoordinates: [35.21, 31.76],
                description:
                    "Iran launched over 300 drones and missiles at Israel in retaliation for a strike on its consulate in Damascus. Most were intercepted.",
                metadata: { casualties: 'Minor injuries', weapon: 'Shahed drones, cruise/ballistic missiles' },
            },
        ],
    },
    {
        id: 'vietnam-war',
        name: 'Vietnam War',
        yearRange: '1955–1975',
        startDate: '1955-11-01',
        endDate: '1975-04-30',
        center: [106, 16],
        zoom: 5,
        description:
            "A prolonged conflict in Southeast Asia pitting North Vietnam against South Vietnam and its principal ally, the United States. A major Cold War proxy war.",
        events: [
            {
                id: 'vw-d1',
                type: 'deployment',
                title: 'Gulf of Tonkin Resolution',
                date: '1964-08-07',
                coordinates: [107.5, 19.5],
                description:
                    "Following naval incidents in the Gulf of Tonkin, the US Congress granted President Johnson authority to escalate American military involvement.",
                metadata: { forces: 'Led to massive US troop buildup', side: 'USA / South Vietnam' },
            },
            {
                id: 'vw-d2',
                type: 'deployment',
                title: 'First US Combat Troops Arrive (Da Nang)',
                date: '1965-03-08',
                coordinates: [108.2, 16.06],
                description:
                    "3,500 US Marines landed at Da Nang, marking the first commitment of American combat troops to the Vietnam War.",
                metadata: { forces: '3,500 Marines', side: 'USA' },
            },
            {
                id: 'vw-m1',
                type: 'missile_strike',
                title: 'Operation Rolling Thunder Begins',
                date: '1965-03-02',
                sourceCoordinates: [108.2, 16.06],
                targetCoordinates: [105.8, 21.02],
                description:
                    "A gradual and sustained aerial bombardment campaign conducted by the US against North Vietnam to pressure them into halting support for the Viet Cong.",
                metadata: { casualties: 'Tens of thousands (estimated)', weapon: 'Strategic bombers (B-52s, F-105s)' },
            },
            {
                id: 'vw-b1',
                type: 'battle',
                title: 'Battle of Ia Drang',
                date: '1965-11-14',
                coordinates: [107.7, 13.57],
                description:
                    "The first major engagement between regular US Army forces and the People's Army of Vietnam (PAVN). Pioneered the use of helicopter air mobility.",
                metadata: { casualties: '~300 US, ~1,500 PAVN', duration: 'Nov 14–18, 1965', side: 'Both' },
            },
            {
                id: 'vw-b2',
                type: 'battle',
                title: 'The Tet Offensive',
                date: '1968-01-30',
                coordinates: [106.66, 10.76],
                description:
                    "A massive surprise attack by the Viet Cong and North Vietnamese covering over 100 cities. A military failure but a massive political victory that shocked the American public.",
                metadata: { casualties: '~45,000 PAVN/VC, ~4,300 US, ~5,000 ARVN', duration: 'Jan 30 – Jun 8, 1968', side: 'Both' },
            },
            {
                id: 'vw-m2',
                type: 'missile_strike',
                title: 'Operation Linebacker II (Christmas Bombings)',
                date: '1972-12-18',
                sourceCoordinates: [144.92, 13.58],
                targetCoordinates: [105.8, 21.02],
                description:
                    "The heaviest bomber strikes of the war, intended to force North Vietnam to sign the Paris Peace Accords.",
                metadata: { casualties: '1,624 civilians killed', weapon: 'B-52 Stratofortresses' },
            },
            {
                id: 'vw-d3',
                type: 'deployment',
                title: 'Fall of Saigon',
                date: '1975-04-30',
                coordinates: [106.66, 10.76],
                description:
                    "North Vietnamese forces captured Saigon, marking the end of the Vietnam War and the reunification of the country.",
                metadata: { forces: 'PAVN Victory', side: 'North Vietnam' },
            },
        ],
    },
];

export default WARS;
