import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    formContainer: {
        backgroundColor: '#1e1e1e',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#ffffff',
        fontSize: '1.8rem',
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontWeight: 'bold',
        color: '#ccc',
        fontSize: '0.95rem',
    },
    input: {
        padding: '12px',
        backgroundColor: '#2c2c2c',
        border: '1px solid #444',
        borderRadius: '4px',
        color: '#ffffff',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#3f51b5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginTop: '10px',
        transition: 'background-color 0.2s ease',
    },
    buttonHover: {
        backgroundColor: '#303f9f',
    },
    error: {
        color: '#d32f2f',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        textAlign: 'center',
        marginTop: '5px',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid rgba(211, 47, 47, 0.3)',
        fontSize: '0.9rem',
    }
};

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };
    
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        try {
            const apiUrl = 'http://51.250.34.126:5085/api/authentication/authenticate';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify({ name: username, password: password }),
            });

            if (response.ok) {
                try {
                    const result = await response.json(); 
                    if (result && result.authenticationResult === 2) {
                        sessionStorage.setItem('isAuthenticated', 'true');
                        navigate('/admin');
                    } else {
                        setError('Неверное имя пользователя или пароль.');
                        sessionStorage.removeItem('isAuthenticated');
                    }
                } catch (parseError) {
                    console.error('Ошибка парсинга ответа аутентификации:', parseError);
                    setError('Ошибка обработки ответа сервера.');
                    sessionStorage.removeItem('isAuthenticated');
                }
            } else {
                let errorMessage = `Ошибка сети: ${response.status}`;
                try {
                    const errorBody = await response.text(); 
                    if (errorBody) {
                        errorMessage += ` - ${errorBody}`;
                    }
                } catch (e) { } 
                setError(errorMessage);
                sessionStorage.removeItem('isAuthenticated');
            }
        } catch (err) {
            console.error('Ошибка при запросе аутентификации:', err);
            setError('Не удалось подключиться к серверу аутентификации.');
            sessionStorage.removeItem('isAuthenticated');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.formContainer}>
                <h2 style={styles.title}>Вход для администратора</h2>
                
                <div style={styles.formGroup}>
                    <label htmlFor="username" style={styles.label}>Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>
                
                {error && <p style={styles.error}>{error}</p>}
                
                <button 
                  type="submit" 
                  style={{ ...styles.button, ...(isButtonHovered ? styles.buttonHover : {}) }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                    Войти
                </button>
            </form>
        </div>
    );
}; 