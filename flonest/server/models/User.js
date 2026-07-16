const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: true // Ensure password field is visible when validating credentials during login
    },
    profileImage: {
      type: String,
      default: ''
    },
    averageCycleLength: {
      type: Number,
      default: 28,
      min: [15, 'Cycle length must be at least 15 days'],
      max: [45, 'Cycle length cannot exceed 45 days']
    },
    averagePeriodLength: {
      type: Number,
      default: 5,
      min: [2, 'Period length must be at least 2 days'],
      max: [15, 'Period length cannot exceed 15 days']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true // Creates and manages createdAt and updatedAt automatically
  }
);

// Hash passwords using bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
