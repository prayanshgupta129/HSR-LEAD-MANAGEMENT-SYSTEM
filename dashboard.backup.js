// Dashboard Module
const Dashboard = (function() {
    // Store chart instances
    let charts = [];
    let dashboardContainer;
    
    // Initialize the dashboard
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeDashboard);
        } else {
            // Small delay to ensure all elements are in the DOM
            setTimeout(initializeDashboard, 100);
        }
    }
    
    function initializeDashboard() {
        dashboardContainer = document.getElementById('dashboard-screen');
        if (!dashboardContainer) {
            console.error('Dashboard container not found');
            return;
        }
        renderDashboard();
    }
    
    // Render the dashboard
    function renderDashboard() {
        if (!dashboardContainer) return;
        
        const leads = window.leadsData || [];
        const stats = DashboardUtils.getLeadStats(leads);
        const recentLeads = DashboardUtils.getRecentLeads(leads, 5);
        const leadsBySource = DashboardUtils.getLeadsBySource(leads);
        const leadsByStatus = DashboardUtils.getLeadsByStatus(leads);
        const leadsNeedingFollowUp = DashboardUtils.getLeadsNeedingFollowUp(leads);
        
        // Destroy existing charts before re-rendering
        destroyCharts();
        
        dashboardContainer.innerHTML = `
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
                
                <!-- Recent leads table -->
                <div class="recent-leads">
                    <h3>Recent Leads</h3>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Source</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody id="recent-leads-body">
                                ${recentLeads.map(lead => `
                                    <tr>
                                        <td>${lead.name || 'N/A'}</td>
                                        <td>${lead.email || 'N/A'}</td>
                                        <td>${lead.phone || 'N/A'}</td>
                                        <td><span class="status-badge ${lead.status || ''}">${lead.status || 'N/A'}</span></td>
                                        <td><span class="source-badge">${lead.source || 'N/A'}</span></td>
                                        <td>${formatDate(lead.dateAdded) || 'N/A'}</td>
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
                renderDashboard();
            }, 250);
        });
    }
    
    // Handle follow-up action
    window.handleFollowUp = function(leadId) {
        // In a real app, this would update the lead in the database
        console.log('Marking follow-up as done for lead:', leadId);
        
        // Show success message
        if (window.showNotification) {
            window.showNotification('Follow-up marked as completed', 'success');
        }
        
        // Re-render the dashboard
        renderDashboard();
    };
    
    // Public API
    return {
        init,
        renderDashboard,
        destroyCharts
    };
})();

// Initialize the dashboard when the module loads
if (typeof Dashboard !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Dashboard.init());
    } else {
        // Small delay to ensure all scripts are loaded
        setTimeout(() => Dashboard.init(), 100);
    }
}
