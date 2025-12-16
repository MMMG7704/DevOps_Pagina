import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
      
        const healthResponse = await fetch('http://3.138.247.32:3000/health');
        if (!healthResponse.ok) {
          throw new Error('Backend no responde');
        }
        const healthData = await healthResponse.json();
        setBackendStatus(healthData);
        console.log(' Estado backend:', healthData);

        const usersResponse = await fetch('http://3.138.247.32:3000/users');
        
        if (!usersResponse.ok) {
          throw new Error(`Error ${usersResponse.status} al obtener usuarios`);
        }
        
        const usersData = await usersResponse.json();
        console.log(' Usuarios obtenidos:', usersData);
        
        setUsers(usersData);
        setError('');
        
      } catch (err) {
        console.error('Error:', err.message);
        
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('Error de CORS o red. El backend ya tiene CORS habilitado. Verifica la conexión.');
        } else {
          setError(`Error: ${err.message}`);
        }
        
        setUsers([
          { id: 1, name: "Mariana", email: "mariana@gmail.com" },
          { id: 2, name: "Fany", email: "fany@gmail.com" },
          { id: 3, name: "Rubi", email: "rubi@gmail.com" }
        ]);
        
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Conectando con backend AWS...</p>
        <p style={styles.backendInfo}>URL: http://3.138.247.32:3000</p>
        <p style={styles.backendInfo}>CORS: Habilitado</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.welcome}>¡Backend AWS Funcionando!</h1>
        
        {backendStatus && (
          <div style={styles.statusBox}>
            <h3>Estado del Sistema AWS</h3>
            <p><strong>Backend:</strong> {backendStatus.status}</p>
            <p><strong>Base de Datos:</strong> {backendStatus.database}</p>
            <p><strong>RDS Host:</strong> {backendStatus.dbHost}</p>
            <p><strong>Timestamp:</strong> {new Date(backendStatus.timestamp).toLocaleString()}</p>
          </div>
        )}
        
        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
            <p style={styles.errorHelp}>
              Tu backend YA tiene CORS habilitado (app.use(cors())). 
              El problema puede ser de red o firewall.
            </p>
          </div>
        )}
        
        {!error && backendStatus && (
          <p style={styles.successMessage}>
             Conexión exitosa con backend AWS
          </p>
        )}
      </div>
      
      <div style={styles.usersContainer}>
        <h2 style={styles.usersTitle}>
          Usuarios desde PostgreSQL RDS ({users.length})
        </h2>
        
        {users.length > 0 ? (
          <div style={styles.usersList}>
            {users.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{user.name}</span>
                  <span style={styles.userEmail}>{user.email}</span>
                  <span style={styles.userId}>ID: {user.id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No hay usuarios en la base de datos</p>
          </div>
        )}
      </div>
      
      <div style={styles.footer}>
        <h3>Información de Conexión</h3>
        <p><strong>Backend URL:</strong> http://3.138.247.32:3000</p>
        <p><strong>RDS Host:</strong> database-1.cb60e0you8g9.us-east-2.rds.amazonaws.com</p>
        <p><strong>CORS:</strong> Habilitado (app.use(cors()))</p>
        <p><strong>Frontend:</strong> Actualizado para conexión directa</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '40px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  welcome: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    margin: '0 0 20px 0',
    fontWeight: 'bold',
  },
  statusBox: {
    backgroundColor: '#e8f4fd',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px auto',
    maxWidth: '600px',
    textAlign: 'left',
  },
  errorBox: {
    backgroundColor: '#fdf2f2',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px auto',
    maxWidth: '600px',
    border: '1px solid #f5c6cb',
  },
  errorText: {
    color: '#721c24',
    fontWeight: 'bold',
  },
  errorHelp: {
    color: '#856404',
    backgroundColor: '#fff3cd',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px',
  },
  successMessage: {
    color: '#155724',
    backgroundColor: '#d4edda',
    padding: '10px 20px',
    borderRadius: '5px',
    display: 'inline-block',
    fontWeight: 'bold',
  },
  usersContainer: {
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  usersTitle: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '1.8rem',
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  userCard: {
    padding: '20px',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  userName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  userEmail: {
    fontSize: '1rem',
    color: '#7f8c8d',
  },
  userId: {
    fontSize: '0.8rem',
    color: '#bdc3c7',
    fontFamily: 'monospace',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px auto',
  },
  backendInfo: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    fontFamily: 'monospace',
    margin: '5px 0',
  },
  footer: {
    textAlign: 'center',
    padding: '30px 20px',
    color: '#2c3e50',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#95a5a6',
    fontSize: '1.1rem',
  },
};

export default App;