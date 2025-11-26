// Reports Module
const Reports = (function() {
    // DOM Elements
    let reportsContainer;
    
    // Initialize the reports
    function init() {
        reportsContainer = document.getElementById('reports-screen');
        if (!reportsContainer) {
            console.error('Reports container not found');
            return;
        }
        
        // Add a small delay to ensure the container is in the DOM
        setTimeout(() => {
            renderReports();
        }, 100);
    }
    
    // Render the reports
    function renderReports() {
        if (!reportsContainer) return;
        
        const leads = window.leadsData || [];
        const leadsBySource = DashboardUtils.getLeadsBySource(leads);
        const leadsByStatus = DashboardUtils.getLeadsByStatus(leads);
        const leadsByModel = DashboardUtils.getLeadsByModel(leads);
        const leadsByBudget = DashboardUtils.getLeadsByBudget(leads);
        const leadsByDate = DashboardUtils.getLeadsByDate(leads, 30);
        
        reportsContainer.innerHTML = `
            <div class="reports-container">
                <div class="reports-header">
                    <h1>Analytics & Reports</h1>
                    <div class="report-actions">
                        <button class="btn primary" id="export-pdf">
                            <span class="material-icons">picture_as_pdf</span>
                            Export PDF
                        </button>
                        <button class="btn secondary" id="export-csv">
                            <span class="material-icons">table_chart</span>
                            Export CSV
                        </button>
                    </div>
                </div>
                
                <div class="reports-grid">
                    <!-- Leads Overview -->
                    <div class="report-card full-width">
                        <div class="card-header">
                            <h2>Leads Overview</h2>
                            <div class="date-filter">
                                <select id="time-period" class="form-select">
                                    <option value="7">Last 7 days</option>
                                    <option value="30" selected>Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                    <option value="365">Last 12 months</option>
                                </select>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="leads-trend-chart"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Source Distribution -->
                    <div class="report-card">
                        <div class="card-header">
                            <h3>Lead Sources</h3>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="source-chart"></canvas>
                            </div>
                            <div class="source-list">
                                ${Object.entries(leadsBySource).map(([source, count]) => `
                                    <div class="source-item">
                                        <span class="source-name">${source}</span>
                                        <span class="source-count">${count}</span>
                                        <div class="progress-bar">
                                            <div class="progress" style="width: ${(count / leads.length) * 100}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Status Distribution -->
                    <div class="report-card">
                        <div class="card-header">
                            <h3>Lead Status</h3>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="status-chart"></canvas>
                            </div>
                            <div class="status-legend">
                                ${Object.entries(leadsByStatus).map(([status, count]) => `
                                    <div class="legend-item">
                                        <span class="status-dot ${status}"></span>
                                        <span class="status-name">${status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                                        <span class="status-count">${count}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Model Popularity -->
                    <div class="report-card">
                        <div class="card-header">
                            <h3>Popular Models</h3>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="model-chart"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Budget Analysis -->
                    <div class="report-card">
                        <div class="card-header">
                            <h3>Budget Range</h3>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="budget-chart"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Conversion Funnel -->
                    <div class="report-card full-width">
                        <div class="card-header">
                            <h3>Conversion Funnel</h3>
                        </div>
                        <div class="card-body">
                            <div class="funnel-container">
                                <div class="funnel-stages">
                                    <div class="funnel-stage">
                                        <div class="stage-name">New Leads</div>
                                        <div class="stage-value">${leadsByStatus.new || 0}</div>
                                        <div class="stage-bar" style="width: 100%"></div>
                                    </div>
                                    <div class="funnel-arrow">
                                        <span class="material-icons">arrow_downward</span>
                                        <span class="conversion-rate">${leads.length > 0 ? Math.round(((leadsByStatus.contacted || 0) / (leadsByStatus.new || 1)) * 100) : 0}%</span>
                                    </div>
                                    <div class="funnel-stage">
                                        <div class="stage-name">Contacted</div>
                                        <div class="stage-value">${leadsByStatus.contacted || 0}</div>
                                        <div class="stage-bar" style="width: ${leads.length > 0 ? ((leadsByStatus.contacted || 0) / (leadsByStatus.new || 1)) * 100 : 0}%"></div>
                                    </div>
                                    <div class="funnel-arrow">
                                        <span class="material-icons">arrow_downward</span>
                                        <span class="conversion-rate">${leadsByStatus.contacted > 0 ? Math.round(((leadsByStatus.converted || 0) / leadsByStatus.contacted) * 100) : 0}%</span>
                                    </div>
                                    <div class="funnel-stage">
                                        <div class="stage-name">Converted</div>
                                        <div class="stage-value">${leadsByStatus.converted || 0}</div>
                                        <div class="stage-bar" style="width: ${leadsByStatus.contacted > 0 ? ((leadsByStatus.converted || 0) / leadsByStatus.contacted) * 100 : 0}%"></div>
                                    </div>
                                </div>
                                <div class="funnel-summary">
                                    <div class="summary-item">
                                        <div class="summary-label">Total Leads</div>
                                        <div class="summary-value">${leads.length}</div>
                                    </div>
                                    <div class="summary-item">
                                        <div class="summary-label">Conversion Rate</div>
                                        <div class="summary-value">${leads.length > 0 ? Math.round(((leadsByStatus.converted || 0) / leads.length) * 100) : 0}%</div>
                                    </div>
                                    <div class="summary-item">
                                        <div class="summary-label">Avg. Time to Convert</div>
                                        <div class="summary-value">${calculateAvgConversionTime(leads)} days</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize charts after the DOM is updated
        setTimeout(() => {
            renderCharts(leads, leadsBySource, leadsByStatus, leadsByModel, leadsByBudget, leadsByDate);
            setupEventListeners();
        }, 100);
    }
    
    // Calculate average conversion time in days
    function calculateAvgConversionTime(leads) {
        const convertedLeads = leads.filter(lead => 
            lead.status === 'converted' && lead.created && lead.lastContacted
        );
        
        if (convertedLeads.length === 0) return 0;
        
        const totalDays = convertedLeads.reduce((sum, lead) => {
            const created = new Date(lead.created);
            const converted = new Date(lead.lastContacted);
            const diffTime = Math.abs(converted - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return sum + diffDays;
        }, 0);
        
        return Math.round(totalDays / convertedLeads.length);
    }
    
    // Render all charts
    function renderCharts(leads, leadsBySource, leadsByStatus, leadsByModel, leadsByBudget, leadsByDate) {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js is not loaded. Please include Chart.js for visualizations.');
            return;
        }
        
        // Leads Trend Chart
        const trendCtx = document.getElementById('leads-trend-chart');
        if (trendCtx) {
            const dateLabels = Object.keys(leadsByDate);
            const leadCounts = Object.values(leadsByDate);
            
            new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: dateLabels,
                    datasets: [{
                        label: 'Leads',
                        data: leadCounts,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        // Source Chart
        const sourceCtx = document.getElementById('source-chart');
        if (sourceCtx) {
            new Chart(sourceCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(leadsBySource),
                    datasets: [{
                        data: Object.values(leadsBySource),
                        backgroundColor: [
                            '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
                            '#6366F1', '#14B8A6', '#F97316', '#8B5CF6', '#EC4899'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    cutout: '70%'
                }
            });
        }
        
        // Status Chart
        const statusCtx = document.getElementById('status-chart');
        if (statusCtx) {
            const statusLabels = Object.keys(leadsByStatus).map(key => 
                key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            );
            
            new Chart(statusCtx, {
                type: 'pie',
                data: {
                    labels: statusLabels,
                    datasets: [{
                        data: Object.values(leadsByStatus),
                        backgroundColor: [
                            '#3B82F6', // new
                            '#10B981', // contacted
                            '#F59E0B', // follow_up
                            '#8B5CF6', // converted
                            '#EF4444'  // not_interested
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        }
                    }
                }
            });
        }
        
        // Model Chart
        const modelCtx = document.getElementById('model-chart');
        if (modelCtx && Object.keys(leadsByModel).length > 0) {
            const sortedModels = Object.entries(leadsByModel)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5); // Top 5 models
                
            new Chart(modelCtx, {
                type: 'bar',
                data: {
                    labels: sortedModels.map(([model]) => model),
                    datasets: [{
                        label: 'Leads',
                        data: sortedModels.map(([_, count]) => count),
                        backgroundColor: '#3B82F6',
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        // Budget Chart
        const budgetCtx = document.getElementById('budget-chart');
        if (budgetCtx) {
            new Chart(budgetCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(leadsByBudget),
                    datasets: [{
                        label: 'Leads',
                        data: Object.values(leadsByBudget),
                        backgroundColor: [
                            '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Time period filter
        const timePeriodSelect = document.getElementById('time-period');
        if (timePeriodSelect) {
            timePeriodSelect.addEventListener('change', (e) => {
                const days = parseInt(e.target.value);
                // In a real app, this would filter the data and re-render the charts
                console.log('Filtering data for last', days, 'days');
            });
        }
        
        // Export buttons
        const exportPdfBtn = document.getElementById('export-pdf');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                alert('Export to PDF functionality will be implemented here');
                // In a real app, this would generate and download a PDF report
            });
        }
        
        const exportCsvBtn = document.getElementById('export-csv');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                alert('Export to CSV functionality will be implemented here');
                // In a real app, this would generate and download a CSV file
            });
        }
    }
    
    // Public API
    return {
        init,
        renderReports
    };
})();

// Initialize reports when DOM is loaded
const initReports = () => {
    if (typeof DashboardUtils === 'undefined') {
        console.error('DashboardUtils is not loaded');
        return;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM fully loaded, initializing reports...');
            Reports.init();
        });
    } else {
        console.log('DOM already loaded, initializing reports...');
        Reports.init();
    }
};

// Export the init function
window.Reports = Reports;

// Initialize reports when the script loads
initReports();
