const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Airport',
  tableName: 'airport',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    icao_code: { type: 'varchar' },
    iata_code: { type: 'varchar' },
    name: { type: 'varchar' },
    type: { type: 'varchar' },
    city_id: { type: 'int' },
    country_id: { type: 'int' },
    continent_id: { type: 'int' },
    website_url: { type: 'varchar' },
    created_at: { type: 'datetime' },
    updated_at: { type: 'datetime' },
    latitude_deg: { type: 'float' },
    longitude_deg: { type: 'float' },
    elevation_ft: { type: 'int', nullable: true },
    wikipedia_link: { type: 'varchar', nullable: true },
  },
  relations: {
    city: {
      type: 'many-to-one',
      target: 'City',
      joinColumn: { name: 'city_id' },
      eager: true,
    },
  },
}); 