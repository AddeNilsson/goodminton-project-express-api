import bcrypt from 'bcrypt';
import { User, validateUser } from '../models/user.model';
import { PlayerStats, getInitialPlayerStats } from '../models/playerStats.model';

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};

export const signUp = async (req, res) => {
  // validate
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  });
  user.password = await bcrypt.hash(user.password, 10);

  await user.save();
  const token = user.generateAuthToken();
  try {
    const playerStats = new PlayerStats({ userId: user._id, touched: Date.now() })
    await playerStats.save();
  } catch(e) {
    return res.status(400).end('Missing field');
  }

  res.header("x-auth-token", token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  });
};
