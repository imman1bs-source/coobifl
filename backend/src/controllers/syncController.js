/**
 * Sync Controller
 * Handles manual Amazon sync operations
 */

const ingestionService = require('../services/IngestionService');
const syncScheduler = require('../services/SyncScheduler');

/**
 * Get sync status
 */
exports.getSyncStatus = async (req, res, next) => {
  try {
    const ingestionStatus = ingestionService.getStatus();
    const schedulerStatus = syncScheduler.getStatus();

    res.json({
      success: true,
      data: {
        ingestion: ingestionStatus,
        scheduler: schedulerStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Trigger full sync manually
 */
exports.triggerFullSync = async (req, res, next) => {
  try {
    const result = await ingestionService.fullSync();

    res.json({
      success: true,
      message: 'Full sync completed',
      data: result
    });
  } catch (error) {
    if (error.message.includes('already running')) {
      return res.status(409).json({
        success: false,
        error: 'Sync is already running'
      });
    }
    next(error);
  }
};

/**
 * Trigger incremental sync manually
 */
exports.triggerIncrementalSync = async (req, res, next) => {
  try {
    const result = await ingestionService.incrementalSync();

    res.json({
      success: true,
      message: 'Incremental sync completed',
      data: result
    });
  } catch (error) {
    if (error.message.includes('already running')) {
      return res.status(409).json({
        success: false,
        error: 'Sync is already running'
      });
    }
    next(error);
  }
};

/**
 * Sync products by keywords
 */
exports.syncByKeywords = async (req, res, next) => {
  try {
    const { keywords } = req.body;

    if (!keywords) {
      return res.status(400).json({
        success: false,
        error: 'Keywords are required'
      });
    }

    const result = await ingestionService.syncByKeywords(keywords, {
      itemCount: req.body.itemCount || 10
    });

    res.json({
      success: true,
      message: `Synced products for keywords: ${keywords}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Sync products by category
 */
exports.syncByCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }

    const result = await ingestionService.syncByCategory(category, {
      itemCount: req.body.itemCount || 10
    });

    res.json({
      success: true,
      message: `Synced products for category: ${category}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update products by ASINs
 */
exports.updateByAsins = async (req, res, next) => {
  try {
    const { asins } = req.body;

    if (!asins || !Array.isArray(asins) || asins.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ASINs array is required'
      });
    }

    const result = await ingestionService.updateByAsins(asins);

    res.json({
      success: true,
      message: `Updated ${result.updated} products`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
