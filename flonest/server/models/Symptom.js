const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Please select a date for symptom log']
    },
    cramps: {
      type: Boolean,
      default: false
    },
    headache: {
      type: Boolean,
      default: false
    },
    fatigue: {
      type: Boolean,
      default: false
    },
    moodSwings: {
      type: Boolean,
      default: false
    },
    acne: {
      type: Boolean,
      default: false
    },
    bloating: {
      type: Boolean,
      default: false
    },
    backPain: {
      type: Boolean,
      default: false
    },
    nausea: {
      type: Boolean,
      default: false
    },
    flow: {
      type: String,
      enum: ['none', 'light', 'medium', 'heavy'],
      default: 'none'
    },
    painLevel: {
      type: Number,
      default: 0,
      min: [0, 'Pain level cannot be less than 0'],
      max: [10, 'Pain level cannot exceed 10']
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index to prevent duplicate symptom logs for the same user on the same calendar day
SymptomSchema.index({ user: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('Symptom', SymptomSchema);
