const User = require('../models/User');

// Helper to format consistent success response
const sendSuccessResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// @desc    Get user profile details
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['The logged-in user profile does not exist']
      });
    }

    return sendSuccessResponse(res, 200, 'User profile retrieved successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        averageCycleLength: user.averageCycleLength,
        averagePeriodLength: user.averagePeriodLength,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, averageCycleLength, averagePeriodLength, profileImage } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (averageCycleLength !== undefined) fieldsToUpdate.averageCycleLength = averageCycleLength;
    if (averagePeriodLength !== undefined) fieldsToUpdate.averagePeriodLength = averagePeriodLength;
    if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    return sendSuccessResponse(res, 200, 'User profile updated successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        averageCycleLength: user.averageCycleLength,
        averagePeriodLength: user.averagePeriodLength,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
