const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

// EXPRESS
const app = express();
app.use(cors());
app.use(bodyParser.json());

// POSTGRESS
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDb,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on('error', (err) => console.error('lost PG connection: ' + err));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values(number INT)')
  .catch((err) => console.error('not create table: ' + err));

// REDIS
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// ROUTES
app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/values/all', (req, res) => {
  pgClient
    .query(`SELECT * FROM values`)
    .then(({ rows }) => res.send(rows))
    .catch((err) => console.error(err));
});

app.get('/values/current', (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    if (err) return console.error(err);
    res.send(values);
  });
});

app.post('/values/', (req, res) => {
  const { index } = req.body;
  if (parseInt(index) > 40) return res.status(422).end('Index too height');

  redisClient.hset('values', index, 'nothing yet');
  redisPublisher.publish('insert', index);
  pgClient
    .query('INSERT INTO values(number) VALUES($1)', [index])
    .catch((err) => console.error(err));
  res.send({ working: true });
});

app.listen(5000, () => console.log('server run'));
