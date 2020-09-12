const keys = require('./keys');
const redis = require('redis');

console.log(keys, 'redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

function fib(i) {
  if (i < 2) return 1;
  return fib(i - 1) + fib(i - 2);
}

sub.on('message', (chanel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
