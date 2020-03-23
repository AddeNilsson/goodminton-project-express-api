import requireAuth from './middleware/auth';
import * as user from './api/user';
import * as auth from './api/auth';
import * as playerStats from './api/playerStats';

export default (app) => {
  /** Users */
  app.get('/api/users/current', requireAuth, (req, res) => user.getCurrentUser(req, res));
  app.post('/api/users', (req, res) => user.signUp(req, res));

  /** Auth */
  app.post('/api/auth/sign-in', (req, res) => auth.signIn(req, res));

  /** Stats */
  app.get('/api/stats', (req, res) => playerStats.getStats(req, res));
  app.get('/api/stats/:userId', requireAuth, (req, res) => playerStats.getPlayerStats(req, res));
  app.put('/api/stats/:userId', requireAuth, (req, res) => playerStats.updatePlayerStats(req, res));

};
