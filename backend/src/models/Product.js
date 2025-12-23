const mongoose = require('mongoose');

/**
 * Product Schema
 * Supports both Amazon API products and crowd-sourced products
 */
const productSchema = new mongoose.Schema({
  asin: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    uppercase: true
  },

  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },

  description: {
    type: String,
    trim: true
  },

  price: {
    amount: {
      type: Number,
      min: 0.01,
      max: 100000
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'INR', 'AUD', 'MXN', 'BRL']
    },
    displayPrice: String
  },

  category: {
    type: String,
    index: true
  },

  subcategory: String,

  images: {
    primary: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/i.test(v);
        },
        message: 'Invalid image URL format'
      }
    },
    variants: [{
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/i.test(v);
        },
        message: 'Invalid image URL format'
      }
    }]
  },

  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },

  availability: {
    status: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'limited', 'preorder', 'unknown'],
      default: 'unknown'
    },
    message: String
  },

  brand: {
    type: String,
    trim: true
  },

  features: [String],

  specifications: {
    type: Map,
    of: String
  },

  amazonUrl: String,
  walmartUrl: String,

  // Origin tracking
  origin: {
    source: {
      type: String,
      enum: ['amazon_pa_api', 'walmart', 'manual_import', 'csv_upload', 'scraper', 'crowd_sourced', 'other'],
      required: true,
      default: 'amazon_pa_api',
      index: true
    },
    sourceId: String,
    marketplace: {
      type: String,
      enum: ['US', 'UK', 'DE', 'FR', 'JP', 'CA', 'IN', 'IT', 'ES', 'MX', 'BR', 'AU'],
      default: 'US'
    },
    importedBy: String,
    importedAt: {
      type: Date,
      default: Date.now
    }
  },

  // Crowd-sourcing metadata
  crowdSourced: {
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    verifiedBy: String,
    verifiedAt: Date,
    submittedBy: {
      userId: String,
      username: String,
      email: {
        type: String,
        validate: {
          validator: function(v) {
            return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: 'Invalid email format'
        }
      }
    },
    editHistory: [{
      editedBy: String,
      editedAt: {
        type: Date,
        default: Date.now
      },
      changes: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }
    }],
    upvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    downvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    reportCount: {
      type: Number,
      default: 0,
      min: 0
    },
    reports: [{
      reportedBy: String,
      reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'incorrect_info', 'duplicate', 'other']
      },
      description: String,
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  lastSyncedAt: Date

}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, 'price.amount': 1 });
productSchema.index({ 'crowdSourced.upvotes': -1 });
productSchema.index({ 'crowdSourced.submittedBy.userId': 1 });

// Virtual for net votes
productSchema.virtual('netVotes').get(function() {
  if (!this.crowdSourced) return 0;
  return this.crowdSourced.upvotes - this.crowdSourced.downvotes;
});

// Method to check if product should be hidden based on votes
productSchema.methods.shouldBeHidden = function() {
  const netVotes = this.netVotes;
  return netVotes < -5; // Hide if net score is less than -5
};

// Method to check if product should be auto-verified
productSchema.methods.shouldBeAutoVerified = function() {
  if (!this.crowdSourced || this.crowdSourced.isVerified) return false;
  const upvotes = this.crowdSourced.upvotes;
  const downvotes = this.crowdSourced.downvotes;
  const total = upvotes + downvotes;

  if (upvotes >= 50 && total > 0) {
    const downvoteRatio = downvotes / total;
    return downvoteRatio < 0.05; // Less than 5% downvotes
  }
  return false;
};

// Pre-save middleware for auto-verification
productSchema.pre('save', function(next) {
  if (this.shouldBeAutoVerified() && !this.crowdSourced.isVerified) {
    this.crowdSourced.isVerified = true;
    this.crowdSourced.verifiedBy = 'auto-verification';
    this.crowdSourced.verifiedAt = new Date();
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
