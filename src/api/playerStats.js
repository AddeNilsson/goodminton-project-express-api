import { PlayerStats, validatePlayerStats } from '../models/playerStats.model';
const keys = ['won', 'los', 'walkOvers'];

export const getStats = async (req, res) => {
  const stats = await PlayerStats.find();
  res.send(stats);
};

export const getPlayerStats = async (req, res) => {
  const stats = await PlayerStats.findOne({ userId: req.params.userId });
  res.send(stats);
};

export const updatePlayerStats = async (req, res) => {
  // Check so user token is same as target
  const targetId = req.params.userId;
  if (req.user._id !== targetId) return res.status(400).send('User missmatch');

  const { error } = validatePlayerStats(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const payload = req.body;
  const { won, lost, walkOvers, gamesTotal } = await PlayerStats.findOne({ userId: targetId });

  const newStats = {
    won: won + payload.won,
    lost: lost + payload.lost + (payload.walkOvers * 6),
    walkOvers: walkOvers + payload.walkOvers,
    gamesTotal: gamesTotal + payload.won + payload.lost + (payload.walkOvers * 6),
    touched: Date.now(),
  };
  newStats.winRatio = Math.round((newStats.won / newStats.gamesTotal) * 100) / 100;

  try {
    const updated = await PlayerStats.findOneAndUpdate({ userId: targetId }, newStats, { new: true });
    return res.send(updated);
  } catch (e) {
    console.error(e);
    return res.status(400).send('Error Updating Stats');
  }

};
