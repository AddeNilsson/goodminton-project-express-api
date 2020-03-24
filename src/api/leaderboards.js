import { User } from '../models/user.model';

/** GET UserModel populated with PlayerStats */
export const getUsersWithStats = async (req, res) => {
  const users = await User
    .find()
    .select("-password")
    .populate('playerStats')
    .exec((err, docs) => {
      if (err) {
        console.error(err);
        return res.status(400).send('DB Error');
      }
      res.send(docs);
    });
};

export const getUserWithStats = async (req, res) => {
  const users = await User
    .find({ _id: req.params.userId })
    .select("-password")
    .populate('playerStats')
    .exec((err, docs) => {
        if (err) {
          console.error(err);
          return res.status(400).send('DB Error');
        }
        res.send(docs);
    });
};
