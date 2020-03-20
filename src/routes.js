import requireAuth from './middleware/auth';
import * as user from './api/user';
import * as auth from './api/auth';

export default (app) => {
  app.get('/api/users/current', requireAuth, (req, res) => user.getCurrentUser(req, res));
  app.post('/api/users', (req, res) => user.signUp(req, res));
  app.post('/api/auth/sign-in', (req, res) => auth.signIn(req, res));
};
