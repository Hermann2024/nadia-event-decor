class NotificationService {
  constructor() {
    this.permission = 'default';
    this.init();
  }

  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
    }
  }

  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission;
    }
    return 'denied';
  }

  async showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.log('Notifications non autorisées');
      return;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      silent: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification:', error);
    }
  }

  async showChatNotification(senderName, message) {
    return this.showNotification(
      `Nouveau message de ${senderName}`,
      {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'chat-message',
        requireInteraction: false,
        silent: false
      }
    );
  }

  async showSystemNotification(title, message) {
    return this.showNotification(title, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'system-notification',
      requireInteraction: false,
      silent: false
    });
  }
}

export default new NotificationService(); 