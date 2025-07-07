const fs = require('fs');
const csv = require('csv-parser');
const AppDataSource = require('./data-source');

async function importCSV() {
  const countryRepo = AppDataSource.getRepository('Country');
  const cityRepo = AppDataSource.getRepository('City');
  const airportRepo = AppDataSource.getRepository('Airport');

  // Helper to load CSV into array
  function loadCSV(path) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  // Import countries
  const countries = await loadCSV('src/database-files/country.csv');
  for (const row of countries) {
    await countryRepo.save({
      id: parseInt(row.id),
      name: row.name,
      alt_name: row.alt_name,
      country_code_two: row.country_code_two,
      country_code_three: row.country_code_three,
      mobile_code: isNaN(parseInt(row.mobile_code)) ? null : parseInt(row.mobile_code),
      continent_id: isNaN(parseInt(row.continent_id)) ? null : parseInt(row.continent_id),
      country_flag: row.country_flag
    });
  }
  console.log('Countries imported');

  // Import cities (check country_id exists)
  const cities = await loadCSV('src/database-files/city.csv');
  for (const row of cities) {
    const country_id = parseInt(row.country_id);
    const countryExists = await countryRepo.findOneBy({ id: country_id });
    if (!countryExists) {
      console.warn(`Skipping city id=${row.id} (missing country_id=${country_id})`);
      continue;
    }
    await cityRepo.save({
      id: parseInt(row.id),
      name: row.name,
      country_id,
      alt_name: row.alt_name,
      lat: isNaN(parseFloat(row.lat)) ? null : parseFloat(row.lat),
      long: isNaN(parseFloat(row.long)) ? null : parseFloat(row.long),
      is_active: row.is_active === '1',
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }
  console.log('Cities imported');

  // Import airports (check city_id and country_id exist)
  const airports = await loadCSV('src/database-files/airport.csv');
  for (const row of airports) {
    const city_id = parseInt(row.city_id);
    const country_id = parseInt(row.country_id);
    const cityExists = await cityRepo.findOneBy({ id: city_id });
    const countryExists = await countryRepo.findOneBy({ id: country_id });
    if (!cityExists) {
      console.warn(`Skipping airport id=${row.id} (missing city_id=${city_id})`);
      continue;
    }
    if (!countryExists) {
      console.warn(`Skipping airport id=${row.id} (missing country_id=${country_id})`);
      continue;
    }
    await airportRepo.save({
      id: parseInt(row.id),
      icao_code: row.icao_code,
      iata_code: row.iata_code,
      name: row.name,
      type: row.type,
      city_id,
      country_id,
      continent_id: isNaN(parseInt(row.continent_id)) ? null : parseInt(row.continent_id),
      website_url: row.website_url,
      created_at: row.created_at,
      updated_at: row.updated_at,
      latitude_deg: isNaN(parseFloat(row.latitude_deg)) ? null : parseFloat(row.latitude_deg),
      longitude_deg: isNaN(parseFloat(row.longitude_deg)) ? null : parseFloat(row.longitude_deg),
      elevation_ft: isNaN(parseInt(row.elevation_ft)) ? null : parseInt(row.elevation_ft),
      wikipedia_link: row.wikipedia_link
    });
  }
  console.log('Airports imported');
}

module.exports = importCSV;