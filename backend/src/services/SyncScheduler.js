/**
 * Sync Scheduler
 * Manages automated product synchronization from Amazon
 */

const cron = require('node-cron');
const ingestionService = require('./IngestionService');
const amazonConfig = require('../config/amazon');

class SyncScheduler {
  constructor() {
    this.jobs = {};
    this.isEnabled = process.env.ENABLE_AUTO_SYNC === 'true';
  }

  /**
   * Start all scheduled sync jobs
   */
  start() {
    if (!this.isEnabled) {
      console.log('⏸️  Auto-sync is disabled. Set ENABLE_AUTO_SYNC=true to enable');
      return;
    }

    console.log('🕐 Starting sync scheduler...');

    // Full sync - daily at 2 AM
    this.jobs.fullSync = cron.schedule(
      amazonConfig.syncIntervals.full,
      async () => {
        console.log('⏰ Scheduled full sync triggered');
        try {
          await ingestionService.fullSync();
        } catch (error) {
          console.error('❌ Scheduled full sync failed:', error.message);
        }
      },
      {
        scheduled: true,
        timezone: 'America/New_York'
      }
    );

    // Incremental sync - every 6 hours
    this.jobs.incrementalSync = cron.schedule(
      amazonConfig.syncIntervals.incremental,
      async () => {
        console.log('⏰ Scheduled incremental sync triggered');
        try {
          await ingestionService.incrementalSync();
        } catch (error) {
          console.error('❌ Scheduled incremental sync failed:', error.message);
        }
      },
      {
        scheduled: true,
        timezone: 'America/New_York'
      }
    );

    console.log('✅ Sync scheduler started');
    console.log(`   - Full sync: ${amazonConfig.syncIntervals.full}`);
    console.log(`   - Incremental sync: ${amazonConfig.syncIntervals.incremental}`);
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    console.log('🛑 Stopping sync scheduler...');

    Object.keys(this.jobs).forEach(jobName => {
      if (this.jobs[jobName]) {
        this.jobs[jobName].stop();
        console.log(`   - Stopped ${jobName}`);
      }
    });

    this.jobs = {};
    console.log('✅ Sync scheduler stopped');
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      jobs: Object.keys(this.jobs).map(name => ({
        name,
        isRunning: this.jobs[name] ? true : false
      })),
      schedules: {
        fullSync: amazonConfig.syncIntervals.full,
        incrementalSync: amazonConfig.syncIntervals.incremental
      }
    };
  }
}

module.exports = new SyncScheduler();
