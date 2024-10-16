const { Sequelize } = require('sequelize');
const path = require('path');
const process = require('process');

// Determine the environment (default to 'development')
const env = process.env.NODE_ENV || 'development';

// Load the config from config.json
const config = require(path.join(__dirname, '/../config/config.json'))[env];

// Create a new instance of Sequelize using values from the config
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,  // Use the dialect specified in the config
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
