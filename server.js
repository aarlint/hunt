const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());

// Auth middleware
function getUser(req) {
  const email = req.headers['cf-access-authenticated-user-email'] || 'local@dev';
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    db.prepare('INSERT INTO users (email) VALUES (?)').run(email);
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }
  return user;
}

// Dashboard
app.get('/api/dashboard', (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  const seasons = db.prepare('SELECT * FROM seasons ORDER BY start_date').all();
  const openSeasons = seasons.filter(s => s.start_date <= now && s.end_date >= now);
  const upcoming = seasons.filter(s => s.start_date > now).sort((a, b) => a.start_date.localeCompare(b.start_date));
  const daysToNext = upcoming.length > 0 ? Math.ceil((new Date(upcoming[0].start_date) - new Date()) / 86400000) : null;
  const speciesCount = db.prepare('SELECT COUNT(*) as c FROM species').get().c;
  const spotsCount = db.prepare('SELECT COUNT(*) as c FROM hunting_spots').get().c;
  const month = new Date().getMonth() + 1;
  const tip = db.prepare('SELECT * FROM tips WHERE month = ?').get(month);
  const tags = db.prepare('SELECT * FROM tags_info ORDER BY deadline').all();

  res.json({ openSeasons, upcoming: upcoming.slice(0, 5), daysToNext, speciesCount, spotsCount, tip, tags });
});

// Species
app.get('/api/species', (req, res) => {
  res.json(db.prepare('SELECT * FROM species ORDER BY category, name').all());
});

app.get('/api/species/:id', (req, res) => {
  const species = db.prepare('SELECT * FROM species WHERE id = ?').get(req.params.id);
  if (!species) return res.status(404).json({ error: 'Not found' });
  const seasons = db.prepare("SELECT * FROM seasons WHERE ',' || species_name || ',' LIKE '%,' || ? || ',%' OR species_name = ?").all(species.name, species.name);
  const spots = db.prepare('SELECT hs.* FROM hunting_spots hs JOIN spot_species ss ON hs.id = ss.spot_id WHERE ss.species_id = ?').all(species.id);
  res.json({ ...species, seasons, spots });
});

// Seasons
app.get('/api/seasons', (req, res) => {
  res.json(db.prepare('SELECT * FROM seasons ORDER BY start_date').all());
});

app.get('/api/seasons/current', (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  res.json(db.prepare('SELECT * FROM seasons WHERE start_date <= ? AND end_date >= ? ORDER BY end_date').all(now, now));
});

// Spots
app.get('/api/spots', (req, res) => {
  const spots = db.prepare('SELECT * FROM hunting_spots ORDER BY name').all();
  for (const spot of spots) {
    spot.species = db.prepare('SELECT s.* FROM species s JOIN spot_species ss ON s.id = ss.species_id WHERE ss.spot_id = ?').all(spot.id);
  }
  res.json(spots);
});

app.get('/api/spots/:id', (req, res) => {
  const spot = db.prepare('SELECT * FROM hunting_spots WHERE id = ?').get(req.params.id);
  if (!spot) return res.status(404).json({ error: 'Not found' });
  spot.species = db.prepare('SELECT s.* FROM species s JOIN spot_species ss ON s.id = ss.species_id WHERE ss.spot_id = ?').all(spot.id);
  res.json(spot);
});

// Tags
app.get('/api/tags', (req, res) => {
  res.json(db.prepare('SELECT * FROM tags_info ORDER BY deadline').all());
});

// Tips
app.get('/api/tips', (req, res) => {
  res.json(db.prepare('SELECT * FROM tips ORDER BY month').all());
});

// Me
app.get('/api/me', (req, res) => {
  res.json(getUser(req));
});

// Reports
app.post('/api/reports', (req, res) => {
  const user = getUser(req);
  const { species_id, spot_id, date, notes, success } = req.body;
  const result = db.prepare('INSERT INTO reports (user_email, species_id, spot_id, date, notes, success) VALUES (?, ?, ?, ?, ?, ?)').run(user.email, species_id, spot_id, date, notes, success ? 1 : 0);
  res.json({ id: result.lastInsertRowid });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Hunt Montana API on :${PORT}`));
