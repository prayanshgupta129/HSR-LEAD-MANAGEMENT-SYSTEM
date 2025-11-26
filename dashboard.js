/**
 * Dashboard Module
 * Manages the dashboard interface including charts and statistics
 */
const Dashboard = (function() {
    // Configuration
    const CONFIG = {
        chart: {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { size: 12 }
                        }
                    }
                },
                cutout: '70%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        },
        colors: {
            primary: '#4CAF50',
            secondary: '#2196F3',
            warning: '#FFC107',
            danger: '#F44336',
            info: '#00BCD4',
            success: '#4CAF50'
        }
    };

    // State
    const state = {
        charts: {},
        container: null,
        isInitialized: false,
        leadsData: []
    };

    // DOM Elements
    const elements = {
        container: null,
        refreshBtn: null,
        statusChart: null,
        sourceChart: null
    };

    /**
     * Initialize the dashboard
     */
    function init() {
        if (state.isInitialized) {
            console.warn('Dashboard is already initialized');
            return;
        }

        try {
            setupDOMReferences();
            setupEventListeners();
            loadDashboardData();
            state.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
        }
    }
    
    /**
     * Set up DOM element references
     */
    function setupDOMReferences() {
        elements.container = document.getElementById('dashboard-screen');
        if (!elements.container) {
            throw new Error('Dashboard container not found');
        }
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Will be set up after initial render
        document.addEventListener('DOMContentLoaded', () => {
            elements.refreshBtn = document.getElementById('refresh-dashboard');
            if (elements.refreshBtn) {
                elements.refreshBtn.addEventListener('click', handleRefresh);
            }
        });

        // Window resize with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 250);
        });
    }

    /**
     * Load dashboard data and render
     */
    function loadDashboardData() {
        try {
            state.leadsData = window.leadsData || [];
            renderDashboard();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showError('Failed to load dashboard data');
        }
    }
    
    /**
     * Render the dashboard with current data
     */
    function renderDashboard() {
        if (!elements.container) return;
        
        const leads = state.leadsData || [];
        const stats = DashboardUtils.getLeadStats(leads);
        const recentLeads = DashboardUtils.getRecentLeads(leads, 5);
        const leadsBySource = DashboardUtils.getLeadsBySource(leads);
        const leadsByStatus = DashboardUtils.getLeadsByStatus(leads);
        const leadsNeedingFollowUp = DashboardUtils.getLeadsNeedingFollowUp(leads);
        
        // Destroy existing charts before re-rendering
        destroyCharts();
        
        elements.container.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h1>Dashboard Overview</h1>
                    <div class="dashboard-actions">
                        <button class="btn primary" id="refresh-dashboard">
                            <span class="material-icons">refresh</span>
                            Refresh
                        </button>
                    </div>
                </div>
                
                <!-- Charts Container -->
                <div class="charts-container">
                    <div class="chart-card">
                        <h3>Leads by Status</h3>
                        <div class="chart-wrapper">
                            <canvas id="statusChart" height="250"></canvas>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Leads by Source</h3>
                        <div class="chart-wrapper">
                            <canvas id="sourceChart" height="250"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-value">${stats.totalLeads}</div>
                        <div class="stat-label">Total Leads</div>
                        <div class="stat-icon">
                            <span class="material-icons">groups</span>
                        </div>
                    </div>
                    
                    <div class="stat-card success">
                        <div class="stat-value">${stats.newLeads}</div>
                        <div class="stat-label">New Leads</div>
                        <div class="stat-icon">
                            <span class="material-icons">person_add</span>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-value">${stats.contactedLeads}</div>
                        <div class="stat-label">Contacted</div>
                        <div class="stat-icon">
                            <span class="material-icons">call</span>
                        </div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-value">${stats.convertedLeads}</div>
                        <div class="stat-label">Converted</div>
                        <div class="stat-icon">
                            <span class="material-icons">check_circle</span>
                        </div>
                    </div>
                    
                    <div class="stat-card danger">
                        <div class="stat-value">${stats.conversionRate}%</div>
                        <div class="stat-label">Conversion Rate</div>
                        <div class="stat-icon">
                            <span class="material-icons">trending_up</span>
                        </div>
                    </div>
                    
                    <div class="stat-card secondary">
                        <div class="stat-value">${leadsNeedingFollowUp.length}</div>
                        <div class="stat-label">Follow-ups Needed</div>
                        <div class="stat-icon">
                            <span class="material-icons">notifications_active</span>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Leads Card -->
                <div class="recent-leads-card">
                    <div class="card-header">
                        <h3>Recent Leads</h3>
                        <a href="#" class="view-all">View All</a>
                    </div>
                    <div class="table-container">
                        <table class="leads-table">
                            <thead>
                                <tr>
                                    <th class="name-col">Name</th>
                                    <th class="email-col">Email</th>
                                    <th class="phone-col">Phone</th>
                                    <th class="status-col">Status</th>
                                    <th class="source-col">Source</th>
                                    <th class="date-col">Date Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentLeads.map(lead => `
                                    <tr>
                                        <td class="name-col">
                                            <div class="lead-info">
                                                <div class="lead-name">${lead.name || 'N/A'}</div>
                                                <div class="lead-company">${lead.company || ''}</div>
                                            </div>
                                        </td>
                                        <td class="email-col">
                                            <a href="mailto:${lead.email || '#'}" class="email-link">
                                                ${lead.email || 'N/A'}
                                            </a>
                                        </td>
                                        <td class="phone-col">
                                            ${lead.phone ? `<a href="tel:${lead.phone}" class="phone-link">${lead.phone}</a>` : 'N/A'}
                                        </td>
                                        <td class="status-col">
                                            <span class="status-badge ${lead.status ? lead.status.toLowerCase() : ''}">
                                                ${lead.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td class="source-col">
                                            <span class="source-badge source-${lead.source ? lead.source.toLowerCase().replace(/\s+/g, '-') : 'unknown'}">
                                                ${lead.source || 'N/A'}
                                            </span>
                                        </td>
                                        <td class="date-col">
                                            <div class="date-wrapper">
                                                <span class="date">${formatDate(lead.dateAdded) || 'N/A'}</span>
                                                <span class="time">${formatTime(lead.dateAdded) || ''}</span>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize charts after the DOM is updated
        setTimeout(() => {
            renderStatusChart(leadsByStatus);
            renderSourceChart(leadsBySource);
            setupEventListeners();
        }, 100);
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Render status chart
    function renderStatusChart(statusData) {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return null;
        
        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusData),
                datasets: [{
                    data: Object.values(statusData),
                    backgroundColor: [
                        '#4CAF50', // Green
                        '#2196F3', // Blue
                        '#FFC107', // Amber
                        '#F44336'  // Red
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                cutout: '70%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
        
        charts.push(chart);
        return chart;
    }
    
    // Render source chart
    function renderSourceChart(sourceData) {
        const ctx = document.getElementById('sourceChart');
        if (!ctx) return null;
        
        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(sourceData),
                datasets: [{
                    data: Object.values(sourceData),
                    backgroundColor: [
                        '#4CAF50', // Green
                        '#2196F3', // Blue
                        '#FFC107', // Amber
                        '#F44336', // Red
                        '#9C27B0', // Purple
                        '#00BCD4', // Cyan
                        '#FF9800', // Orange
                        '#795548'  // Brown
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                cutout: '70%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
        
        charts.push(chart);
        return chart;
    }
    
    // Destroy all chart instances
    function destroyCharts() {
        // Get all chart instances and destroy them
        Chart.helpers.each(Chart.instances, (instance) => {
            instance.destroy();
        });
        charts = [];
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                destroyCharts();
                renderDashboard();
            });
        }
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Re-render charts on window resize
                if (typeof Dashboard !== 'undefined' && typeof Dashboard.renderDashboard === 'function') {
                    Dashboard.renderDashboard();
                }
            }, 250);
        });
    }
    
    // Public API
    return {
        init,
        renderDashboard,
        destroyCharts
    };
})();

// Handle follow-up action
window.handleFollowUp = function(leadId) {
    console.log('Marking follow-up as done for lead:', leadId);
    
    // In a real app, this would update the lead in the database
    if (window.showNotification) {
        window.showNotification('Follow-up marked as completed', 'success');
    }
    
    // Re-render the dashboard if needed
    if (typeof Dashboard !== 'undefined' && typeof Dashboard.renderDashboard === 'function') {
        Dashboard.renderDashboard();
    }
};

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof Dashboard !== 'undefined') {
            Dashboard.init();
        }
    });
} else if (typeof Dashboard !== 'undefined') {
    // If DOM is already loaded, initialize with a small delay
    setTimeout(() => Dashboard.init(), 100);
}
