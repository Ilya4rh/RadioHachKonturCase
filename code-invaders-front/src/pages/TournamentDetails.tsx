import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

interface GameResult {
  id: string;
  playerName: string;
  numberOfPoints: number;
  tournamentId: string;
}

interface Tournament {
  id: string;
  name: string;
  dateTimeStart: string;
  dateTimeEnd: string;
}

interface Notification {
  message: string;
  type: 'error' | 'success';
  id: string;
}

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function TournamentDetails() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [results, setResults] = useState<GameResult[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'error' | 'success') => {
    const id = generateUniqueId();
    setNotifications(prev => [...prev, { message, type, id }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleString('ru-RU', options);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (!tournamentId) {
        setLoading(false);
        return;
      }
      
      try {
        const resultsResponse = await fetch(`http://localhost:5085/api/gameResults/${tournamentId}`);
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          setResults(resultsData);
        } else {
          const errorText = await resultsResponse.text();
          addNotification(`Ошибка при загрузке результатов: ${errorText}`, 'error');
        }

        const tournamentResponse = await fetch(`http://localhost:5085/api/tournaments/tournament/${tournamentId}`);
        if (tournamentResponse.ok) {
          const tournamentData = await tournamentResponse.json();
          setTournament(tournamentData);
        } else {
          const errorText = await tournamentResponse.text();
          addNotification(`Ошибка при загрузке информации о турнире: ${errorText}`, 'error');
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        addNotification(`Ошибка при загрузке данных: ${error instanceof Error ? error.message : String(error)}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tournamentId]);

  const getRowStyle = (index: number) => {
    if (index === 0) return { ...styles.cell, ...styles.goldRow };
    if (index === 1) return { ...styles.cell, ...styles.silverRow };
    if (index === 2) return { ...styles.cell, ...styles.bronzeRow };
    return styles.cell;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div>Загрузка...</div>
      </div>
    );
  }

  const gameUrl = window.location.origin;

  return (
    <div style={styles.container}>
      {/* Уведомления */}
      <div style={styles.notificationsContainer}>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            style={{
              ...styles.notification,
              ...(notification.type === 'error' ? styles.errorNotification : styles.successNotification)
            }}
          >
            {notification.message}
            <button 
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              style={styles.closeNotification}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      
      <div style={styles.content}>
        <Link 
          to="/admin"
          style={styles.backLink}
        >
          &larr; Назад к списку турниров
        </Link>
        
        <h1 style={styles.title}>{tournament?.name || 'Результаты турнира'}</h1>
        
        {tournament && (
          <div style={styles.dateTimeInfo}>
            <p style={styles.dateTime}>
              <span style={styles.dateTimeLabel}>Начало турнира:</span> {formatDateTime(tournament.dateTimeStart)}
            </p>
            <p style={styles.dateTime}>
              <span style={styles.dateTimeLabel}>Конец турнира:</span> {formatDateTime(tournament.dateTimeEnd)}
            </p>
          </div>
        )}
        
        <div style={styles.resultsContainer}>
          <div style={styles.tableSection}>
            {results.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyMessage}>Результаты отсутствуют</p>
              </div>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.headerCell}>Место</th>
                      <th style={styles.headerCell}>Имя игрока</th>
                      <th style={{...styles.headerCell, textAlign: 'right'}}>Счет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      .sort((a, b) => b.numberOfPoints - a.numberOfPoints)
                      .map((result, index) => {
                        let rowStyle;
                        if (index === 0) rowStyle = styles.place1Row;
                        else if (index === 1) rowStyle = styles.place2Row;
                        else if (index === 2) rowStyle = styles.place3Row;
                        
                        return (
                          <tr key={result.id} style={rowStyle}>
                            <td style={getRowStyle(index)}>{index + 1}</td>
                            <td style={getRowStyle(index)}>{result.playerName}</td>
                            <td style={{...getRowStyle(index), textAlign: 'right'}}>{result.numberOfPoints}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div style={styles.qrCodeSection}>
            <div style={styles.qrCodeContainer}>
              <p style={styles.qrCodeLabel}>Сканируйте QR-код, чтобы начать игру:</p>
              <QRCodeSVG value={gameUrl} size={250} bgColor={'#1e1e1e'} fgColor={'#ffffff'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#e0e0e0',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    overflowX: 'hidden' as const
  },
  content: {
    width: '100%',
    maxWidth: '1000px',
    padding: '40px 20px',
    aspectRatio: '16/9',
    overflow: 'auto' as const
  },
  backLink: { 
    display: 'inline-block', 
    marginBottom: '20px',
    textDecoration: 'none',
    color: '#5c6bc0',
    fontSize: '1rem',
    transition: 'color 0.2s'
  },
  title: {
    fontSize: '2rem',
    color: '#fff',
    marginBottom: '2rem',
    borderBottom: '1px solid #333',
    paddingBottom: '0.5rem'
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto' as const,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    borderRadius: '6px',
    backgroundColor: '#1e1e1e'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    borderRadius: '6px',
    overflow: 'hidden' as const
  },
  headerCell: {
    textAlign: 'left' as const,
    padding: '16px 20px',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    fontWeight: 600,
    borderBottom: '2px solid #444'
  },
  cell: {
    padding: '14px 20px',
    borderBottom: '1px solid #333',
    color: '#ccc'
  },
  goldRow: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    color: '#fff',
    fontWeight: 600
  },
  silverRow: {
    backgroundColor: 'rgba(192, 192, 192, 0.15)',
    color: '#eee',
    fontWeight: 600
  },
  bronzeRow: {
    backgroundColor: 'rgba(205, 127, 50, 0.15)',
    color: '#eee',
    fontWeight: 600
  },
  place1Row: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)'
  },
  place2Row: {
    backgroundColor: 'rgba(192, 192, 192, 0.15)'
  },
  place3Row: {
    backgroundColor: 'rgba(205, 127, 50, 0.15)'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    backgroundColor: '#1e1e1e',
    borderRadius: '6px'
  },
  emptyMessage: {
    color: '#888',
    fontSize: '1.1rem',
    fontStyle: 'italic'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#e0e0e0'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTop: '3px solid #3f51b5',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  },
  notificationsContainer: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 1500,
    width: '300px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  notification: {
    padding: '15px 20px',
    borderRadius: '4px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    animation: 'slideIn 0.3s'
  },
  errorNotification: {
    backgroundColor: '#d32f2f',
    color: 'white'
  },
  successNotification: {
    backgroundColor: '#388e3c',
    color: 'white'
  },
  closeNotification: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    marginLeft: '15px'
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '20px',
    width: '100%',
    marginTop: '20px'
  },
  tableSection: {
    flex: '1',
    minWidth: '0',
  },
  qrCodeSection: {
    width: '320px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  dateTimeInfo: {
    backgroundColor: '#1e1e1e',
    borderRadius: '6px',
    padding: '15px 20px',
    marginBottom: '20px',
  },
  dateTime: {
    fontSize: '1.1rem',
    margin: '10px 0',
    color: '#ccc'
  },
  dateTimeLabel: {
    fontWeight: 'bold',
    color: '#fff'
  },
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#2c2c2c',
    minWidth: '300px',
  },
  qrCodeLabel: {
    marginBottom: '20px',
    color: '#ccc',
    fontSize: '1.1rem',
    textAlign: 'center' as const
  },
} 