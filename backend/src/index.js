const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración  Docker
const pool = new Pool({
  user: 'postgres',
  host: 'database',  // nombre del servicio en docker-compose
  database: 'proyecto',
  password: 'mora7704.',
  port: 5432
});

//  conectar a la BD
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.query('SELECT 1');
      console.log('Conectado a la base de datos');
      break;
    } catch (err) {
      console.log(`Error conectando a BD, reintentos restantes: ${retries}`);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Backend funcionando' });
});

// Iniciar conexión y servidor
connectWithRetry().then(() => {
  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(` Backend corriendo en http://0.0.0.0:${PORT}`);
  });
});