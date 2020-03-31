import requireAuth from './middleware/auth';
import * as user from './api/user';
import * as auth from './api/auth';
import * as playerStats from './api/playerStats';
import * as leaderboards from './api/leaderboards';
import * as logs from './api/statsLog';

export default (app) => {
  /** Users */
  app.get('/api/users/current', requireAuth, (req, res) => user.getCurrentUser(req, res));
  app.get('/api/users', (req, res) => user.getUsers(req, res));
  app.get('/api/users/:userId', (req, res) => user.getUser(req, res));
  app.post('/api/users', (req, res) => user.signUp(req, res));
  app.delete('/api/users', requireAuth, (req, res) => user.deleteUsers(req, res));

  /** Auth */
  app.post('/api/auth/sign-in', (req, res) => auth.signIn(req, res));

  /** Stats */
  app.get('/api/stats', (req, res) => playerStats.getStats(req, res));
  app.get('/api/stats/:userId', requireAuth, (req, res) => playerStats.getPlayerStats(req, res));
  app.put('/api/stats/:userId', requireAuth, (req, res) => playerStats.updatePlayerStats(req, res));
  app.delete('/api/stats', requireAuth, (req, res) => playerStats.deletePlayerStats(req, res));

  /** Leaderboards */
  app.get('/api/leaderboards', (req, res) => leaderboards.getUsersWithStats(req, res));
  app.get('/api/leaderboards/:userId', (req, res) => leaderboards.getUserWithStats(req, res));

  app.get('/api/logs', requireAuth, (req, res) => logs.getLogs(req, res));
  app.get('/api/logs/:userId/:logId', requireAuth, (req, res) => logs.getPlayerLogs(req, res));
  app.put('/api/logs/:userId/:logId', requireAuth, (req, res) => logs.updateLogEntry(req, res));
};
