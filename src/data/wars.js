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
        participants: {
            // Axis
            DEU: 'axis', JPN: 'axis', ITA: 'axis', HUN: 'axis', ROU: 'axis', BGR: 'axis',
            // Allies
            GBR: 'allies', USA: 'allies', RUS: 'allies', UKR: 'allies', BLR: 'allies', POL: 'allies', FRA: 'allies', CHN: 'allies', AUS: 'allies', CAN: 'allies', NZL: 'allies', IND: 'allies', ZAF: 'allies', YUG: 'allies', GRC: 'allies', NLD: 'allies', BEL: 'allies', CZE: 'allies', NOR: 'allies'
        },
        captures: [
            {
                id: 'ww2-c1', type: 'capture', title: 'Germany occupies Poland', date: '1939-10-06',
                conqueror: 'DEU', conquered: ['POL'],
                description: 'After a 5-week campaign, Germany and the Soviet Union divided Poland. Germany annexed the west. Poland ceased to exist as a sovereign state.'
            },
            {
                id: 'ww2-c2', type: 'capture', title: 'Germany occupies Denmark & Norway', date: '1940-04-09',
                conqueror: 'DEU', conquered: ['DNK', 'NOR'],
                description: 'Operation Weserübung — Germany launched simultaneous invasions of Denmark and Norway to secure iron ore supply routes.'
            },
            {
                id: 'ww2-c3', type: 'capture', title: 'Germany occupies France & Low Countries', date: '1940-06-25',
                conqueror: 'DEU', conquered: ['FRA', 'BEL', 'NLD', 'LUX'],
                description: 'After a stunning 6-week campaign, France fell to Germany. The Low Countries were also overrun. Vichy France became a puppet state.'
            },
            {
                id: 'ww2-c4', type: 'capture', title: 'Germany occupies Yugoslavia & Greece', date: '1941-04-17',
                conqueror: 'DEU', conquered: ['YUG', 'GRC'],
                description: 'Axis powers invaded and occupied Yugoslavia and Greece during the Balkans Campaign, securing the southern flank before Operation Barbarossa.'
            },
        ],
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
        participants: {
            IRQ: 'aggressor', JOR: 'aggressor', // Some allied forces with Iraq
            KWT: 'defender', USA: 'allies', SAU: 'allies', GBR: 'allies', FRA: 'allies', EGY: 'allies', SYR: 'allies', MAR: 'allies', OMN: 'allies', PAK: 'allies', ARE: 'allies', QAT: 'allies', BGD: 'allies', CAN: 'allies'
        },
        captures: [
            // Iraq captures Kuwait (Aug 1990)
            {
                id: 'gw-c1', type: 'capture', title: 'Iraq occupies Kuwait', date: '1990-08-04',
                conqueror: 'IRQ', conquered: ['KWT'],
                description: 'Iraqi forces completed their takeover of Kuwait two days after the initial invasion, annexing it as the 19th province of Iraq.'
            },
            {
                id: 'gw-c2', type: 'capture', title: 'Kuwait liberated', date: '1991-02-27',
                conqueror: null, conquered: ['KWT'],
                description: 'Coalition forces liberated Kuwait after 100 hours of ground combat, restoring the Al-Sabah government.'
            },
        ],
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
        participants: {
            RUS: 'aggressor', BLR: 'aggressor',
            UKR: 'defender'
        },
        captures: [
            // Initial Russian advance — north, Kyiv axis (Feb–Mar 2022, later retreated)
            {
                id: 'ua-c1', type: 'capture', title: 'Russian forces advance on Kyiv', date: '2022-02-26',
                conqueror: 'RUS', conquered: [],
                description: 'Russian armoured columns pushed south from Belarus toward Kyiv. The advance was halted and fully reversed by April 2022.',
                region: { type: 'Polygon', coordinates: [[[29.0, 51.8], [31.8, 51.8], [31.8, 50.2], [29.0, 50.2], [29.0, 51.8]]] }
            },
            // Kherson oblast — south (Mar–Apr 2022)
            {
                id: 'ua-c2', type: 'capture', title: 'Russia captures Kherson Oblast', date: '2022-03-18',
                conqueror: 'RUS', conquered: [],
                description: 'Russian forces captured Kherson city and most of the oblast, establishing a land corridor to Crimea.',
                region: { type: 'Polygon', coordinates: [[[31.8, 47.2], [35.1, 47.2], [35.1, 45.0], [31.8, 45.0], [31.8, 47.2]]] }
            },
            // Mariupol / southern Donetsk coast (May 2022)
            {
                id: 'ua-c3', type: 'capture', title: 'Mariupol & Azov coast captured', date: '2022-05-20',
                conqueror: 'RUS', conquered: [],
                description: 'After a brutal siege, the last Ukrainian defenders at Azovstal surrendered. Russia now controlled the entire Azov coastline.',
                region: { type: 'Polygon', coordinates: [[[36.5, 47.3], [38.5, 47.3], [38.5, 46.8], [36.5, 46.8], [36.5, 47.3]]] }
            },
            // Luhansk oblast (Jun 2022)
            {
                id: 'ua-c4', type: 'capture', title: 'Russia captures Luhansk Oblast', date: '2022-06-25',
                conqueror: 'RUS', conquered: [],
                description: 'With the fall of Lysychansk, Russia took full control of Luhansk Oblast — its biggest territorial gain of 2022.',
                region: { type: 'Polygon', coordinates: [[[38.0, 49.5], [40.3, 49.5], [40.3, 48.0], [38.0, 48.0], [38.0, 49.5]]] }
            },
            // Partial Donetsk & Zaporizhzhia (annexation, Sep 2022)
            {
                id: 'ua-c5', type: 'capture', title: 'Russia annexes Donetsk & Zaporizhzhia regions', date: '2022-09-30',
                conqueror: 'RUS', conquered: [],
                description: 'Putin signed decrees illegally annexing Donetsk, Luhansk, Zaporizhzhia and Kherson oblasts, despite not controlling all of their territory.',
                region: {
                    type: 'MultiPolygon', coordinates: [
                        [[[37.0, 48.5], [39.8, 48.5], [39.8, 47.0], [37.0, 47.0], [37.0, 48.5]]],
                        [[[34.5, 47.6], [37.2, 47.6], [37.2, 46.7], [34.5, 46.7], [34.5, 47.6]]]
                    ]
                }
            },
            // Kyiv axis liberated — retreat (Apr 2022)
            {
                id: 'ua-c6', type: 'capture', title: 'Russia retreats from Kyiv axis', date: '2022-04-02',
                conqueror: null, conquered: [],
                description: 'Russia withdrew all forces from the Kyiv and Chernihiv oblasts, returning control to Ukraine. A major strategic failure.',
                region: { type: 'Polygon', coordinates: [[[29.0, 51.8], [31.8, 51.8], [31.8, 50.2], [29.0, 50.2], [29.0, 51.8]]] }
            },
            // Kherson city liberated (Nov 2022)
            {
                id: 'ua-c7', type: 'capture', title: 'Ukraine liberates Kherson city', date: '2022-11-11',
                conqueror: null, conquered: [],
                description: 'Ukrainian forces liberated Kherson city, the only regional capital Russia had captured. Russian forces retreated east of the Dnipro river.',
                region: { type: 'Polygon', coordinates: [[[32.2, 46.8], [33.5, 46.8], [33.5, 46.4], [32.2, 46.4], [32.2, 46.8]]] }
            },
        ],
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
        participants: {
            ISR: 'defender', // Assuming Hamas is not a separate ISO country in the map (usually PSE for Palestine). Let's use PSE as well.
            PSE: 'aggressor',
            IRN: 'aggressor', LBN: 'aggressor', // As involved actors
            USA: 'allies'
        },
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
        participants: {
            VNM: 'both', // Representing both North and South
            USA: 'allies', KOR: 'allies', AUS: 'allies', THA: 'allies', NZL: 'allies', PHL: 'allies',
            CHN: 'aggressor', RUS: 'aggressor' // Supported North
        },
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

    // ── Korean War ──────────────────────────────────────────────────────────
    {
        id: 'korean-war',
        name: 'Korean War',
        yearRange: '1950–1953',
        startDate: '1950-06-25',
        endDate: '1953-07-27',
        center: [127.5, 37.5],
        zoom: 6,
        description:
            'A conflict that began when North Korea invaded South Korea, drawing in a UN coalition led by the United States and later Chinese forces, ending in an armistice near the original border.',
        participants: {
            PRK: 'aggressor', CHN: 'axis',
            KOR: 'defender', USA: 'allies', GBR: 'allies', AUS: 'allies', CAN: 'allies', TUR: 'allies', FRA: 'allies',
        },
        captures: [
            {
                id: 'kw-c1', type: 'capture', title: 'North Korea overruns South', date: '1950-08-05',
                conqueror: 'PRK', conquered: ['KOR'],
                description: 'North Korean forces overwhelmed South Korean defenders, capturing 90% of the peninsula including Seoul, leaving only the Pusan Perimeter in the southeast.',
            },
            {
                id: 'kw-c2', type: 'capture', title: 'UN forces push into North Korea', date: '1950-10-19',
                conqueror: 'KOR', conquered: ['PRK'],
                description: 'After the Inchon landing, UN forces crossed the 38th parallel and advanced deep into North Korea, reaching near the Chinese border.',
            },
            {
                id: 'kw-c3', type: 'capture', title: 'Chinese intervention pushes UN back', date: '1950-12-15',
                conqueror: 'PRK', conquered: ['PRK'],
                description: '300,000 Chinese troops crossed the Yalu River, overwhelming UN forces and pushing them back south of the 38th parallel, recapturing Pyongyang and Seoul.',
            },
            {
                id: 'kw-c4', type: 'capture', title: 'Stalemate at 38th Parallel', date: '1951-07-10',
                conqueror: null, conquered: ['KOR', 'PRK'],
                description: 'After intense fighting, front lines stabilized near the original border. Armistice talks began, lasting two years while combat continued.',
            },
        ],
        events: [
            {
                id: 'kw-d1', type: 'deployment', title: 'North Korea invades South Korea',
                date: '1950-06-25', coordinates: [127.0, 37.9],
                description: 'At 4 AM, 75,000 North Korean soldiers of the Korean People\'s Army (KPA) poured across the 38th parallel, catching South Korean and US forces off guard.',
                metadata: { forces: '75,000 KPA troops', side: 'North Korea' },
            },
            {
                id: 'kw-d2', type: 'deployment', title: 'US troops rush to Korea from Japan',
                date: '1950-07-01', coordinates: [128.6, 35.1],
                description: 'Task Force Smith, the first US ground unit, arrived from Japan and engaged North Korean forces at Osan — only to be overwhelmed. More troops followed rapidly.',
                metadata: { forces: '~400 initial, 140,000 by year end', side: 'USA' },
            },
            {
                id: 'kw-b1', type: 'battle', title: 'Battle of Pusan Perimeter',
                date: '1950-08-04', coordinates: [128.9, 35.4],
                description: 'UN forces held a last defensive perimeter around the port of Pusan for 6 weeks, repelling repeated North Korean offensives until the Inchon breakout.',
                metadata: { casualties: '~60,000 UN, ~90,000 KPA', duration: 'Aug–Sep 1950', side: 'Both' },
            },
            {
                id: 'kw-b2', type: 'battle', title: 'Battle of Inchon',
                date: '1950-09-15', coordinates: [126.6, 37.47],
                description: 'MacArthur\'s bold amphibious counterattack at Inchon cut North Korean supply lines and encircled enemy forces, reversing the war in weeks.',
                metadata: { casualties: '~3,500 UN, ~35,000 KPA', duration: 'Sep 15–19, 1950', side: 'Both' },
            },
            {
                id: 'kw-b3', type: 'battle', title: 'Battle of Chosin Reservoir',
                date: '1950-11-27', coordinates: [127.4, 40.6],
                description: 'US Marines and Army troops were encircled by 120,000 Chinese forces at -40°F. The 17-day fighting withdrawal became one of the greatest military retreats in history.',
                metadata: { casualties: '~17,500 UN, ~60,000 Chinese', duration: 'Nov 27–Dec 13, 1950', side: 'Both' },
            },
            {
                id: 'kw-b4', type: 'battle', title: 'Battle of the Hook',
                date: '1952-10-26', coordinates: [126.7, 37.95],
                description: 'One of the fiercest battles of the static war phase. UN forces repelled a major Chinese assault on a strategic ridge near the Imjin River.',
                metadata: { casualties: '~7,000 Chinese, ~3,000 UN', duration: 'Oct–Nov 1952', side: 'Both' },
            },
            {
                id: 'kw-m1', type: 'missile_strike', title: 'UN bombing campaign — Pyongyang',
                date: '1950-07-13',
                sourceCoordinates: [128.9, 35.1], targetCoordinates: [125.74, 39.03],
                description: 'The US Air Force bombed Pyongyang and North Korean infrastructure within weeks of the war\'s start, beginning a sustained air campaign that would eventually destroy most North Korean cities.',
                metadata: { weapon: 'B-29 Superfortress bombers', casualties: 'Tens of thousands civilians' },
            },
            {
                id: 'kw-m2', type: 'missile_strike', title: 'Bombing of Yalu River bridges',
                date: '1950-11-08',
                sourceCoordinates: [128.6, 37.5], targetCoordinates: [124.4, 40.1],
                description: 'US aircraft bombed bridges over the Yalu River to cut off Chinese supply lines from Manchuria, though many planes were destroyed by MiG-15s in "MiG Alley".',
                metadata: { weapon: 'F-80, B-29, F-86 aircraft', casualties: 'Bridge infrastructure destroyed' },
            },
        ],
    },

    // ── Syrian Civil War ─────────────────────────────────────────────────────
    {
        id: 'syrian-civil-war',
        name: 'Syrian Civil War',
        yearRange: '2011–2020',
        startDate: '2011-03-15',
        endDate: '2020-03-05',
        center: [38.5, 35.0],
        zoom: 5.5,
        description:
            'A complex multi-sided civil war triggered by Arab Spring protests against Assad\'s government, drawing in ISIS, Kurdish forces, Russia, Turkey, the USA, and Iran across a decade of devastating conflict.',
        participants: {
            SYR: 'aggressor',    // Assad government
            RUS: 'allies',       // Allied with Assad
            IRN: 'allies',       // Allied with Assad
            IRQ: 'axis',         // ISIS control area
            USA: 'defender',     // Allied with SDF/rebels
            TUR: 'defender',     // Anti-Assad, anti-Kurd ops
        },
        captures: [
            {
                id: 'scw-c1', type: 'capture', title: 'ISIS captures eastern Syria & Iraq border', date: '2014-06-10',
                conqueror: 'IRQ', conquered: [],
                description: 'ISIS (the Islamic State) seized Mosul (Iraq) and rapidly captured vast swathes of eastern Syria and western Iraq, declaring a caliphate stretching across both countries.',
                region: { type: 'Polygon', coordinates: [[[37.0, 37.5], [42.5, 37.5], [42.5, 33.5], [37.0, 33.5], [37.0, 37.5]]] }
            },
            {
                id: 'scw-c2', type: 'capture', title: 'Rebels control northwest Syria', date: '2015-03-28',
                conqueror: 'USA', conquered: [],
                description: 'Opposition rebel groups (FSA and Jabhat al-Nusra) captured Idlib province and most of northwest Syria from government forces.',
                region: { type: 'Polygon', coordinates: [[[35.7, 36.8], [37.5, 36.8], [37.5, 35.5], [35.7, 35.5], [35.7, 36.8]]] }
            },
            {
                id: 'scw-c3', type: 'capture', title: 'Russia deploys; Assad regains ground', date: '2016-12-22',
                conqueror: 'SYR', conquered: [],
                description: 'With Russian air support, Syrian government forces recaptured all of Aleppo, the country\'s second-largest city, after a brutal siege — a major turning point of the war.',
                region: { type: 'Polygon', coordinates: [[[36.8, 36.6], [37.4, 36.6], [37.4, 36.0], [36.8, 36.0], [36.8, 36.6]]] }
            },
            {
                id: 'scw-c4', type: 'capture', title: 'US-backed SDF destroys ISIS caliphate', date: '2019-03-23',
                conqueror: null, conquered: [],
                description: 'US-backed Syrian Democratic Forces (SDF) liberated the last ISIS territory at Baghouz, ending the physical caliphate after years of grinding campaign.',
                region: { type: 'Polygon', coordinates: [[[37.0, 37.5], [42.5, 37.5], [42.5, 33.5], [37.0, 33.5], [37.0, 37.5]]] }
            },
        ],
        events: [
            {
                id: 'scw-d1', type: 'deployment', title: 'Arab Spring protests erupt in Daraa',
                date: '2011-03-15', coordinates: [36.1, 32.62],
                description: 'Pro-democracy protests inspired by the Arab Spring began in Daraa. Assad\'s violent crackdown on demonstrators sparked armed rebellion across the country.',
                metadata: { forces: 'Civilian protesters → armed militias', side: 'Opposition' },
            },
            {
                id: 'scw-d2', type: 'deployment', title: 'Russia begins military intervention',
                date: '2015-09-30', coordinates: [35.95, 35.4],
                description: 'Russia launched its military intervention in Syria from Khmeimim Air Base near Latakia, conducting airstrikes officially against ISIS but heavily targeting anti-Assad rebels.',
                metadata: { forces: '~4,000 Russian personnel, fighter jets, naval group', side: 'Russia/Assad' },
            },
            {
                id: 'scw-d3', type: 'deployment', title: 'US Special Forces support Kurdish SDF',
                date: '2015-10-30', coordinates: [41.2, 37.1],
                description: 'The US deployed advisors to work with the Syrian Democratic Forces (SDF), a Kurdish-led coalition, to fight ISIS in northeast Syria.',
                metadata: { forces: '~2,000 US troops at peak', side: 'USA/SDF' },
            },
            {
                id: 'scw-b1', type: 'battle', title: 'Siege of Aleppo',
                date: '2015-10-01', coordinates: [37.16, 36.2],
                description: 'The four-year battle for Syria\'s second city — one of the longest and most devastating urban sieges of the 21st century. Government forces finally retook it with Russian air support in December 2016.',
                metadata: { casualties: '31,000+ killed in Aleppo', duration: '2012–Dec 2016', side: 'Both' },
            },
            {
                id: 'scw-b2', type: 'battle', title: 'Battle of Raqqa — ISIS capital falls',
                date: '2017-06-06', coordinates: [38.99, 35.95],
                description: 'US-backed SDF forces besieged and captured Raqqa, the self-declared capital of the ISIS caliphate, in a brutal four-month battle that destroyed much of the city.',
                metadata: { casualties: '~3,000 ISIS, 1,000+ civilians', duration: 'Jun–Oct 2017', side: 'SDF/USA' },
            },
            {
                id: 'scw-b3', type: 'battle', title: 'Battle of Deir ez-Zor',
                date: '2017-09-09', coordinates: [40.14, 35.34],
                description: 'Syrian army and Russian forces broke the three-year ISIS siege of Deir ez-Zor city as the caliphate collapsed in the Euphrates Valley.',
                metadata: { casualties: 'Thousands over 3-year siege', duration: 'Sep–Nov 2017', side: 'Syria/Russia' },
            },
            {
                id: 'scw-m1', type: 'missile_strike', title: 'US cruise missile strike on Shayrat air base',
                date: '2017-04-07',
                sourceCoordinates: [34.0, 34.5], targetCoordinates: [36.9, 34.49],
                description: 'The United States fired 59 Tomahawk cruise missiles at Shayrat air base in retaliation for a Syrian chemical weapons attack on Khan Shaykhun that killed 87 civilians.',
                metadata: { casualties: 'Air base infrastructure', weapon: 'BGM-109 Tomahawk cruise missiles' },
            },
            {
                id: 'scw-m2', type: 'missile_strike', title: 'Russia strikes rebel positions from Caspian Sea',
                date: '2015-10-07',
                sourceCoordinates: [50.5, 41.5], targetCoordinates: [37.5, 35.5],
                description: 'Russia launched 26 cruise missiles from warships in the Caspian Sea, striking targets in Syria in a dramatic display of long-range power projection.',
                metadata: { weapon: 'Kalibr cruise missiles', casualties: 'Rebel command infrastructure' },
            },
            {
                id: 'scw-m3', type: 'missile_strike', title: 'US/UK/France strike — Operation Hammerfall',
                date: '2018-04-14',
                sourceCoordinates: [28.0, 35.5], targetCoordinates: [36.4, 33.55],
                description: 'Following the Douma chemical attack, the US, UK, and France launched over 100 missiles at Syrian chemical weapons facilities in Damascus and Homs.',
                metadata: { weapon: 'Tomahawk, Storm Shadow, SCALP missiles', casualties: 'CW facilities destroyed' },
            },
        ],
    },
];

export default WARS;
