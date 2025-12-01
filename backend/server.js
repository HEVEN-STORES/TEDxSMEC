// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const eventsRouter = require('./routes/events');
const bookingRouter = require('./routes/booking');
const webhookRouter = require('./routes/webhook');

const adminAuthRouter = require('./routes/admin/auth');
const adminEventsRouter = require('./routes/admin/events');
const adminSpeakersRouter = require('./routes/admin/speakers');
const adminSponsorsRouter = require('./routes/admin/sponsors');
const adminOrganizersRouter = require('./routes/admin/organizers');
const adminCoordinatorsRouter = require('./routes/admin/coordinators');

// Combined admin media router (contains public endpoints under /public and event/:eventId)
const adminMediaRoutes = require('./routes/admin/media');

const app = express();

/* ---------- CORS ---------- */
const allowed = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
].filter(Boolean);

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowed.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS not allowed by server'), false);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

/* serve uploads (public files) */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- DB ---------- */
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI missing in .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error(err); process.exit(1); });

/* ---------- health + debug ---------- */
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/admin/_ping', (_, res) => res.json({ ok: true, time: new Date().toISOString() }));

/* ---------- API mounts (public-facing) ---------- */
app.use('/api/events', eventsRouter);
app.use('/api/book', bookingRouter);
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookRouter);

/* ---------- admin: auth + resources ---------- */
app.use('/api/admin/auth', adminAuthRouter);

/* admin resources -- your admin routers (adminMediaRoutes contains public subroutes under /public) */
app.use('/api/admin/events', adminEventsRouter);
app.use('/api/admin/speakers', adminSpeakersRouter);
app.use('/api/admin/sponsors', adminSponsorsRouter);
app.use('/api/admin/organizers', adminOrganizersRouter);
app.use('/api/admin/coordinators', adminCoordinatorsRouter);

// mount the combined admin/media router (this file exposes:
//   GET  /api/admin/media/public
//   GET  /api/admin/media/public/:id
//   GET  /api/admin/media/event/:eventId
// and admin protected endpoints at /api/admin/media and /api/admin/media/:id etc.)
app.use('/api/admin/media', adminMediaRoutes);

/* ---------- start ---------- */
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening http://localhost:${port}`));
