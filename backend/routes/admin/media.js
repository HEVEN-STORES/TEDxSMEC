// routes/admin/media.js
const express = require('express');
const router = express.Router();

const mediaCtrl = require('../../controllers/mediaController');
const publicMediaCtrl = require('../../controllers/publicMediaController');
const { uploadImage } = require('../../middleware/upload');

/* ----------------------------------------------------
   PUBLIC MEDIA ROUTES  (no auth)
   These are accessible at:
   GET /api/admin/media/public     -> list all media
   GET /api/admin/media/public/:id -> single media
   GET /api/admin/media/event/:eventId -> media for event
---------------------------------------------------- */

// List public media
router.get('/public', publicMediaCtrl.listPublicMedia);

// Get single public media
router.get('/public/:id', publicMediaCtrl.getPublicMedia);

// Get event media (put before admin routes to avoid conflicts)
router.get('/event/:eventId', publicMediaCtrl.listMediaForEvent);


/* ----------------------------------------------------
   ADMIN-ONLY MEDIA ROUTES
---------------------------------------------------- */

// placeholder admin auth middleware
function auth(req, res, next) {
  // Replace with real authentication logic
  return next();
}

// Use auth for all admin routes below
router.use(auth);

// ADMIN: list media
router.get('/', mediaCtrl.listMedia);

// ADMIN: create image or video
router.post('/', uploadImage.single('file'), async (req, res) => {
  if (req.file) return mediaCtrl.createImage(req, res);
  if (req.body?.type === 'video' && req.body?.url) return mediaCtrl.createVideo(req, res);

  return res.status(400).json({
    success: false,
    message:
      'Invalid create request. Use multipart/form-data for images (field "file") OR JSON { type: "video", url }'
  });
});

// ADMIN: get media metadata
router.get('/:id', mediaCtrl.getMedia);

// ADMIN: update metadata
router.put('/:id', mediaCtrl.updateMedia);

// ADMIN: delete media
router.delete('/:id', mediaCtrl.deleteMedia);

module.exports = router;
