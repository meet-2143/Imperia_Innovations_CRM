const express = require('express');
const { getLeads, createLead, updateLead } = require('../controllers/leadController');
const { addSeller, updateSeller, getSellers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../utils/authMiddleware');

const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

// Lead Routes
router.get('/leads', protect, getLeads);
router.post('/leads', protect, upload.single('visitingCard'), createLead);
router.put('/leads/:id', protect, updateLead);

// Admin Routes (Seller Management)
router.post('/admin/sellers', protect, adminOnly, addSeller);
router.put('/admin/sellers/:id', protect, adminOnly, updateSeller);
router.get('/admin/sellers', protect, adminOnly, getSellers);

module.exports = router;
