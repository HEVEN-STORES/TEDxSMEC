const express = require('express');
const router = express.Router();
const FacultyCoordinator = require('../../models/FacultyCoordinator');
const auth = require('../../middleware/auth');
const upload = require('../../utils/upload');

/*
  PUBLIC ROUTES (no auth)
  - GET  /api/admin/coordinators/public/list
  - GET  /api/admin/coordinators/public/:id
*/
router.get('/public/list', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit || '0', 10) || 0, 200);
    const filter = q ? {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ],
    } : {};

    let query = FacultyCoordinator.find(filter).sort({ name: 1 });
    if (limit > 0) query = query.limit(limit);
    const items = await query.lean();
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error('Public coordinators list error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const item = await FacultyCoordinator.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ success: false, message: 'Coordinator not found' });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error('Public coordinator read error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* -------------------- PROTECTED ADMIN ROUTES -------------------- */
router.use(auth);

// list (admin)
router.get('/', async (req, res) => {
  try {
    const items = await FacultyCoordinator.find().sort({ name: 1 }).lean();
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('GET /admin/coordinators', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// single (admin)
router.get('/:id', async (req, res) => {
  try {
    const item = await FacultyCoordinator.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ success: false });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error('GET /admin/coordinators/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// create
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, department, contact, bio } = req.body;
    const photo = req.file ? `uploads/${req.file.filename}` : undefined;
    const doc = new FacultyCoordinator({ name, department, contact, bio, photo });
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('POST /admin/coordinators', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// update
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.photo = `uploads/${req.file.filename}`;
    const doc = await FacultyCoordinator.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!doc) return res.status(404).json({ success: false });
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('PUT /admin/coordinators/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const doc = await FacultyCoordinator.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false });
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('DELETE /admin/coordinators/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
