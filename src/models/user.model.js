import jwt from 'jsonwebtoken';
import Joi from 'joi';
import mongoose from 'mongoose';

import config from '../config';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  isAdmin: Boolean,
  playerStats: [{ type: mongoose.Types.ObjectId, ref: 'PlayerStats' }],
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.jwtSecretKey, { expiresIn: '1d' });
  return token;
};

export const User = mongoose.model('User', UserSchema);

export const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required()
      .email(),
    password: Joi.string().min(3).max(255).required(),
  };

  return Joi.validate(user, schema);
};
