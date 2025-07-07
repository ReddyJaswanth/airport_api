const { DataSource } = require('typeorm');
const Airport = require('./entity/Airport');
const City = require('./entity/City');
const Country = require('./entity/Country');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'airport.sqlite',
  synchronize: true,
  logging: false,
  entities: [Airport, City, Country],
});

module.exports = AppDataSource; 