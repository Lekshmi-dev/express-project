const { Sequelize } = require('sequelize');

// Replace these values with your actual database configuration
const sequelize = new Sequelize('express_auth', 'root', '', {
    host: 'localhost', // or your database host
    dialect: 'mysql', // or 'postgres', 'sqlite', etc.
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

testConnection();
