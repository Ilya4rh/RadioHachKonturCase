import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const deleteIcon = require('../images/delete-button-svgrepo-com.svg').default;

interface Tournament {
  id: string;
  name: string;
  dateTimeStart: string;
  dateTimeEnd: string;
}

interface TournamentFormData {
  name: string;
  dateTimeStart: string;
  dateTimeEnd: string;
}

interface Notification {
  message: string;
  type: 'error' | 'success';
  id: number;
}

export function Admin() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    dateTimeStart: formatDateTimeForInput(new Date()),
    dateTimeEnd: formatDateTimeForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  });

  function formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

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

  const addNotification = (message: string, type: 'error' | 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { message, type, id }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5085);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://84.201.156.127:5085/api/tournaments', {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      addNotification(`Ошибка при загрузке турниров: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const startNewTournament = async () => {
    try {
      if (!formData.name.trim()) {
        addNotification('Необходимо указать название турнира', 'error');
        return;
      }

      const startDate = new Date(formData.dateTimeStart);
      const endDate = new Date(formData.dateTimeEnd);

      if (startDate >= endDate) {
        addNotification('Дата окончания должна быть позже даты начала', 'error');
        return;
      }
      
      const response = await fetch('http://84.201.156.127:5085/api/tournaments/tournament/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain',
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          name: formData.name,
          dateTimeStart: startDate.toISOString(),
          dateTimeEnd: endDate.toISOString()
        }),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          dateTimeStart: formatDateTimeForInput(new Date()),
          dateTimeEnd: formatDateTimeForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        });
        fetchTournaments();
        addNotification('Турнир успешно создан', 'success');
      } else {
        const errorText = await response.text();
        addNotification(`Ошибка при создании турнира: ${errorText}`, 'error');
      }
    } catch (error) {
      addNotification(`Ошибка при создании турнира: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  const handleDeleteTournament = async (tournamentId: string, tournamentName: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить турнир "${tournamentName}"?`)) {
      try {
        const response = await fetch(`http://84.201.156.127:5085/api/tournaments/tournament/delete/${tournamentId}`, {
          method: 'DELETE',
          headers: {
            'accept': 'text/plain',
            "Access-Control-Allow-Origin": "*"
          }
        });

        if (response.ok) {
          setTournaments(prev => prev.filter(t => t.id !== tournamentId));
          addNotification('Турнир успешно удален', 'success');
        } else {
          const errorText = await response.text();
          addNotification(`Ошибка при удалении турнира: ${errorText || response.statusText}`, 'error');
        }
      } catch (error) {
        addNotification(`Ошибка при удалении турнира: ${error instanceof Error ? error.message : String(error)}`, 'error');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div>Загрузка...</div>
      </div>
    );
  }

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
        <h1 style={styles.title}>Панель управления турнирами</h1>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          style={styles.button}
        >
          Создать новый турнир
        </button>
        
        <h2 style={styles.subtitle}>Список турниров</h2>
        {tournaments.length === 0 ? (
          <p style={styles.emptyMessage}>Турниры отсутствуют</p>
        ) : (
          <ul style={styles.tournamentList}>
            {tournaments.map(tournament => (
              <li key={tournament.id} style={styles.tournamentItemContainer}>
                <Link to={`/admin/tournament/${tournament.id}`} style={styles.tournamentLinkWrapper}>
                  <div style={styles.tournamentHeader}>
                    <h3 style={styles.tournamentName}>{tournament.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteTournament(tournament.id, tournament.name);
                      }}
                      style={styles.deleteButton}
                      title="Удалить турнир"
                    >
                      <img src={deleteIcon} alt="Удалить" style={styles.deleteIcon} />
                    </button>
                  </div>
                  <div>
                    <p style={styles.tournamentDate}>
                      Дата начала: {formatDateTime(tournament.dateTimeStart)}
                    </p>
                    <p style={styles.tournamentDate}>
                      Дата окончания: {formatDateTime(tournament.dateTimeEnd)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Создание нового турнира</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Название турнира</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange} 
                style={styles.input}
                placeholder="Введите название турнира"
                autoFocus
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Дата и время начала</label>
              <input 
                type="datetime-local" 
                name="dateTimeStart"
                value={formData.dateTimeStart} 
                onChange={handleInputChange}
                style={styles.input} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Дата и время окончания</label>
              <input 
                type="datetime-local" 
                name="dateTimeEnd"
                value={formData.dateTimeEnd} 
                onChange={handleInputChange}
                style={styles.input} 
              />
            </div>
            <div style={styles.modalButtons}>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={styles.cancelButton}
              >
                Отмена
              </button>
              <button 
                onClick={startNewTournament} 
                style={styles.createButton}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
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
  title: {
    fontSize: '2rem',
    color: '#fff',
    marginBottom: '2rem',
    borderBottom: '1px solid #333',
    paddingBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#ccc',
    marginTop: '2rem',
    marginBottom: '1rem'
  },
  button: {
    padding: '12px 20px',
    background: '#3f51b5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s'
  },
  tournamentList: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  tournamentItemContainer: {
    padding: '20px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '6px',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  tournamentLinkWrapper: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit'
  },
  tournamentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  tournamentLink: {
    textDecoration: 'none',
    color: '#888',
    fontStyle: 'italic'
  },
  tournamentName: {
    margin: '0 0 10px 0',
    color: '#fff',
    fontSize: '1.2rem',
    overflowWrap: 'break-word' as const,
    wordBreak: 'break-word' as const,
    minWidth: 0,
    marginRight: '10px'
  },
  tournamentDate: {
    margin: 0,
    color: '#888',
    fontSize: '0.9rem'
  },
  emptyMessage: {
    color: '#888',
    fontStyle: 'italic'
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    padding: '30px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
  },
  modalTitle: {
    color: '#fff',
    marginTop: 0,
    marginBottom: '25px',
    fontSize: '1.5rem',
    borderBottom: '1px solid #333',
    paddingBottom: '10px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: '#ccc',
    marginBottom: '8px',
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#2c2c2c',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box' as const
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px'
  },
  cancelButton: {
    padding: '10px 18px',
    backgroundColor: 'transparent',
    border: '1px solid #555',
    color: '#ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  createButton: {
    padding: '10px 18px',
    backgroundColor: '#3f51b5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
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
  deleteButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    lineHeight: '1',
    marginLeft: '10px'
  },
  deleteIcon: {
    width: '20px',
    height: '20px',
    filter: 'invert(40%) sepia(81%) saturate(1009%) hue-rotate(326deg) brightness(101%) contrast(101%)'
  }
} 