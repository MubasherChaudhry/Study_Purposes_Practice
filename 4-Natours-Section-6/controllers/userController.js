const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = (req, res, next) => {
  //1) Create error if user post password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This rout is not for password updates. please use /updateMyPassword.',
        400
      )
    );
  }

  //2) update user document

  res.status(200).json({
    status: 'success',
  });
};

exports.createUsers = (req, res) => {
  res.status(201).json({
    status: 'Error',
    message: 'this route is not yet define',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'this route is not yet define',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'this route is not yet define',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'this route is not yet define',
  });
};
