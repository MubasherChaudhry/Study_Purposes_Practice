const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
//create User
const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
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

  const token = signToken(newUser._id);

  res
    .status(201)
    .json({ status: 'fucked-up(OK)', token, data: { usr: newUser } });
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
  const token = signToken(user._id);
  res.status(200).json({ status: 'Success', token });
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
  
  
  //4) Log the user in , send JWT
  const token = signToken(user._id);
  res.status(200).json({ status: 'Success', token });
});
