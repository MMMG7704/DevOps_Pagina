import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) throw new Error('Error del servidor');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError('No se pudieron cargar los usuarios. Verifica que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.loading}>Cargando usuarios...</div>
    </div>
  );

  if (error) return (
    <div style={styles.container}>
      <div style={styles.error}>{error}</div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.welcome}>¡Bienvenido!</h1>
        <p style={styles.subtitle}>Lista de usuarios registrados en el sistema</p>
      </div>
      
      <div style={styles.usersContainer}>
        <h2 style={styles.usersTitle}>Usuarios Registrados</h2>
        <div style={styles.usersList}>
          {users.map((user) => (
            <div key={user.id} style={styles.userCard}>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userEmail}>{user.email}</span>
              </div>
            </div>
          ))}
        </div>
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
    margin: '0 0 10px 0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    margin: '0',
  },
  usersContainer: {
    maxWidth: '600px',
    margin: '0 auto',
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
    transition: 'all 0.3s ease',
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
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#7f8c8d',
    padding: '40px',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#e74c3c',
    padding: '40px',
    backgroundColor: '#fdf2f2',
    borderRadius: '8px',
    border: '1px solid #f5c6cb',
  },
};

export default App;