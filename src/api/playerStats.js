import { PlayerStats, validatePlayerStats } from '../models/playerStats.model';
import { createLog } from '../models/statsLog.model';

/** GET */
export const getStats = async (req, res) => {
  const stats = await PlayerStats.find();
  res.send(stats);
};

export const getPlayerStats = async (req, res) => {
  const stats = await PlayerStats.find({ userId: req.params.userId });
  res.send(stats);
};

/** UPDATE */
export const updatePlayerStats = async (req, res) => {
  const targetId = req.params.userId; // Check so user token is same as target
  if (req.user._id !== targetId) return res.status(400).send('User missmatch');

  const payload = req.body;
  const { error } = validatePlayerStats(payload);
  if (error) return res.status(400).send(error.details[0].message);

  const target = await PlayerStats.findOne({ userId: targetId });
  const newStats = payload.revert
    ? target.computeNewStatsReverted(payload)
    : target.computeNewStats(payload);

  try {
    const updated = await PlayerStats
      .findOneAndUpdate({ userId: targetId }, newStats, { new: true });
    createLog({ ...payload, userId: req.user._id });

    return res.send(updated);
  } catch (e) {
    console.error(e);
    return res.status(400).send('Error Updating Stats');
  }
};

/** DELETE */
export const deletePlayerStats = async (req, res) => { /** Clear all but admin */
  if (!req.user.isAdmin) return res.status(400).send('Permission Denied');
  const deleted = await PlayerStats.where('userId').ne(req.user._id).deleteMany();
  return res.send(deleted);
};
