const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración del Pool de PostgreSQL CON SSL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: 'database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com', 
  database: process.env.DB_NAME || 'proyecto',
  password: process.env.DB_PASSWORD || 'mora7704.',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // ← CONFIGURACIÓN SSL OBLIGATORIA para RDS
});

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend funcionando en AWS ECS',
    endpoints: {
      users: '/users',
      health: '/health',
      root: '/'
    },
    database: {
      host: 'database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com',
      connected: true
    }
  });
});

// Endpoint para obtener usuarios
app.get('/users', async (req, res) => {
  try {
    console.log('Consultando usuarios desde DB:', 'database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com');
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    console.log(`Encontrados ${result.rows.length} usuarios`);
    res.json(result.rows);
  } catch (error) {
    console.error(' Error en /users:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener usuarios',
      details: error.message,
      dbHost: 'database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com'
    });
  }
});

// Health para revisar el bd endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK',
      backend: 'running',
      database: 'connected',
      timestamp: new Date().toISOString(),
      dbHost: 'database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      backend: 'running',
      database: 'disconnected',
      error: error.message,
      dbHost: 'database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com'
    });
  }
});

// Conexión con reintentos
const connectWithRetry = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      // Mostrar configuración
      console.log('DEBUG: Intentando conectar a PostgreSQL...');
      console.log('Configuración:', {
        host: 'database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com',
        database: process.env.DB_NAME || 'proyecto',
        user: process.env.DB_USER || 'postgres',
        port: process.env.DB_PORT || 5432,
        ssl: true
      });
      
      await pool.query('SELECT 1');
      console.log('Conectado a la base de datos exitosamente');
      break;
    } catch (err) {
      console.log(`Error conectando a BD, reintentos restantes: ${retries}`);
      console.log('Detalles del error:', err.message);
      console.log('Stack completo:', err.stack);
      
      retries -= 1;
      if (retries === 0) {
        console.log('No se pudo conectar a la base de dato');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000)); // Espera 5 segundos
    }
  }
};

// Iniciar servidor
const startServer = async () => {
  try {
    console.log('DB_HOST:', process.env.DB_HOST || 'No definido (usando valor fijo)');
    console.log('DB_NAME:', process.env.DB_NAME || 'proyecto (valor por defecto)');
    console.log('DB_USER:', process.env.DB_USER || 'postgres (valor por defecto)');
    console.log('DB_PORT:', process.env.DB_PORT || '5432 (valor por defecto)');
    console.log('PGSSLMODE:', process.env.PGSSLMODE || 'No definido (usando SSL)');
    
    await connectWithRetry();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(` Backend corriendo en http://0.0.0.0:${PORT}`);
      console.log(`  Base de datos: database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com`);
      console.log(' Endpoints disponibles:');
      console.log('   GET /          - Info del backend');
      console.log('   GET /users     - Obtener usuarios');
      console.log('   GET /health    - Health check');
      console.log('');
      console.log(' URLs para probar:');
      console.log(`   Health: http://<TU-IP>:${PORT}/health`);
      console.log(`   Users:  http://<TU-IP>:${PORT}/users`);
    });
  } catch (error) {
    console.error('💥 Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();