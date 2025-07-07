const express = require('express');
const NodeCache = require('node-cache');
const AppDataSource = require('../data-source');
const router = express.Router();

const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// Helper: Validate IATA code
function isValidIata(code) {
  return /^[A-Z]{3}$/.test(code);
}

router.get('/:iata_code', async (req, res, next) => {
  try {
    const iata_code = req.params.iata_code.toUpperCase();
    if (!isValidIata(iata_code)) {
      return res.status(400).json({ error: 'Invalid IATA code format' });
    }

    // Check cache
    const cached = cache.get(iata_code);
    if (cached) return res.json(cached);

    const airportRepo = AppDataSource.getRepository('Airport');
    const airport = await airportRepo.findOne({
      where: { iata_code },
      relations: ['city', 'city.country'],
    });

    if (!airport) {
      return res.status(404).json({ error: 'Airport not found' });
    }

    // Format response
    const response = {
      airport: {
        id: airport.id,
        icao_code: airport.icao_code,
        iata_code: airport.iata_code,
        name: airport.name,
        type: airport.type,
        latitude_deg: airport.latitude_deg,
        longitude_deg: airport.longitude_deg,
        elevation_ft: airport.elevation_ft,
        address: {
          city: airport.city
            ? {
                id: airport.city.id,
                name: airport.city.name,
                country_id: airport.city.country_id,
                is_active: airport.city.is_active,
                lat: airport.city.lat,
                long: airport.city.long,
              }
            : null,
          country: airport.city && airport.city.country
            ? {
                id: airport.city.country.id,
                name: airport.city.country.name.trim(),
                country_code_two: airport.city.country.country_code_two.trim(),
                country_code_three: airport.city.country.country_code_three.trim(),
                mobile_code: airport.city.country.mobile_code,
                continent_id: airport.city.country.continent_id,
              }
            : null,
        },
      },
    };

    cache.set(iata_code, response);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
