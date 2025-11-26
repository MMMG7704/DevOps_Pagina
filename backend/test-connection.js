const { Pool } = require('pg');

console.log(' Probando conexión a RDS PostgreSQL...');

const pool = new Pool({
  host: 'devopsaplicacion-db.cs3kg6mamnj9.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'mora7704.', 
  database: 'devopsaplicacion',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW() as current_time', (err, res) => {
  if (err) {
    console.error(' Error conectando a BD:', err.message);
    console.log(' Posibles causas:');
    console.log('   - Password incorrecto');
    console.log('   - Security Group no configurado');
    console.log('   - BD no está disponible');
  } else {
    console.log(' CONEXIÓN EXITOSA!');
    console.log(' Hora del servidor:', res.rows[0].current_time);
    console.log(' Tu BD está funcionando correctamente!');
  }
  pool.end();
});