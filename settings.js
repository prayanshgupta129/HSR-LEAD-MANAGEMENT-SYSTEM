// Settings Module
const Settings = (function() {
    // DOM Elements
    let settingsContainer;
    
    // Default settings
    const defaultSettings = {
        notifications: {
            email: true,
            push: true,
            sound: false
        },
        display: {
            theme: 'light',
            density: 'comfortable',
            fontSize: 'medium'
        },
        data: {
            itemsPerPage: 10,
            autoRefresh: true,
            refreshInterval: 5
        },
        integrations: {
            googleCalendar: false,
            outlook: false,
            slack: false
        }
    };
    
    // Current settings
    let currentSettings = {...defaultSettings};
    
    // Initialize the settings
    function init() {
        settingsContainer = document.getElementById('settings-screen');
        if (!settingsContainer) return;
        
        // Load saved settings or use defaults
        loadSettings();
        renderSettings();
    }
    
    // Load settings from localStorage
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('appSettings');
            if (savedSettings) {
                currentSettings = {
                    ...defaultSettings,
                    ...JSON.parse(savedSettings)
                };
            }
        } catch (e) {
            console.error('Error loading settings:', e);
            // Use default settings if there's an error
            currentSettings = {...defaultSettings};
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        try {
            localStorage.setItem('appSettings', JSON.stringify(currentSettings));
            showNotification('Settings saved successfully', 'success');
        } catch (e) {
            console.error('Error saving settings:', e);
            showNotification('Failed to save settings', 'error');
        }
    }
    
    // Render the settings form
    function renderSettings() {
        if (!settingsContainer) return;
        
        settingsContainer.innerHTML = `
            <div class="settings-container">
                <div class="settings-header">
                    <h1>Settings</h1>
                    <button class="btn primary" id="save-settings">
                        <span class="material-icons">save</span>
                        Save Changes
                    </button>
                </div>
                
                <div class="settings-tabs">
                    <button class="tab-btn active" data-tab="general">
                        <span class="material-icons">settings</span>
                        General
                    </button>
                    <button class="tab-btn" data-tab="notifications">
                        <span class="material-icons">notifications</span>
                        Notifications
                    </button>
                    <button class="tab-btn" data-tab="display">
                        <span class="material-icons">palette</span>
                        Display
                    </button>
                    <button class="tab-btn" data-tab="data">
                        <span class="material-icons">storage</span>
                        Data
                    </button>
                    <button class="tab-btn" data-tab="integrations">
                        <span class="material-icons">link</span>
                        Integrations
                    </button>
                    <button class="tab-btn" data-tab="account">
                        <span class="material-icons">account_circle</span>
                        Account
                    </button>
                </div>
                
                <div class="settings-content">
                    <!-- General Settings -->
                    <div class="tab-pane active" id="general-settings">
                        <div class="settings-section">
                            <h2>General Settings</h2>
                            <p>Manage your general application preferences</p>
                            
                            <div class="form-group">
                                <label for="language">Language</label>
                                <select id="language" class="form-control">
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="hi">हिंदी</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="timezone">Time Zone</label>
                                <select id="timezone" class="form-control">
                                    <option value="UTC">UTC</option>
                                    <option value="IST" selected>Indian Standard Time (IST)</option>
                                    <option value="EST">Eastern Time (ET)</option>
                                    <option value="PST">Pacific Time (PT)</option>
                                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="date-format">Date Format</label>
                                <select id="date-format" class="form-control">
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Notification Settings -->
                    <div class="tab-pane" id="notification-settings">
                        <div class="settings-section">
                            <h2>Notification Preferences</h2>
                            <p>Choose how you want to receive notifications</p>
                            
                            <div class="settings-item">
                                <div class="settings-item-content">
                                    <h4>Email Notifications</h4>
                                    <p>Receive notifications via email</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="email-notifications" ${currentSettings.notifications.email ? 'checked' : ''}>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-item-content">
                                    <h4>Push Notifications</h4>
                                    <p>Receive browser notifications</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="push-notifications" ${currentSettings.notifications.push ? 'checked' : ''}>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-item-content">
                                    <h4>Sound Alerts</h4>
                                    <p>Play sound for new notifications</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="sound-notifications" ${currentSettings.notifications.sound ? 'checked' : ''}>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Display Settings -->
                    <div class="tab-pane" id="display-settings">
                        <div class="settings-section">
                            <h2>Display Settings</h2>
                            <p>Customize the look and feel of the application</p>
                            
                            <div class="form-group">
                                <label>Theme</label>
                                <div class="theme-options">
                                    <label class="theme-option">
                                        <input type="radio" name="theme" value="light" ${currentSettings.display.theme === 'light' ? 'checked' : ''}>
                                        <div class="theme-preview light-theme">
                                            <span class="material-icons">light_mode</span>
                                            <span>Light</span>
                                        </div>
                                    </label>
                                    <label class="theme-option">
                                        <input type="radio" name="theme" value="dark" ${currentSettings.display.theme === 'dark' ? 'checked' : ''}>
                                        <div class="theme-preview dark-theme">
                                            <span class="material-icons">dark_mode</span>
                                            <span>Dark</span>
                                        </div>
                                    </label>
                                    <label class="theme-option">
                                        <input type="radio" name="theme" value="system" ${currentSettings.display.theme === 'system' ? 'checked' : ''}>
                                        <div class="theme-preview system-theme">
                                            <span class="material-icons">settings_suggest</span>
                                            <span>System</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="density">Density</label>
                                <select id="density" class="form-control">
                                    <option value="compact" ${currentSettings.display.density === 'compact' ? 'selected' : ''}>Compact</option>
                                    <option value="comfortable" ${currentSettings.display.density === 'comfortable' ? 'selected' : ''}>Comfortable</option>
                                    <option value="spacious" ${currentSettings.display.density === 'spacious' ? 'selected' : ''}>Spacious</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="font-size">Font Size</label>
                                <select id="font-size" class="form-control">
                                    <option value="small" ${currentSettings.display.fontSize === 'small' ? 'selected' : ''}>Small</option>
                                    <option value="medium" ${currentSettings.display.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                                    <option value="large" ${currentSettings.display.fontSize === 'large' ? 'selected' : ''}>Large</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Data Settings -->
                    <div class="tab-pane" id="data-settings">
                        <div class="settings-section">
                            <h2>Data Management</h2>
                            <p>Configure how data is displayed and managed</p>
                            
                            <div class="form-group">
                                <label for="items-per-page">Items per page</label>
                                <select id="items-per-page" class="form-control">
                                    <option value="10" ${currentSettings.data.itemsPerPage === 10 ? 'selected' : ''}>10 items</option>
                                    <option value="25" ${currentSettings.data.itemsPerPage === 25 ? 'selected' : ''}>25 items</option>
                                    <option value="50" ${currentSettings.data.itemsPerPage === 50 ? 'selected' : ''}>50 items</option>
                                    <option value="100" ${currentSettings.data.itemsPerPage === 100 ? 'selected' : ''}>100 items</option>
                                </select>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-item-content">
                                    <h4>Auto-refresh data</h4>
                                    <p>Automatically refresh data at regular intervals</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="auto-refresh" ${currentSettings.data.autoRefresh ? 'checked' : ''}>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="form-group" id="refresh-interval-group" ${!currentSettings.data.autoRefresh ? 'style="display: none;"' : ''}>
                                <label for="refresh-interval">Refresh interval (minutes)</label>
                                <input type="number" id="refresh-interval" class="form-control" 
                                       min="1" max="60" value="${currentSettings.data.refreshInterval}">
                            </div>
                            
                            <div class="settings-actions">
                                <button class="btn secondary" id="clear-cache">
                                    <span class="material-icons">cached</span>
                                    Clear Cache
                                </button>
                                <button class="btn secondary" id="export-data">
                                    <span class="material-icons">file_download</span>
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Integration Settings -->
                    <div class="tab-pane" id="integration-settings">
                        <div class="settings-section">
                            <h2>Integrations</h2>
                            <p>Connect with other services to enhance your experience</p>
                            
                            <div class="integration-list">
                                <div class="integration-item">
                                    <div class="integration-logo">
                                        <img src="https://www.gstatic.com/calendar/images/ext/gc_button1_en.svg" alt="Google Calendar">
                                    </div>
                                    <div class="integration-details">
                                        <h4>Google Calendar</h4>
                                        <p>Sync your leads and appointments with Google Calendar</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="google-calendar" ${currentSettings.integrations.googleCalendar ? 'checked' : ''}>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="integration-item">
                                    <div class="integration-logo">
                                        <img src="https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/outlook_48x1.svg" alt="Outlook">
                                    </div>
                                    <div class="integration-details">
                                        <h4>Microsoft Outlook</h4>
                                        <p>Connect with your Outlook calendar and contacts</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="outlook" ${currentSettings.integrations.outlook ? 'checked' : ''}>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="integration-item">
                                    <div class="integration-logo">
                                        <img src="https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png" alt="Slack">
                                    </div>
                                    <div class="integration-details">
                                        <h4>Slack</h4>
                                        <p>Get notifications and updates in your Slack workspace</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="slack" ${currentSettings.integrations.slack ? 'checked' : ''}>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Account Settings -->
                    <div class="tab-pane" id="account-settings">
                        <div class="settings-section">
                            <h2>Account Settings</h2>
                            <p>Manage your account information and security</p>
                            
                            <div class="account-profile">
                                <div class="profile-avatar">
                                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff" alt="Profile">
                                    <button class="btn btn-sm secondary" id="change-avatar">
                                        <span class="material-icons">edit</span>
                                        Change
                                    </button>
                                </div>
                                <div class="profile-details">
                                    <h3>John Doe</h3>
                                    <p>Administrator</p>
                                    <p>john.doe@example.com</p>
                                </div>
                            </div>
                            
                            <form id="profile-form" class="form">
                                <div class="form-group">
                                    <label for="full-name">Full Name</label>
                                    <input type="text" id="full-name" class="form-control" value="John Doe">
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Email Address</label>
                                    <input type="email" id="email" class="form-control" value="john.doe@example.com">
                                </div>
                                
                                <div class="form-group">
                                    <label for="phone">Phone Number</label>
                                    <input type="tel" id="phone" class="form-control" value="+1 (555) 123-4567">
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="btn primary">
                                        <span class="material-icons">save</span>
                                        Save Changes
                                    </button>
                                    <button type="button" class="btn secondary" id="change-password">
                                        <span class="material-icons">lock</span>
                                        Change Password
                                    </button>
                                </div>
                            </form>
                            
                            <div class="settings-section danger-zone">
                                <h3>Danger Zone</h3>
                                <p>These actions are irreversible. Please be careful.</p>
                                
                                <div class="danger-actions">
                                    <button class="btn danger" id="delete-account">
                                        <span class="material-icons">delete_forever</span>
                                        Delete Account
                                    </button>
                                    <button class="btn secondary" id="export-all-data">
                                        <span class="material-icons">file_download</span>
                                        Export All Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize event listeners after the DOM is updated
        setTimeout(() => {
            setupEventListeners();
            setupTabNavigation();
        }, 100);
    }
    
    // Setup tab navigation
    function setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding tab pane
                tabPanes.forEach(pane => pane.classList.remove('active'));
                document.getElementById(`${tabId}-settings`).classList.add('active');
            });
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Save settings button
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveSettings);
        }
        
        // Auto-refresh toggle
        const autoRefresh = document.getElementById('auto-refresh');
        const refreshIntervalGroup = document.getElementById('refresh-interval-group');
        
        if (autoRefresh && refreshIntervalGroup) {
            autoRefresh.addEventListener('change', (e) => {
                refreshIntervalGroup.style.display = e.target.checked ? 'block' : 'none';
            });
        }
        
        // Clear cache button
        const clearCacheBtn = document.getElementById('clear-cache');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the cache? This will remove all locally stored data.')) {
                    // In a real app, this would clear the cache
                    showNotification('Cache cleared successfully', 'success');
                }
            });
        }
        
        // Export data button
        const exportDataBtn = document.getElementById('export-data');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                alert('Export data functionality will be implemented here');
                // In a real app, this would export the data
            });
        }
        
        // Change password button
        const changePasswordBtn = document.getElementById('change-password');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                alert('Change password functionality will be implemented here');
                // In a real app, this would show a change password form
            });
        }
        
        // Delete account button
        const deleteAccountBtn = document.getElementById('delete-account');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // In a real app, this would delete the account
                    showNotification('Account deletion request received', 'warning');
                }
            });
        }
        
        // Profile form submission
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // In a real app, this would update the profile
                showNotification('Profile updated successfully', 'success');
            });
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // In a real app, this would show a nice notification
        console.log(`[${type.toUpperCase()}] ${message}`);
        alert(`${type.toUpperCase()}: ${message}`);
    }
    
    // Save settings
    function saveSettings() {
        // Update notification settings
        currentSettings.notifications = {
            email: document.getElementById('email-notifications')?.checked || false,
            push: document.getElementById('push-notifications')?.checked || false,
            sound: document.getElementById('sound-notifications')?.checked || false
        };
        
        // Update display settings
        const selectedTheme = document.querySelector('input[name="theme"]:checked');
        currentSettings.display = {
            theme: selectedTheme ? selectedTheme.value : 'light',
            density: document.getElementById('density')?.value || 'comfortable',
            fontSize: document.getElementById('font-size')?.value || 'medium'
        };
        
        // Update data settings
        currentSettings.data = {
            itemsPerPage: parseInt(document.getElementById('items-per-page')?.value) || 10,
            autoRefresh: document.getElementById('auto-refresh')?.checked || false,
            refreshInterval: parseInt(document.getElementById('refresh-interval')?.value) || 5
        };
        
        // Update integration settings
        currentSettings.integrations = {
            googleCalendar: document.getElementById('google-calendar')?.checked || false,
            outlook: document.getElementById('outlook')?.checked || false,
            slack: document.getElementById('slack')?.checked || false
        };
        
        // Save to localStorage
        localStorage.setItem('appSettings', JSON.stringify(currentSettings));
        
        // Show success message
        showNotification('Settings saved successfully', 'success');
        
        // Apply theme if changed
        if (selectedTheme) {
            document.documentElement.setAttribute('data-theme', selectedTheme.value);
        }
    }
    
    // Public API
    return {
        init,
        saveSettings
    };
})();

// Initialize settings when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Settings.init());
} else {
    Settings.init();
}
