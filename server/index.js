const keys = require('./keys');
const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');
// const { Pool } = require('pg');
const {sequelize} = require('./db');

// EXPRESS
const app = express();
app.use(cors());
app.use(express.json());

// POSTGRESS
// const pgClient = new Pool({
//   user: keys.pgUser,
//   host: keys.pgHost,
//   database: keys.pgDb,
//   password: keys.pgPassword,
//   port: keys.pgPort,
// });

// pgClient
//   .query(`CREATE TABLE IF NOT EXISTS ${keys.pgDb}(number INT)`)
//   .catch((err) => console.error('not create table: ' + err));

// REDIS

(async () => {
  await sequelize.authenticate();

  const client = createClient({ url: `redis://${keys.redisHost}:${keys.redisPort}` });
  client.on('error', (err) => console.log('Redis Client Error ***************************', err));

  await client.connect();
  const redisPublisher = client.duplicate();
  await redisPublisher.connect();

  // ROUTES
  app.get('/', (req, res) => {
    res.send('hi');
  });

  app.get('/values/all', (req, res) => {
    // pgClient
    //   .query(`SELECT * FROM ${keys.pgDb}`)
    //   .then(({ rows }) => res.send(rows))
    //   .catch((err) => console.error(err));
  });

  app.get('/values/current', async (req, res) => {
    const values = await client.HGETALL('values');
    res.send(values);
  });

  app.post('/values/', async (req, res) => {
    const { index } = req.body;
    if (parseInt(index) > 40) return res.status(422).end('Index too height');

    await client.HSET('values', index, 'nothing yet');
    await redisPublisher.publish('insert', index);

    // pgClient
    //   .query(`INSERT INTO ${keys.pgDb}(number) VALUES($1)`, [index])
    //   .catch((err) => console.error(err));
    res.send({ working: true });
  });

  app.listen(5000, () => console.log('server run'));
})();
