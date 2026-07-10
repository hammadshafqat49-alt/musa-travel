const { initDb, seedDb } = require('../src/lib/db.ts');

initDb();
seedDb();
console.log('Database initialized and seeded.');
