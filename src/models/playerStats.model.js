import Joi from 'joi';
import mongoose from 'mongoose';

const PlayerStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  won: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  lost: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  walkOvers: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  winRatio: {
    type: Number,
    min: 0,
    default: 0,
  },
  gamesTotal: {
    type: Number,
    min: 0,
    default: 0,
  },
  touched: {
    type: Date,
    required: true,
  },
});

PlayerStatsSchema.methods.computeNewStats = function ({ won, lost, walkOvers }) {
  const newStats = {
    won: this.won + won,
    lost: this.lost + lost + (walkOvers * 6),
    walkOvers: this.walkOvers + walkOvers,
    gamesTotal: this.gamesTotal + won + lost + (walkOvers * 6),
    touched: Date.now(),
  };
  newStats.winRatio = Math.round((newStats.won / newStats.gamesTotal) * 100) / 100;
  return newStats;
};

PlayerStatsSchema.methods.computeNewStatsReverted = function ({ won, lost, walkOvers }) {
  const newStats = {
    won: this.won - won,
    lost: this.lost - lost - (walkOvers * 6),
    walkOvers: this.walkOvers - walkOvers,
    gamesTotal: this.gamesTotal - won - lost - (walkOvers * 6),
    touched: Date.now(),
  };

  newStats.winRatio = newStats.gamesTotal > 0
    ? Math.round((newStats.won / newStats.gamesTotal) * 100) / 100
    : 0;

  return newStats;
};

export const PlayerStats = mongoose.model('PlayerStats', PlayerStatsSchema);

export const validatePlayerStats = (stats) => {
  const schema = {
    won: Joi.number().required(),
    lost: Joi.number().required(),
    walkOvers: Joi.number().required(),
    winRatio: Joi.number(),
    gamesTotal: Joi.number(),
    revert: Joi.boolean(),
  };

  return Joi.validate(stats, schema);
};
