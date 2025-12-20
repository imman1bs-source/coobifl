/**
 * Sync Routes
 * Endpoints for Amazon product synchronization
 */

const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// Get sync status
router.get('/status', syncController.getSyncStatus);

// Manual sync triggers
router.post('/full', syncController.triggerFullSync);
router.post('/incremental', syncController.triggerIncrementalSync);

// Targeted sync operations
router.post('/keywords', syncController.syncByKeywords);
router.post('/category', syncController.syncByCategory);
router.post('/update-asins', syncController.updateByAsins);

module.exports = router;
