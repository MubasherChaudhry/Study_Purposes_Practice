const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
//create User
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({ status: 'success', token, data: { user } });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //2) check if user exist & password is correct
  const user = await User.findOne({ email }).select('+password'); // + to show the property that you need
  //const correct = await user.correctPassword(password, user.password);

  // If the first operand evaluates to true, the || operator immediately returns the value of the first operand without evaluating the second operand. This is known as short-circuiting.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) If everything is OK send Token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting Token and check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not log In! Please log in to get access')
    );
  }
  //2) Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  //3) Check if User still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('the user belongs to this token dose not exist', 401)
    );
  }

  //4)check if user change password after JWT/Token was issued
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(
        'user recently changed the password . please log in again',
        401
      )
    );

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array['admin','lead-guide'].role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'you do not have the permission to perform this action',
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is no user with the given email address', 404)
    );
  }
  //2) Generate the random reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your Password ? submit a PATCH request with your new password and ConfirmPassword to :
  ${resetURL}.\nif you didn't forget your password please ignore the email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token ( Valid till 10 mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send ti E-mail',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email.try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) if token is not expire, and there is a user , set a new password
  if (!user) {
    return next(new AppError('Token is not Valid or expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) update change Password at property of user
  // this step is done in userModel.js on line 61 to 65

  //4) Log the user in , send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get the user from the collection
  const user = await User.findById(req.user.id).select('+password');
  //2) check if the posted password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  //3)if so, update password

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  //4)log user in, send JWT
  createSendToken(user, 200, res);
});
