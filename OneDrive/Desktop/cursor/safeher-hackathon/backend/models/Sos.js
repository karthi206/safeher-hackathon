const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  lat: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  lng: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  source: {
    type: String,
    required: true,
    enum: ['manual', 'voice', 'auto', 'panic'],
    default: 'manual'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'resolved', 'false_alarm'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for efficient querying
sosSchema.index({ timestamp: -1 });
sosSchema.index({ userId: 1, timestamp: -1 });

// Virtual for formatted timestamp
sosSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toISOString();
});

// Method to get location as string
sosSchema.methods.getLocationString = function() {
  return `${this.lat.toFixed(6)}, ${this.lng.toFixed(6)}`;
};

// Static method to get recent alerts
sosSchema.statics.getRecentAlerts = function(limit = 50) {
  return this.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('userId lat lng source timestamp status notes');
};

// Static method to get alerts by user
sosSchema.statics.getAlertsByUser = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('lat lng source timestamp status notes');
};

module.exports = mongoose.model('Sos', sosSchema);
