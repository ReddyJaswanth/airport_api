const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'City',
  tableName: 'city',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    name: { type: 'varchar' },
    is_active: { type: 'boolean', default: true },
    lat: { type: 'float' },
    long: { type: 'float' },
    country_id: { type: 'int' },
    alt_name: { type: 'varchar' },
    created_at: { type: 'datetime' },
    updated_at: { type: 'datetime' },
  },
  relations: {
    country: {
      type: 'many-to-one',
      target: 'Country',
      joinColumn: { name: 'country_id' },
      eager: true,
    },
  },
});
