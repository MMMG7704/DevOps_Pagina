const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'proyecto',
  user: 'postgres',
  password: 'mora7704.',
});

async function testDatabase() {
  console.log(' Probando conexión a PostgreSQL...\n');

  let client;
  try {
    // Conectar a la base de datos
    client = await pool.connect();
    console.log(' Conexión a PostgreSQL exitosa');

    // 1. Verificar tablas existentes
    console.log('\n Tablas en la base de datos:');
    const tablesQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(tablesQuery.rows);

    // 2. Crear tabla users si no existe
    console.log('\n Verificando/Creando tabla users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla users lista');

    // 3. Insertar usuario de prueba
    console.log('\ Insertando usuario de prueba...');
    const insertQuery = `
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email, created_at
    `;
    
    const userData = {
      name: 'Usuario Test Terminal',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    const result = await client.query(insertQuery, [
      userData.name, 
      userData.email, 
      userData.password
    ]);

    console.log(' Usuario insertado:', result.rows[0]);

    // 4. Ver todos los usuarios
    console.log('\n Lista de todos los usuarios:');
    const usersQuery = await client.query(`
      SELECT id, name, email, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    console.log(`Total de usuarios: ${usersQuery.rows.length}`);
    usersQuery.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.created_at}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

testDatabase();