const keys = require('./keys');
const { createClient } = require('redis');

(async () => {
  const client = createClient({ url: `redis://${keys.redisHost}:${keys.redisPort}` });
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  const sub = client.duplicate();
  await sub.connect();

  await sub.subscribe('insert', async (message) => {
    await client.HSET('values', message, fib(parseInt(message)));
  });
})();

function fib(i) {
  if (i < 2) return 1;
  return fib(i - 1) + fib(i - 2);
}
