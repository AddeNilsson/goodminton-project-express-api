import Joi from 'joi';
import mongoose from 'mongoose';

const StatsLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  regWon: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  regLost: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  regWalkOvers: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  revertable: {
    type: Boolean,
    default: true,
  },
  reverted: {
    type: Boolean,
    default: false,
  },
});

export const StatsLog = mongoose.model('StatsLog', StatsLogSchema);

export const createLog = ({
  won, lost, walkOvers, userId,
}) => {
  const log = new StatsLog({
    userId,
    regWon: won,
    regLost: lost,
    regWalkOvers: walkOvers,
    touched: Date.now(),
  });
  log.save();
};

export const validateStatsLog = (stats) => {
  const schema = {
    regWon: Joi.number().min(0).required(),
    regLost: Joi.number().min(0).required(),
    regWalkOvers: Joi.number().min(0).required(),
    revertable: Joi.boolean(),
    reverted: Joi.number(),
  };

  return Joi.validate(stats, schema);
};
