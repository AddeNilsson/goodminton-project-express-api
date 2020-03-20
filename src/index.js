import express from 'express';
import config from './config'
import mongoose from 'mongoose';
import routes from './routes';

const app = express();

if (!config.jwtSecretKey) {
  console.error("FATAL ERROR: no jwt key set.");
  process.exit(1);
}

mongoose
  .connect(`mongodb+srv://${config.dbUser}:${config.dbPassword}@cluster0-bvvy1.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));

app.use(express.json());

routes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
