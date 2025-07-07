const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Country',
  tableName: 'country',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    name: { type: 'varchar' },
    alt_name: { type: 'varchar' },
    country_code_two: { type: 'varchar' },
    country_code_three: { type: 'varchar' },
    mobile_code: { type: 'int' },
    continent_id: { type: 'int' },
    country_flag: { type: 'varchar' },
  },
});
