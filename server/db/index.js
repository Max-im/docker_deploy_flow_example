const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(keys.pgDb, keys.pgUser, keys.pgPassword, {
	dialect: 'postgres',
	host: keys.pgHost,
	port: Number(keys.pgPort),
	logging: true,
});

module.exports = { sequelize };