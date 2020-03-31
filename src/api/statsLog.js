import { StatsLog } from '../models/statsLog.model';

export const getLogs = async (req, res) => {
  const logs = await StatsLog.find();
  res.send(logs);
};

export const getPlayerLogs = async (req, res) => {
  const logs = await StatsLog.find({ userId: req.params.userId });
  res.send(logs);
};

export const updateLogEntry = async (req, res) => {
  try {
    const logUpdate = await StatsLog.updateOne(
      { _id: req.params.logId },
      { reverted: true, revertable: false },
      { new: true },
    );
    res.send(logUpdate);
  } catch (e) {
    res.status(400).send('Error Reverting Stats');
  }
};
