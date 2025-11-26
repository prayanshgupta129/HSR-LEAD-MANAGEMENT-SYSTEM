// Main application module
const LeadManager = (function() {
    // DOM Elements
    let leadsTableBody, searchInput, selectAllCheckbox, rowsPerPageSelect, 
        addLeadBtn, addLeadForm, addLeadModal, closeModalBtns, exportBtn, 
        refreshBtn, leadsCount;

    // State
    let currentFilter = 'all';
    let currentSearchQuery = '';
    let currentPage = 1;
    let rowsPerPage = 10;
    let selectedLeads = new Set();

    // Status and Source Mappings
    const statusMap = {
        'new': { text: 'New', class: 'status-new' },
        'contacted': { text: 'Contacted', class: 'status-contacted' },
        'follow_up': { text: 'Follow-up', class: 'status-follow-up' },
        'converted': { text: 'Converted', class: 'status-converted' }
    };

    const sourceMap = {
        'Facebook': { icon: 'facebook', class: 'source-facebook' },
        'Website': { icon: 'language', class: 'source-website' },
        'Google': { icon: 'search', class: 'source-google' },
        'Referral': { icon: 'group', class: 'source-referral' },
        'Other': { icon: 'more_horiz', class: 'source-other' }
    };

    // Ensure leadsData exists
    let leadsData = window.leadsData || [];

    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Filter leads based on current filter and search query
    function getFilteredLeads() {
        let filtered = [...leadsData];
        
        // Apply status filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(lead => lead.status === currentFilter);
        }
        
        // Apply search query
        if (currentSearchQuery) {
            const query = currentSearchQuery.toLowerCase();
            filtered = filtered.filter(lead => 
                (lead.name && lead.name.toLowerCase().includes(query)) ||
                (lead.email && lead.email.toLowerCase().includes(query)) ||
                (lead.phone && lead.phone.includes(query)) ||
                (lead.notes && lead.notes.toLowerCase().includes(query))
            );
        }
        
        return filtered;
    }

    // Update status filter counts
    function updateStatusFilters() {
        const statusCounts = {};
        
        // Initialize all status counts to 0
        Object.keys(statusMap).forEach(status => {
            statusCounts[status] = 0;
        });
        
        // Count leads for each status
        leadsData.forEach(lead => {
            if (lead.status && statusCounts[lead.status] !== undefined) {
                statusCounts[lead.status]++;
            }
        });
        
        // Update the UI for each status filter
        Object.entries(statusCounts).forEach(([status, count]) => {
            const filterElement = document.querySelector(`[data-filter="${status}"] .count`);
            if (filterElement) {
                filterElement.textContent = count;
            }
        });
        
        // Update 'All' count
        const allCountElement = document.querySelector('[data-filter="all"] .count');
        if (allCountElement) {
            allCountElement.textContent = leadsData.length;
        }
    }

    // Initialize DOM elements
    function initializeElements() {
        try {
            leadsTableBody = document.getElementById('leads-body');
            searchInput = document.getElementById('search-input');
            selectAllCheckbox = document.getElementById('select-all');
            rowsPerPageSelect = document.getElementById('rows-per-page');
            addLeadBtn = document.getElementById('add-lead-btn');
            addLeadForm = document.getElementById('add-lead-form');
            addLeadModal = document.getElementById('add-lead-modal');
            closeModalBtns = document.querySelectorAll('.close-modal');
            exportBtn = document.getElementById('export-btn');
            refreshBtn = document.getElementById('refresh-btn');
            leadsCount = document.getElementById('leads-count');
        } catch (error) {
            console.error('Error initializing DOM elements:', error);
            throw error;
        }
    }

    // Show error message
    function showError(message) {
        console.error(message);
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.style.padding = '1rem';
        errorContainer.style.backgroundColor = '#FEE2E2';
        errorContainer.style.color = '#991B1B';
        errorContainer.style.borderRadius = '0.5rem';
        errorContainer.style.margin = '1rem 0';
        errorContainer.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <span class="material-icons" style="color: #DC2626;">error</span>
                <div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600;">Error</h3>
                    <p style="margin: 0;">${message}</p>
                </div>
            </div>
        `;
        
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.insertBefore(errorContainer, mainContent.firstChild);
        
        setTimeout(() => {
            errorContainer.style.opacity = '0';
            errorContainer.style.transition = 'opacity 0.5s ease';
            setTimeout(() => errorContainer.remove(), 500);
        }, 10000);
    }

    // Set up event listeners
    function setupEventListeners() {
        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearchQuery = e.target.value.trim().toLowerCase();
                currentPage = 1;
                renderLeadsTable();
            });
        }

        // Rows per page
        if (rowsPerPageSelect) {
            rowsPerPageSelect.addEventListener('change', (e) => {
                rowsPerPage = parseInt(e.target.value);
                currentPage = 1;
                renderLeadsTable();
            });
        }

        // Add lead button
        if (addLeadBtn) {
            addLeadBtn.addEventListener('click', () => {
                addLeadModal.style.display = 'flex';
            });
        }

        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                addLeadModal.style.display = 'none';
                if (addLeadForm) addLeadForm.reset();
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === addLeadModal) {
                addLeadModal.style.display = 'none';
                if (addLeadForm) addLeadForm.reset();
            }
        });

        // Add lead form submission
        if (addLeadForm) {
            addLeadForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const newLead = {
                    id: Date.now().toString(),
                    name: document.getElementById('lead-name').value.trim(),
                    email: document.getElementById('lead-email').value.trim(),
                    phone: document.getElementById('lead-phone').value.trim(),
                    source: document.getElementById('lead-source').value,
                    status: document.getElementById('lead-status').value,
                    created: new Date().toISOString(),
                    lastContacted: new Date().toISOString(),
                    nextFollowUp: null,
                    notes: '',
                    budget: '',
                    preferredModel: ''
                };

                if (newLead.name && newLead.phone) {
                    leadsData.unshift(newLead);
                    addLeadModal.style.display = 'none';
                    addLeadForm.reset();
                    renderLeadsTable();
                    updateStatusFilters();
                    showNotification('Lead added successfully!', 'success');
                } else {
                    showNotification('Please fill in all required fields', 'error');
                }
            });
        }

        // Export button
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                try {
                    const headers = ['Name', 'Email', 'Phone', 'Status', 'Source', 'Created Date', 'Last Contacted'];
                    let csvContent = headers.join(',') + '\n';
                    
                    leadsData.forEach(lead => {
                        const row = [
                            `"${lead.name || ''}"`,
                            `"${lead.email || ''}"`,
                            `"${lead.phone || ''}"`,
                            `"${lead.status || ''}"`,
                            `"${lead.source || ''}"`,
                            `"${formatDate(lead.created) || ''}"`,
                            `"${formatDate(lead.lastContacted) || ''}"`
                        ];
                        csvContent += row.join(',') + '\n';
                    });
                    
                    // Create download link
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (error) {
                    console.error('Error exporting leads:', error);
                    showError('Failed to export leads. Please try again.');
                }
            });
        }

        // Refresh button
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                currentSearchQuery = '';
                currentPage = 1;
                if (searchInput) searchInput.value = '';
                renderLeadsTable();
            });
        }
    }

    // Render leads table
    function renderLeadsTable() {
        if (!leadsTableBody) return;

        const filteredLeads = getFilteredLeads();
        const startIndex = (currentPage - 1) * rowsPerPage;
        const paginatedLeads = filteredLeads.slice(startIndex, startIndex + rowsPerPage);

        // Clear existing rows
        leadsTableBody.innerHTML = '';

        if (paginatedLeads.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="text-center py-4">
                    No leads found. Try adjusting your filters or add a new lead.
                </td>
            `;
            leadsTableBody.appendChild(emptyRow);
        } else {
            paginatedLeads.forEach(lead => {
                const status = statusMap[lead.status] || { text: lead.status, class: '' };
                const source = sourceMap[lead.source] || { icon: 'help_outline', class: '' };
                
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 border-b border-gray-200';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <input type="checkbox" class="lead-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" value="${lead.id}">
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <span class="material-icons ${source.class} text-2xl">${source.icon}</span>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${lead.name || 'N/A'}</div>
                                <div class="text-sm text-gray-500">${lead.email || 'No email'}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${lead.phone || 'N/A'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}">
                            ${status.text}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${lead.source || 'N/A'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${formatDate(lead.created)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${formatDate(lead.lastContacted)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center space-x-2">
                            <button onclick="LeadManager.handleCall('${lead.phone}')" class="text-blue-600 hover:text-blue-900" title="Call">
                                <span class="material-icons text-lg">phone</span>
                            </button>
                            <button onclick="LeadManager.handleEmail('${lead.email}')" class="text-blue-600 hover:text-blue-900" title="Email">
                                <span class="material-icons text-lg">email</span>
                            </button>
                            <button onclick="LeadManager.showLeadActions('${lead.id}')" class="text-gray-600 hover:text-gray-900" title="More actions">
                                <span class="material-icons text-lg">more_vert</span>
                            </button>
                            <button onclick="LeadManager.showLeadDetails('${lead.id}')" class="text-gray-600 hover:text-gray-900" title="View">
                                <span class="material-icons text-lg">visibility</span>
                            </button>
                        </div>
                    </td>
                `;
                leadsTableBody.appendChild(row);
            });
        }

        // Update pagination
        updatePagination(filteredLeads.length);
    }

    // Update pagination
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (!pagination) return;

        let paginationHTML = `
            <div class="flex-1 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        Showing <span class="font-medium">${Math.min((currentPage - 1) * rowsPerPage + 1, totalItems)}</span>
                        to <span class="font-medium">${Math.min(currentPage * rowsPerPage, totalItems)}</span>
                        of <span class="font-medium">${totalItems}</span> results
                    </p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="LeadManager.changePage(${currentPage - 1})" 
                            ${currentPage === 1 ? 'disabled' : ''} 
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}">
                        Previous
                    </button>
                    <button onclick="LeadManager.changePage(${currentPage + 1})" 
                            ${currentPage >= totalPages ? 'disabled' : ''} 
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}">
                        Next
                    </button>
                </div>
            </div>
        `;

        pagination.innerHTML = paginationHTML;
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center';
        notification.style.animation = 'fadeIn 0.3s ease-out';
        
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#D1FAE5';
                notification.style.color = '#065F46';
                notification.innerHTML = `<span class="material-icons">check_circle</span> ${message}`;
                break;
            case 'error':
                notification.style.backgroundColor = '#FEE2E2';
                notification.style.color = '#B91C1C';
                notification.innerHTML = `<span class="material-icons">error</span> ${message}`;
                break;
            case 'warning':
                notification.style.backgroundColor = '#FEF3C7';
                notification.style.color = '#92400E';
                notification.innerHTML = `<span class="material-icons">warning</span> ${message}`;
                break;
            default: // info
                notification.style.backgroundColor = '#DBEAFE';
                notification.style.color = '#1E40AF';
                notification.innerHTML = `<span class="material-icons">info</span> ${message}`;
        }
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.marginLeft = '12px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.lineHeight = '1';
        closeBtn.onclick = () => notification.remove();
        
        notification.appendChild(closeBtn);
        document.body.appendChild(notification);
        
        // Add keyframes for animations if not already added
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Change page
    function changePage(page) {
        const totalPages = Math.ceil(getFilteredLeads().length / rowsPerPage);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderLeadsTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle call
    function handleCall(phone) {
        if (phone) {
            window.open(`tel:${phone}`, '_blank');
        }
    }

    // Handle email
    function handleEmail(email) {
        if (email) {
            window.open(`mailto:${email}`, '_blank');
        }
    }

    // Show lead actions
    function showLeadActions(leadId) {
        console.log('Show actions for lead:', leadId);
        // Implement lead actions menu
    }

function showLeadDetails(leadId) {
    if (typeof LeadDetails !== 'undefined' && typeof LeadDetails.open === 'function') {
        // Convert leadId to number for comparison if it's a string
        const id = typeof leadId === 'string' ? parseInt(leadId, 10) : leadId;
        const lead = leadsData.find(l => l.id == id); // Use loose equality for type coercion
        
        if (lead) {
            LeadDetails.open(lead);
        } else {
            console.error('Lead not found. ID:', leadId, 'Type:', typeof leadId);
            console.log('Available lead IDs:', leadsData.map(l => ({id: l.id, type: typeof l.id})));
            showError('Could not load lead details. Lead not found.');
        }
    } else {
        console.error('LeadDetails module not available');
        showError('Could not load lead details. Please try again later.');
    }
}

    // Navigation functionality
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        // Add click event to each navigation item
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get the screen to show
                const screenId = this.getAttribute('data-screen');
                
                // Hide all screens
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                
                // Show the selected screen
                const targetScreen = document.getElementById(`${screenId}-screen`);
                if (targetScreen) {
                    targetScreen.classList.add('active');
                }
            });
        });
        
        // Initialize the first screen (dashboard) as active if no screen is active
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) {
            const defaultScreen = document.querySelector('.nav-item[data-screen="dashboard"]');
            if (defaultScreen) {
                defaultScreen.click();
            }
        }
    }

    // Public API
    return {
        init: function() {
            try {
                // Initialize DOM elements
                initializeElements();
                
                // Set up event listeners
                setupEventListeners();
                
                // Initialize navigation
                initNavigation();
                
                // Initial render
                updateStatusFilters();
                renderLeadsTable();
                
                console.log('Lead Manager initialized successfully');
            } catch (error) {
                console.error('Error initializing Lead Manager:', error);
                showError('Failed to initialize application. Please refresh the page.');
            }
        },
        renderLeadsTable,
        updateStatusFilters,
        setupEventListeners,
        showError,
        showNotification,
        changePage,
        handleCall,
        handleEmail,
        showLeadActions,
        showLeadDetails
    };
})();

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LeadManager.init());
} else {
    LeadManager.init();
}

// Make necessary functions globally available
window.LeadManager = LeadManager;
window.handleCall = LeadManager.handleCall;
window.handleEmail = LeadManager.handleEmail;
window.showLeadActions = LeadManager.showLeadActions;
window.showLeadDetails = LeadManager.showLeadDetails;
window.changePage = LeadManager.changePage;
window.renderLeadsTable = LeadManager.renderLeadsTable;