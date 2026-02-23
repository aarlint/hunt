const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'hunt.db');
require('fs').mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    resident INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    habitat TEXT,
    best_areas_western_mt TEXT,
    typical_weight TEXT,
    hunting_tips TEXT,
    recommended_calibers TEXT,
    season_type TEXT
  );

  CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    species_name TEXT,
    category TEXT NOT NULL,
    weapon_type TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS hunting_spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    hunting_districts TEXT,
    access_type TEXT,
    description TEXT,
    tips TEXT,
    difficulty TEXT,
    lat REAL,
    lng REAL
  );

  CREATE TABLE IF NOT EXISTS spot_species (
    spot_id INTEGER REFERENCES hunting_spots(id),
    species_id INTEGER REFERENCES species(id),
    PRIMARY KEY (spot_id, species_id)
  );

  CREATE TABLE IF NOT EXISTS tags_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    deadline TEXT,
    type TEXT,
    resident_cost TEXT,
    nonresident_cost TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month INTEGER,
    title TEXT,
    content TEXT
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    species_id INTEGER REFERENCES species(id),
    spot_id INTEGER REFERENCES hunting_spots(id),
    date TEXT,
    notes TEXT,
    success INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed species
const speciesCount = db.prepare('SELECT COUNT(*) as c FROM species').get().c;
if (speciesCount === 0) {
  const insertSpecies = db.prepare(`INSERT INTO species (name, category, description, habitat, best_areas_western_mt, typical_weight, hunting_tips, recommended_calibers, season_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const species = [
    ['Whitetail Deer', 'big_game', 'Most popular game animal in Montana. Found in river bottoms, agricultural areas, and forest edges.', 'River bottoms, coulees, agricultural edges, mixed conifer forests', 'Bitterroot Valley, Blackfoot Valley, Clark Fork corridor', '120-200 lbs', 'Focus on river bottoms and ag land edges. Morning and evening movement patterns. Rattling works well during rut (Nov).', '.270 Win, .30-06, .308 Win, 6.5 Creedmoor', 'general'],
    ['Mule Deer', 'big_game', 'Iconic Western deer known for stotting gait and large ears. Prefer more open, rugged terrain than whitetails.', 'Sagebrush hills, mountain slopes, breaks, open timber', 'Sapphire Mountains, Garnet Range, Flint Creek Range', '150-250 lbs', 'Glass south-facing slopes in early morning. Bucks move to higher elevations in early season. Check saddles and benches.', '.270 Win, .30-06, 7mm Rem Mag, 6.5 Creedmoor', 'general'],
    ['Elk', 'big_game', 'Montana\'s premier big game animal. Western Montana holds excellent populations in mountainous terrain.', 'Mountain meadows, dark timber, alpine basins, clearcuts', 'Bob Marshall Wilderness, Lolo NF, Rattlesnake, Seeley Lake', '500-700 lbs (bull)', 'Bugle during archery season. Move to dark timber during rifle. Target wallows and travel corridors. Physical fitness is key.', '.30-06, .300 Win Mag, .338 Win Mag, 7mm Rem Mag', 'general'],
    ['Moose', 'big_game', 'Largest member of deer family. Limited permits available through special drawing.', 'Willow bottoms, riparian areas, subalpine lakes, beaver ponds', 'Seeley Lake, upper Blackfoot, North Fork Flathead', '800-1200 lbs (bull)', 'Focus on willow flats near water. Cow calling effective during rut (Sep-Oct). Hunt early morning and late evening.', '.300 Win Mag, .338 Win Mag, .375 H&H', 'special_permit'],
    ['Black Bear', 'predator', 'Common throughout Western Montana forests. Spring and fall seasons available.', 'Mixed conifer forests, berry patches, riparian corridors', 'Bitterroot NF, Lolo NF, Cabinet Mountains', '150-350 lbs', 'Spot and stalk on avalanche chutes in spring. Hunt berry patches in fall. Bait not legal in Montana.', '.30-06, .308 Win, .45-70 Govt', 'general'],
    ['Mountain Lion', 'predator', 'Elusive predator hunted primarily with hounds during winter. Quota-managed.', 'Rimrock, rugged canyons, dense timber near deer/elk habitat', 'Bitterroot, Sapphires, Blackfoot Valley', '100-180 lbs (tom)', 'Most successful with trained hounds. Hunt after fresh snow for tracking. Solo spot-and-stalk possible but difficult.', '.243 Win, .270 Win, any centerfire', 'quota'],
    ['Wolf', 'predator', 'Reintroduced predator with regulated hunting seasons. Challenging to hunt.', 'Wilderness areas, forest edges, following elk herds', 'Bob Marshall, Ninemile, Lolo area', '80-130 lbs', 'Use elk or deer calls. Hunt travel corridors between packs. Extremely wary — scent control critical. Electronic calls legal.', '.270 Win, .30-06, .300 Win Mag', 'general'],
    ['Bighorn Sheep', 'big_game', 'Trophy animal requiring special permit. Limited opportunities in rugged mountain terrain.', 'Alpine ridges, rocky cliffs, mountain meadows above treeline', 'Rock Creek, upper Bitterroot, Mission Mountains', '175-275 lbs (ram)', 'Physical conditioning essential. Glass extensively before committing to stalk. Weather can change rapidly at elevation.', '6.5 Creedmoor, .270 Win, .280 Rem', 'special_permit'],
    ['Mountain Goat', 'big_game', 'Another special permit species found in the most rugged alpine terrain.', 'Steep cliffs, alpine peaks, rocky outcrops above treeline', 'Mission Mountains, Cabinet Mountains, Absarokas', '150-300 lbs (billy)', 'Extremely steep terrain — safety first. Goats are less wary than sheep but terrain is more dangerous. Go slow.', '6.5 Creedmoor, .270 Win, .280 Rem', 'special_permit'],
    ['Pronghorn', 'big_game', 'Fastest land animal in North America. Found in open grasslands, limited in Western MT.', 'Open grasslands, sagebrush flats, prairie', 'Ovando/Helmville area, upper Blackfoot', '90-140 lbs (buck)', 'Spot and stalk or use decoys. Long-range shooting common. Archery hunters can use blinds over water.', '6.5 Creedmoor, .270 Win, .25-06 Rem', 'general'],
    ['Wild Turkey', 'bird', 'Merriam\'s subspecies found in Western Montana ponderosa pine forests.', 'Ponderosa pine forests, river bottoms, agricultural edges', 'Bitterroot Valley, lower Clark Fork, Blackfoot', '16-24 lbs (tom)', 'Spring season: call toms with box or slate calls. Set up against a wide tree. Pattern shotgun beforehand.', '12ga with #4-6 shot, .410 bore', 'general'],
    ['Pheasant', 'bird', 'Ring-necked pheasant found in agricultural areas. Walk-up hunting with dogs.', 'Agricultural fields, CRP land, cattail sloughs, river bottoms', 'Blackfoot Valley, Bitterroot Valley, upper Clark Fork', '2-3 lbs', 'Hunt with a good pointing or flushing dog. Focus on cover edges. Late season birds hold tighter in heavy cover.', '12ga or 20ga, #4-6 shot', 'general'],
    ['Hungarian Partridge', 'bird', 'Small upland bird found in grasslands and agricultural edges. Fast flyers.', 'Grasslands, stubble fields, weedy fence lines', 'Blackfoot Valley, Ovando, Helmville area', '0.8-1 lb', 'Hunt covey edges in short grass. Birds hold well for dogs. Mark where covey flushes and follow singles.', '20ga or 28ga, #6-7.5 shot', 'general'],
    ['Blue Grouse', 'bird', 'Large forest grouse found in conifer forests, especially at higher elevations.', 'Subalpine fir forests, mountain ridges, berry slopes', 'Rattlesnake, Lolo NF, Bitterroot NF', '2-3 lbs', 'Hunt ridgetops and south-facing slopes in early season. Birds move to conifers as snow arrives. Often sit tight.', '20ga, #6-7.5 shot', 'general'],
    ['Ruffed Grouse', 'bird', 'Classic forest grouse found in dense deciduous and mixed forests.', 'Aspen groves, alder thickets, riparian corridors', 'Seeley Lake, upper Blackfoot, Rattlesnake', '1.2-1.8 lbs', 'Hunt aspen edges and alder bottoms. Listen for drumming in spring. Quick shots — they flush fast through timber.', '20ga or 28ga, #6-7.5 shot', 'general'],
    ['Spruce Grouse', 'bird', 'Tamest of forest grouse, found in dense spruce and fir forests.', 'Dense spruce-fir forests, subalpine areas', 'Seeley Lake, upper Lolo Creek, Bob Marshall edges', '1-1.5 lbs', 'Often encountered while elk hunting. Very tame — sometimes called "fool hens." Hunt dense conifer stands.', '20ga, #6-7.5 shot', 'general'],
    ['Mallard', 'waterfowl', 'Most common and popular duck species in Montana. Found on rivers, lakes, and ponds.', 'Rivers, ponds, lakes, agricultural fields, wetlands', 'Clark Fork, Bitterroot River, Flathead Lake area', '2-3 lbs', 'Decoy spreads on rivers and ponds. Jump shooting on small creeks. Scout feeding fields for pass shooting.', '12ga, #2-4 steel shot', 'general'],
    ['Canada Goose', 'waterfowl', 'Large migratory and resident geese. Field hunting and water setups both productive.', 'Agricultural fields, rivers, large lakes', 'Flathead Lake, Bitterroot Valley fields, Blackfoot River', '8-14 lbs', 'Field decoy spreads with layout blinds. Scout feeding patterns day before. Flagging helps bring birds in.', '12ga, #BB-2 steel shot', 'general'],
    ['Mourning Dove', 'bird', 'Fast-flying migratory bird. Early September opener provides warm-weather shooting.', 'Agricultural fields, water holes, power lines, fence rows', 'Bitterroot Valley, Missoula area, Blackfoot Valley', '4-6 oz', 'Set up near water holes or harvested grain fields late afternoon. Pass shooting. Bring lots of shells.', '12ga or 20ga, #7.5-8 shot', 'general'],
  ];

  const insertMany = db.transaction(() => {
    for (const s of species) insertSpecies.run(...s);
  });
  insertMany();
}

// Seed seasons
const seasonCount = db.prepare('SELECT COUNT(*) as c FROM seasons').get().c;
if (seasonCount === 0) {
  const insertSeason = db.prepare(`INSERT INTO seasons (name, species_name, category, weapon_type, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  const seasons = [
    ['Archery Deer/Elk', 'Deer, Elk', 'big_game', 'Archery', '2025-09-06', '2025-10-19', 'General archery season for deer and elk'],
    ['General Rifle Deer/Elk', 'Deer, Elk', 'big_game', 'Rifle', '2025-10-25', '2025-11-30', 'Five-week general rifle season'],
    ['Antelope Archery', 'Pronghorn', 'big_game', 'Archery', '2025-09-06', '2025-10-12', 'Archery pronghorn season'],
    ['Antelope Rifle', 'Pronghorn', 'big_game', 'Rifle', '2025-10-18', '2025-11-23', 'General rifle pronghorn season'],
    ['Moose/Sheep/Goat', 'Moose, Bighorn Sheep, Mountain Goat', 'big_game', 'Any legal weapon', '2025-09-15', '2025-11-30', 'Special permit required — drawing only'],
    ['Mountain Lion', 'Mountain Lion', 'predator', 'Any legal weapon', '2025-12-01', '2026-04-14', 'Quota managed by district'],
    ['Pheasant', 'Pheasant', 'bird', 'Shotgun', '2025-10-11', '2026-01-01', 'Daily limit 3, possession 9'],
    ['Grouse (Forest)', 'Blue Grouse, Ruffed Grouse, Spruce Grouse', 'bird', 'Shotgun', '2025-09-01', '2026-01-01', 'Daily limit 3, possession 9'],
    ['Waterfowl', 'Mallard, Canada Goose', 'waterfowl', 'Shotgun', '2025-10-04', '2026-01-07', 'Federal frameworks apply, steel shot required'],
    ['Spring Turkey', 'Wild Turkey', 'bird', 'Shotgun/Archery', '2026-04-11', '2026-05-17', 'Toms and jakes only'],
    ['Fall Turkey', 'Wild Turkey', 'bird', 'Shotgun/Archery', '2025-09-01', '2025-11-27', 'Either sex'],
    ['Black Bear Spring', 'Black Bear', 'predator', 'Any legal weapon', '2026-04-15', '2026-06-15', 'Spring season, no bait allowed'],
    ['Black Bear Fall', 'Black Bear', 'predator', 'Any legal weapon', '2025-09-15', '2025-11-30', 'Concurrent with general season'],
    ['Wolf', 'Wolf', 'predator', 'Any legal weapon', '2025-09-15', '2026-03-15', 'Quota managed, check regulations'],
    ['Dove', 'Mourning Dove', 'bird', 'Shotgun', '2025-09-01', '2025-10-30', 'Daily limit 8'],
  ];

  const insertMany = db.transaction(() => {
    for (const s of seasons) insertSeason.run(...s);
  });
  insertMany();
}

// Seed spots
const spotCount = db.prepare('SELECT COUNT(*) as c FROM hunting_spots').get().c;
if (spotCount === 0) {
  const insertSpot = db.prepare(`INSERT INTO hunting_spots (name, hunting_districts, access_type, description, tips, difficulty) VALUES (?, ?, ?, ?, ?, ?)`);

  const spots = [
    ['Bitterroot National Forest', 'HD 250, 261, 270', 'Public — USFS', 'Vast wilderness area along the MT/ID border. Excellent elk and deer habitat with steep timbered ridges.', 'Access via Bitterroot Valley side drainages. Camp at trailheads. Be prepared for steep terrain and pack-out logistics.', 'Hard'],
    ['Rattlesnake Wilderness', 'HD 281, 282', 'Public — USFS/Wilderness', 'Close to Missoula with good elk, deer, and grouse habitat. Wilderness area — no motorized access.', 'Hike in from the main trailhead. The further you go, the less pressure. Great early-season grouse hunting too.', 'Moderate'],
    ['Bob Marshall Wilderness', 'HD 150, 282, 421', 'Public — Wilderness', 'Montana\'s crown jewel. Remote backcountry with outstanding elk hunting. Pack trip recommended.', 'Plan a 7-10 day pack trip. Hire an outfitter or bring stock. The Chinese Wall area is iconic but heavily used.', 'Expert'],
    ['Seeley Lake Area', 'HD 282, 283', 'Public — USFS/State', 'Mixed forests around Seeley Lake with good moose, elk, and grouse habitat.', 'Check Morrell Creek and Clearwater River drainages. Good road access with walk-in opportunities beyond.', 'Moderate'],
    ['Rock Creek', 'HD 214, 216', 'Public/Private mix', 'Beautiful granite canyon south of Missoula. Good deer and elk with excellent grouse hunting.', 'Respect private land boundaries. Upper Rock Creek has more public access. Great blue grouse hunting on ridges.', 'Moderate'],
    ['Blackfoot Valley', 'HD 281, 283, 284', 'Public/Private mix', 'Rolling timber and ranch land. Diverse hunting including deer, elk, pheasant, and waterfowl.', 'Block management areas open in fall. Scout early for BMA sign-up. River bottoms hold pheasants and whitetails.', 'Easy-Moderate'],
    ['Garnet Range', 'HD 283, 211', 'Public — BLM/USFS', 'Ghost town area between Missoula and Helena. Good mule deer habitat in open timber.', 'Access from Garnet Range Road. Mix of open ridges and timbered draws. Mule deer concentrate on south slopes.', 'Moderate'],
    ['Lolo National Forest', 'HD 281, 204', 'Public — USFS', 'Extensive forest west of Missoula. Varied terrain from river bottoms to alpine ridges.', 'Lolo Creek and Fish Creek drainages productive. Good road system for access but hunt away from roads.', 'Moderate'],
    ['Ninemile Valley', 'HD 204, 281', 'Public/Private mix', 'Remote valley northwest of Missoula. Known wolf territory with good elk populations.', 'Access from Ninemile Road. Multiple side drainages to explore. Check for logging activity which can push game.', 'Moderate-Hard'],
    ['Sapphire Mountains', 'HD 211, 214', 'Public — USFS/BLM', 'Gentle mountains between Bitterroot and Flint Creek valleys. Great mule deer and elk.', 'Skalkaho Pass area is productive. Open enough for glassing but with good timber for cover. Road access good.', 'Moderate'],
    ['Flint Creek Range', 'HD 211, 212', 'Public — USFS', 'Small mountain range near Philipsburg. Good mule deer with some elk. Less hunting pressure.', 'Access from Georgetown Lake area. Compact range — you can cover a lot in a day. Fred Burr area good for muleys.', 'Easy-Moderate'],
    ['Mission Mountains', 'HD 282, 283', 'Public/Tribal — mixed', 'Spectacular peaks with mountain goat and elk. Tribal permits required for reservation side.', 'West side is Flathead NF — public access. East side is tribal land requiring separate permit. Very rugged terrain.', 'Expert'],
    ['Clark Fork Corridor', 'HD 204, 281', 'Public/Private mix', 'River corridor from Missoula west. Whitetail deer, waterfowl, and upland birds.', 'Focus on BMA properties along river. Good waterfowl hunting at confluences. Whitetails in cottonwood bottoms.', 'Easy'],
    ['Flathead Lake Area', 'HD 120, 130', 'Public/Private mix', 'Agricultural land and forest around Flathead Lake. Waterfowl and upland bird hunting.', 'Goose hunting in harvested grain fields. Check wildlife management areas for waterfowl. Beautiful country.', 'Easy'],
    ['Ovando/Helmville', 'HD 283, 284', 'Public/Private mix', 'Ranch country in upper Blackfoot. Pronghorn, deer, and upland birds.', 'Block management key here. Sign up early for BMAs. Open sage flats hold pronghorn and huns.', 'Easy-Moderate'],
  ];

  const insertMany = db.transaction(() => {
    for (const s of spots) insertSpot.run(...s);
  });
  insertMany();

  // Seed spot_species relationships
  const allSpecies = db.prepare('SELECT id, name FROM species').all();
  const allSpots = db.prepare('SELECT id, name FROM hunting_spots').all();
  const insertSS = db.prepare('INSERT INTO spot_species (spot_id, species_id) VALUES (?, ?)');

  const spotSpeciesMap = {
    'Bitterroot National Forest': ['Elk', 'Whitetail Deer', 'Mule Deer', 'Black Bear', 'Blue Grouse', 'Ruffed Grouse'],
    'Rattlesnake Wilderness': ['Elk', 'Whitetail Deer', 'Mule Deer', 'Blue Grouse', 'Ruffed Grouse', 'Black Bear'],
    'Bob Marshall Wilderness': ['Elk', 'Mule Deer', 'Mountain Goat', 'Black Bear', 'Wolf', 'Blue Grouse'],
    'Seeley Lake Area': ['Elk', 'Moose', 'Whitetail Deer', 'Ruffed Grouse', 'Spruce Grouse'],
    'Rock Creek': ['Mule Deer', 'Whitetail Deer', 'Elk', 'Blue Grouse', 'Ruffed Grouse'],
    'Blackfoot Valley': ['Whitetail Deer', 'Elk', 'Pheasant', 'Hungarian Partridge', 'Mallard', 'Canada Goose'],
    'Garnet Range': ['Mule Deer', 'Elk', 'Black Bear', 'Blue Grouse'],
    'Lolo National Forest': ['Elk', 'Whitetail Deer', 'Black Bear', 'Mountain Lion', 'Blue Grouse', 'Ruffed Grouse'],
    'Ninemile Valley': ['Elk', 'Whitetail Deer', 'Wolf', 'Black Bear', 'Mountain Lion'],
    'Sapphire Mountains': ['Mule Deer', 'Elk', 'Black Bear', 'Blue Grouse'],
    'Flint Creek Range': ['Mule Deer', 'Elk', 'Blue Grouse'],
    'Mission Mountains': ['Mountain Goat', 'Elk', 'Black Bear', 'Blue Grouse'],
    'Clark Fork Corridor': ['Whitetail Deer', 'Pheasant', 'Mallard', 'Canada Goose', 'Mourning Dove'],
    'Flathead Lake Area': ['Canada Goose', 'Mallard', 'Pheasant', 'Whitetail Deer'],
    'Ovando/Helmville': ['Pronghorn', 'Whitetail Deer', 'Mule Deer', 'Hungarian Partridge', 'Pheasant'],
  };

  const mapTx = db.transaction(() => {
    for (const [spotName, speciesNames] of Object.entries(spotSpeciesMap)) {
      const spot = allSpots.find(s => s.name === spotName);
      if (!spot) continue;
      for (const sn of speciesNames) {
        const sp = allSpecies.find(s => s.name === sn);
        if (sp) insertSS.run(spot.id, sp.id);
      }
    }
  });
  mapTx();
}

// Seed tags info
const tagCount = db.prepare('SELECT COUNT(*) as c FROM tags_info').get().c;
if (tagCount === 0) {
  const insertTag = db.prepare(`INSERT INTO tags_info (name, deadline, type, resident_cost, nonresident_cost, notes) VALUES (?, ?, ?, ?, ?, ?)`);
  const tags = [
    ['Special Permits (Moose/Sheep/Goat/Bison)', '2026-05-01', 'drawing', '$8.00 application', '$75.00 application', 'Must apply by May 1. Drawing results in June. Once-in-a-lifetime for some species.'],
    ['Deer/Elk B License', '2026-06-01', 'drawing', '$13.00', '$527.00', 'Additional doe/cow tags for specific districts. Apply by June 1.'],
    ['Antelope', '2026-06-01', 'drawing', '$19.00', '$205.00', 'Apply by June 1. Doe tags easier to draw. Most units in eastern MT.'],
    ['OTC General Deer/Elk', '2026-03-01', 'otc', '$23.00 (sportsman)', '$1,027.00 (combo)', 'Available over-the-counter starting March 1. Buy early to avoid last-minute rush.'],
    ['Spring Turkey', '2026-03-15', 'drawing', '$13.00', '$121.00', 'Apply by March 15. Leftover permits available OTC.'],
  ];
  const insertMany = db.transaction(() => {
    for (const t of tags) insertTag.run(...t);
  });
  insertMany();
}

// Seed tips
const tipCount = db.prepare('SELECT COUNT(*) as c FROM tips').get().c;
if (tipCount === 0) {
  const insertTip = db.prepare(`INSERT INTO tips (month, title, content) VALUES (?, ?, ?)`);
  const tips = [
    [1, 'Late Season Lions', 'January is prime mountain lion hunting. Fresh snow makes tracking ideal. Contact local houndsmen for guided hunts.'],
    [2, 'Plan Your Year', 'February is planning month. Review last year, study maps, apply for special permits before May deadline.'],
    [3, 'Buy Your License', 'OTC deer/elk licenses available March 1. Don\'t wait — buy early and start scouting.'],
    [4, 'Spring Bears & Turkeys', 'Spring bear and turkey seasons open mid-April. Scout south-facing slopes for bears on avalanche chutes.'],
    [5, 'Scouting Season', 'Hit the mountains. Glass for elk in alpine meadows. Check winter range for shed antlers and sign.'],
    [6, 'Summer Scouting', 'Trail cameras on wallows. Glass bachelor groups of bucks. Identify water sources for archery season.'],
    [7, 'Archery Prep', 'Tune your bow, practice at distance, and hike with your pack. Physical fitness wins archery hunts.'],
    [8, 'Final Prep', 'Check gear, sight in rifles, confirm camp reservations. Archery season opens September 6!'],
    [9, 'Archery Season', 'Archery deer/elk opens Sep 6. Bugling elk, velvet bucks, warm weather. Best time in the mountains.'],
    [10, 'Rifle Season', 'General rifle opens Oct 25. Pattern game during archery closure week. Sight in and get to your spot early.'],
    [11, 'Peak Hunting', 'Full rifle season. Rut activity peaks for deer. Late season elk moving to winter range. Dress warm.'],
    [12, 'Wrap Up & Reflect', 'Seasons winding down. Mountain lion opens Dec 1. Process your game and plan for next year.'],
  ];
  const insertMany = db.transaction(() => {
    for (const t of tips) insertTip.run(...t);
  });
  insertMany();
}

module.exports = db;
