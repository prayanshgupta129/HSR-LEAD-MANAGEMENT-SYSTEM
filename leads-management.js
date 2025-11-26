// Leads Management Module
const LeadsManagement = (function() {
    // DOM Elements
    let viewToggleBtns;
    let viewContents;
    let kanbanInitialized = false;
    
    // Initialize the leads management view
    function init() {
        console.log('Initializing Leads Management...');
        
        // Get view toggle buttons and contents
        viewToggleBtns = document.querySelectorAll('.view-btn');
        viewContents = document.querySelectorAll('.view-content');
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize the default view (Kanban)
        showView('kanban');
        
        console.log('Leads Management initialized');
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // View toggle buttons
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', handleViewToggle);
        });
        
        // Add lead button
        const addLeadBtn = document.getElementById('add-lead-kanban-btn');
        if (addLeadBtn) {
            addLeadBtn.addEventListener('click', () => {
                // Show the add lead modal
                const modal = document.getElementById('add-lead-modal');
                if (modal) modal.style.display = 'flex';
            });
        }
    }
    
    // Handle view toggle
    function handleViewToggle(e) {
        const view = e.currentTarget.dataset.view;
        if (view) {
            showView(view);
        }
    }
    
    // Show the specified view
    function showView(view) {
        // Update active button
        viewToggleBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update active view
        viewContents.forEach(content => {
            const isActive = content.id === `${view}-view`;
            content.classList.toggle('active', isActive);
            
            if (isActive) {
                // Initialize the view if needed
                if (view === 'kanban' && !kanbanInitialized) {
                    initializeKanbanView();
                } else if (view === 'table') {
                    // Initialize table view if needed
                    if (typeof LeadManager !== 'undefined' && typeof LeadManager.renderLeadsTable === 'function') {
                        LeadManager.renderLeadsTable();
                    }
                }
            }
        });
    }
    
    // Initialize the Kanban view
    function initializeKanbanView() {
        if (kanbanInitialized) return;
        
        if (typeof KanbanManager !== 'undefined' && typeof KanbanManager.init === 'function') {
            KanbanManager.init();
            kanbanInitialized = true;
        } else {
            console.warn('KanbanManager is not available');
        }
    }
    
    // Public API
    return {
        init,
        showView,
        getActiveView: () => {
            const activeBtn = document.querySelector('.view-btn.active');
            return activeBtn ? activeBtn.dataset.view : 'kanban';
        }
    };
})();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', LeadsManagement.init);
} else {
    // DOMContentLoaded has already fired
    setTimeout(LeadsManagement.init, 0);
}
