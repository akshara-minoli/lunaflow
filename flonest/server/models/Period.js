const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date']
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true; // Ongoing period
          return value >= this.startDate;
        },
        message: 'End date must be after or equal to the start date'
      }
    },
    duration: {
      type: Number,
      default: 0
    },
    cycleLength: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Period', PeriodSchema);
