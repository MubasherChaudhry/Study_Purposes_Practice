const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user post password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This rout is not for password updates. please use /updateMyPassword.',
        400
      )
    );
  }

  //2)filtered out unwanted fields name that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUsers = (req, res) => {
  res.status(201).json({
    status: 'Error',
    message: 'this route is not yet define! please',
  });
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

//Do Not update password with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
