// Notifications Module
console.log('Loading notifications module...');

const Notifications = {
    // Flag to track initialization
    _initialized: false,
    // Sample notifications data
    notifications: [
        {
            id: 1,
            type: 'reminder',
            title: 'Follow-up Reminder',
            message: 'Follow up with John Doe about the test drive',
            read: false,
            icon: 'event_available',
            timestamp: Date.now() - 2 * 60 * 1000 // 2 minutes ago
        },
        {
            id: 2,
            type: 'new_lead',
            title: 'New Lead',
            message: 'New lead added from website',
            read: false,
            icon: 'person_add',
            timestamp: Date.now() - 60 * 60 * 1000 // 1 hour ago
        },
        {
            id: 3,
            type: 'appointment',
            title: 'Service Appointment',
            message: 'Your car service is scheduled for tomorrow at 10:00 AM',
            read: true,
            icon: 'build',
            timestamp: Date.now() - 3 * 60 * 60 * 1000 // 3 hours ago
        }
    ],

    // Initialize the notifications
    init: function() {
        // Prevent multiple initializations
        if (this._initialized) {
            console.log('Notifications already initialized');
            return;
        }
        
        console.log('Initializing notifications...');
        
        // Cache DOM elements
        this.notificationsButton = document.getElementById('notifications-button');
        this.notificationsPanel = document.querySelector('.notifications-panel');
        this.notificationsList = document.getElementById('notifications-list');
        this.notificationCountBadge = document.getElementById('notification-count');
        this.markAllReadBtn = document.querySelector('.mark-all-read');
        
        console.log('Notifications button:', this.notificationsButton);
        console.log('Notifications panel:', this.notificationsPanel);
        
        if (!this.notificationsButton || !this.notificationsPanel) {
            console.error('Required elements not found');
            return;
        }
        
        this.bindEvents();
        this.renderNotifications();
        this.updateUnreadCount();
        
        this._initialized = true;
        console.log('Notifications initialized');
        return this;
    },
    
    // Bind event listeners
    bindEvents: function() {
        // Toggle notifications panel
        this.notificationsButton.addEventListener('click', (e) => this.toggleNotifications(e));
        
        // Close when clicking outside
        document.addEventListener('click', () => this.closeNotifications());
        
        // Prevent panel from closing when clicking inside
        this.notificationsPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Mark all as read
        if (this.markAllReadBtn) {
            this.markAllReadBtn.addEventListener('click', () => this.markAllAsRead());
        }
    },
    
    // Toggle notifications panel
    toggleNotifications: function(e) {
        e.stopPropagation();
        console.log('Toggle notifications');
        const isActive = this.notificationsPanel.parentElement.classList.toggle('active');
        
        // Mark as read when opening
        if (isActive) {
            this.markAllAsRead();
        }
    },
    
    // Close notifications panel
    closeNotifications: function() {
        this.notificationsPanel.parentElement.classList.remove('active');
    },
    
    // Mark all notifications as read
    markAllAsRead: function() {
        this.notifications = this.notifications.map(notification => ({
            ...notification,
            read: true
        }));
        
        this.updateUnreadCount();
        this.renderNotifications();
    },
    
    // Update the unread count badge
    updateUnreadCount: function() {
        if (!this.notificationCountBadge) return;
        
        const unreadCount = this.notifications.filter(n => !n.read).length;
        this.notificationCountBadge.textContent = unreadCount;
        this.notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    },
    
    // Render notifications list
    renderNotifications: function() {
        if (!this.notificationsList) return;
        
        // Sort by timestamp (newest first)
        const sortedNotifications = [...this.notifications].sort((a, b) => b.timestamp - a.timestamp);
        
        this.notificationsList.innerHTML = sortedNotifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon">
                    <span class="material-icons">${notification.icon}</span>
                </div>
                <div class="notification-content">
                    <p><strong>${notification.title}</strong> ${notification.message}</p>
                    <span class="notification-time">${this.formatTimeAgo(notification.timestamp)}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers to notification items
        this.notificationsList.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const notificationId = parseInt(item.getAttribute('data-id'));
                this.markAsRead(notificationId);
            });
        });
    },
    
    // Mark a single notification as read
    markAsRead: function(notificationId) {
        this.notifications = this.notifications.map(notification => 
            notification.id === notificationId 
                ? { ...notification, read: true }
                : notification
        );
        
        this.updateUnreadCount();
        this.renderNotifications();
    },
    
    // Format timestamp as "time ago"
    formatTimeAgo: function(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
        
        return 'just now';
    },
    
    // Add a new notification
    addNotification: function(notification) {
        const newNotification = {
            id: Date.now(),
            timestamp: Date.now(),
            read: false,
            ...notification
        };
        
        this.notifications.unshift(newNotification);
        this.updateUnreadCount();
        this.renderNotifications();
    }
};

// Make it globally available
window.Notifications = Notifications;
