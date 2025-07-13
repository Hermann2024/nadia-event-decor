import React, { useState, useEffect, useRef } from 'react';
import './NotificationCenter.css';

const NotificationCenter = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wsRef = useRef(null);

    const API_BASE_URL = 'http://localhost:8082/api';

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            setupWebSocket();
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [userId]);

    const setupWebSocket = () => {
        try {
            // Connexion WebSocket pour les notifications en temps réel
            const ws = new WebSocket('ws://localhost:8082/ws');
            
            ws.onopen = () => {
                console.log('WebSocket connecté');
                // S'abonner aux notifications de l'utilisateur
                ws.send(JSON.stringify({
                    type: 'SUBSCRIBE',
                    userId: userId
                }));
            };

            ws.onmessage = (event) => {
                const notification = JSON.parse(event.data);
                handleNewNotification(notification);
            };

            ws.onerror = (error) => {
                console.error('Erreur WebSocket:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket déconnecté');
                // Tentative de reconnexion après 5 secondes
                setTimeout(() => {
                    if (userId) {
                        setupWebSocket();
                    }
                }, 5000);
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Erreur lors de la connexion WebSocket:', error);
        }
    };

    const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Afficher une notification toast
        showToast(notification);
    };

    const showToast = (notification) => {
        // Créer un élément toast temporaire
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-header">
                <strong>${notification.title}</strong>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="toast-body">${notification.message}</div>
        `;
        
        document.body.appendChild(toast);
        
        // Supprimer le toast après 5 secondes
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/admin/notifications/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications/user/${userId}/unread-count`);
            if (response.ok) {
                const count = await response.json();
                setUnreadCount(count);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du compteur:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications/${notificationId}/read`, {
                method: 'PUT'
            });
            if (response.ok) {
                setNotifications(prev => 
                    prev.map(notif => 
                        notif.id === notificationId 
                            ? { ...notif, status: 'READ' }
                            : notif
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications/user/${userId}/read-all`, {
                method: 'PUT'
            });
            if (response.ok) {
                setNotifications(prev => 
                    prev.map(notif => ({ ...notif, status: 'READ' }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Erreur lors du marquage de tout comme lu:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/notifications/${notificationId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
                // Décrémenter le compteur si la notification n'était pas lue
                const notification = notifications.find(n => n.id === notificationId);
                if (notification && notification.status === 'UNREAD') {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            'QUOTE_REQUEST_NEW': '📋',
            'QUOTE_REQUEST_ASSIGNED': '👤',
            'QUOTE_REQUEST_UPDATED': '🔄',
            'QUOTE_CREATED': '📄',
            'QUOTE_SENT': '📤',
            'QUOTE_ACCEPTED': '✅',
            'QUOTE_REJECTED': '❌',
            'INVOICE_CREATED': '🧾',
            'INVOICE_SENT': '📤',
            'INVOICE_PAID': '💰',
            'INVOICE_OVERDUE': '⚠️',
            'SYSTEM_ALERT': '🚨',
            'REMINDER': '⏰'
        };
        return icons[type] || '📢';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'À l\'instant';
        } else if (diffInHours < 24) {
            return `Il y a ${Math.floor(diffInHours)}h`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    };

    return (
        <div className="notification-center">
            <div className="notification-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className="notification-icon">🔔</span>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </div>

            {isOpen && (
                <div className="notification-panel">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <div className="notification-actions">
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="mark-all-read-btn">
                                    Tout marquer comme lu
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="close-btn">
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="loading">Chargement...</div>
                        ) : notifications.length === 0 ? (
                            <div className="no-notifications">
                                Aucune notification
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item ${notification.status === 'UNREAD' ? 'unread' : ''}`}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {notification.title}
                                        </div>
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                        <div className="notification-time">
                                            {formatDate(notification.createdAt)}
                                        </div>
                                    </div>
                                    <div className="notification-actions">
                                        {notification.status === 'UNREAD' && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="mark-read-btn"
                                                title="Marquer comme lu"
                                            >
                                                ✓
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notification.id)}
                                            className="delete-btn"
                                            title="Supprimer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter; 