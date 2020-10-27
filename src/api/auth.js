import bcrypt from 'bcrypt';
import { User } from '../models/user.model';

export const signIn = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ error: 'no user found' });

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) return res.status(400).send('Password missmatch');

  const token = user.generateAuthToken();
  return res.header('x-access-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};

export const removeWhenNextDefined = () => false;
