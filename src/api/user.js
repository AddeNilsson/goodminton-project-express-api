import bcrypt from 'bcrypt';
import { User, validateUser } from '../models/user.model';
import { PlayerStats } from '../models/playerStats.model';

/** GET */
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
};

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.send(users);
};

export const getUser = async (req, res) => {
  const user = await User.find({ _id: req.params.userId }).select('-password');
  res.send(user);
};

/* CREATE */
export const signUp = async (req, res) => {
  const { error } = validateUser(req.body); // validate
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }); // find an existing user
  if (user) return res.status(400).send('User already registered.');

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    isAdmin: false,
  });
  user.password = await bcrypt.hash(user.password, 10);

  const token = user.generateAuthToken();
  try {
    const playerStats = new PlayerStats({ userId: user._id, touched: Date.now() });
    user.playerStats = [playerStats._id];
    await user.save();
    await playerStats.save();
  } catch (e) {
    return res.status(400).send('Error creating user');
  }

  return res.header('x-auth-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
};

/** DELETE */
export const deleteUsers = async (req, res) => { /** Clear all but SuperUser */
  if (!req.user.isAdmin) return res.status(400).send('Permission Denied');
  const deleted = await User.where('_id').ne(req.user._id).deleteMany();
  return res.send(deleted);
};
