const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },

  email: {
    type: String,
    required: [true, 'please shear your e-mail'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'please provide a valid email'],
  },
  photo: 'String',

  password: {
    type: 'String',
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'please conform your password'],
  },
});

const User = mongoose.Model('User', userSchema);
module.exports = User;
