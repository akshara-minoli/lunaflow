const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// Helper to format consistent success response
const sendSuccessResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        errors: ['A user with that email address already exists.']
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token & set cookie
    const token = generateToken(res, user._id);

    return sendSuccessResponse(res, 201, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        averageCycleLength: user.averageCycleLength,
        averagePeriodLength: user.averagePeriodLength
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user and check password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password']
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password']
      });
    }

    // Generate JWT token & set cookie
    const token = generateToken(res, user._id);

    // Filter out password from final return
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      averageCycleLength: user.averageCycleLength,
      averagePeriodLength: user.averagePeriodLength
    };

    return sendSuccessResponse(res, 200, 'Login successful', {
      user: userResponse,
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000), // Expirable in 5s
      httpOnly: true
    });

    return sendSuccessResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return sendSuccessResponse(res, 200, 'User profile retrieved', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        averageCycleLength: user.averageCycleLength,
        averagePeriodLength: user.averagePeriodLength
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
        errors: ['There is no user with that email address.']
      });
    }

    // Generate secure password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set db properties
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Expiration date in 1 hour
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    await user.save();

    // Create reset URL link
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>FloNest Password Recovery</h2>
        <p>You requested a password reset. Please click the button below to choose a new password. The link is valid for 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ff4d4d; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; margin: 15px 0;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'FloNest Password Recovery Link',
        message,
        html
      });

      return sendSuccessResponse(res, 200, 'Password reset link sent to email', {
        resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined
      });
    } catch (err) {
      // Clear token properties if mail fail
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent',
        errors: ['SMTP Mail transport configuration issue']
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash params token to look up database record
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
        errors: ['The reset password token is invalid or has expired']
      });
    }

    // Set new password (hashed pre-save) and clean token settings
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return sendSuccessResponse(res, 200, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};
