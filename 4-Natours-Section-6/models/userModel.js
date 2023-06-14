const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    validate: [validator.isEmail, 'please provide a valid email'],
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
    validate: {
      //This will work only on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
