// Kanban Board Module
const KanbanManager = (function() {
    // DOM Elements
    let kanbanBoard;
    let kanbanColumns;
    
    // Initialize the Kanban board
    function init() {
        console.log('Initializing Kanban board...');
        kanbanBoard = document.querySelector('.kanban-board');
        kanbanColumns = document.querySelectorAll('.kanban-column');
        
        if (!kanbanBoard) {
            console.error('Kanban board element not found');
            return;
        }
        
        // Set up drag and drop
        setupDragAndDrop();
        
        // Render the initial board
        renderKanbanBoard();
        
        // Add event listeners
        document.getElementById('kanban-settings-btn')?.addEventListener('click', openSettings);
        document.getElementById('add-lead-kanban-btn')?.addEventListener('click', () => {
            // Reuse the existing add lead modal
            document.getElementById('add-lead-modal').style.display = 'flex';
        });
        
        // Listen for lead updates
        document.addEventListener('leadUpdated', renderKanbanBoard);
        
        console.log('Kanban board initialized');
    }
    
    // Set up drag and drop functionality
    function setupDragAndDrop() {
        kanbanColumns.forEach(column => {
            // Make columns drop targets
            column.addEventListener('dragover', e => {
                e.preventDefault();
                column.classList.add('drag-over');
            });
            
            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over');
            });
            
            column.addEventListener('drop', e => {
                e.preventDefault();
                column.classList.remove('drag-over');
                
                const leadId = e.dataTransfer.getData('text/plain');
                const newStatus = column.dataset.status;
                const leadCard = document.querySelector(`[data-lead-id="${leadId}"]`);
                
                if (leadCard && leadCard.dataset.status !== newStatus) {
                    updateLeadStatus(leadId, newStatus);
                }
            });
        });
        
        // Make lead cards draggable
        document.addEventListener('dragstart', e => {
            if (e.target.closest('.kanban-card')) {
                const card = e.target.closest('.kanban-card');
                e.dataTransfer.setData('text/plain', card.dataset.leadId);
                setTimeout(() => card.classList.add('dragging'), 0);
            }
        });
        
        document.addEventListener('dragend', e => {
            const card = document.querySelector('.kanban-card.dragging');
            if (card) card.classList.remove('dragging');
        });
    }
    
    // Update lead status when dragged to a new column
    function updateLeadStatus(leadId, newStatus) {
        console.log(`Updating lead ${leadId} status to ${newStatus}`);
        const lead = window.leadsData.find(l => l.id == leadId);
        
        if (lead) {
            lead.status = newStatus;
            lead.lastContacted = new Date().toISOString();
            
            // Dispatch event to update other parts of the app
            const event = new CustomEvent('leadUpdated', { 
                detail: { leadId, newStatus } 
            });
            document.dispatchEvent(event);
            
            // Save changes
            saveLeads();
            
            // Re-render the board
            renderKanbanBoard();
        }
    }
    
    // Render the Kanban board
    function renderKanbanBoard() {
        console.log('Rendering Kanban board...');
        if (!kanbanBoard) return;
        
        // Make sure leadsData is available
        if (!window.leadsData) {
            console.error('leadsData is not available');
            return;
        }
        
        // Clear all columns
        document.querySelectorAll('.kanban-items').forEach(column => {
            column.innerHTML = '';
        });
        
        // Group leads by status
        const leadsByStatus = {
            new: window.leadsData.filter(lead => lead.status === 'new'),
            contacted: window.leadsData.filter(lead => lead.status === 'contacted'),
            follow_up: window.leadsData.filter(lead => lead.status === 'follow_up'),
            converted: window.leadsData.filter(lead => lead.status === 'converted')
        };
        
        // Populate columns
        Object.entries(leadsByStatus).forEach(([status, leads]) => {
            const column = document.getElementById(`${status.replace('_', '')}-leads`);
            if (!column) return;
            
            leads.forEach(lead => {
                const card = createLeadCard(lead);
                column.appendChild(card);
            });
            
            // Update count in column header
            const countElement = column.closest('.kanban-column').querySelector('.rounded-full');
            if (countElement) {
                countElement.textContent = leads.length;
            }
        });
        
        console.log('Kanban board rendered');
    }
    
    // Create a lead card element
    function createLeadCard(lead) {
        const card = document.createElement('div');
        card.className = 'kanban-card relative';
        card.dataset.leadId = lead.id;
        card.dataset.status = lead.status;
        card.draggable = true;
        
        const source = window.sourceMap?.[lead.source] || { 
            icon: 'help_outline', 
            class: 'text-gray-500' 
        };
        
        const lastContacted = lead.lastContacted 
            ? new Date(lead.lastContacted).toLocaleDateString() 
            : 'Never';
            
        const nextFollowUp = lead.nextFollowUp
            ? new Date(lead.nextFollowUp).toLocaleDateString()
            : 'Not set';
        
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div>
                    <div class="lead-name">${lead.name || 'Unnamed Lead'}</div>
                    <div class="text-sm text-gray-600 flex items-center mt-1">
                        <span class="material-icons text-sm mr-1">${source.icon}</span>
                        ${lead.source || 'No source'}
                    </div>
                </div>
                <div class="text-xs text-gray-500">#${lead.id}</div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
                <div class="flex items-center">
                    <span class="material-icons text-sm mr-1">schedule</span>
                    ${lastContacted}
                </div>
                <div class="flex items-center mt-1">
                    <span class="material-icons text-sm mr-1">notifications</span>
                    ${nextFollowUp}
                </div>
            </div>
            <div class="lead-actions">
                <button class="text-gray-400 hover:text-gray-600" 
                        onclick="event.stopPropagation(); KanbanManager.showLeadDetails('${lead.id}')">
                    <span class="material-icons text-sm">visibility</span>
                </button>
            </div>
        `;
        
        // Add click handler to open lead details
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a button inside the card
            if (e.target.closest('button')) return;
            
            if (typeof window.LeadDetails !== 'undefined' && 
                typeof window.LeadDetails.open === 'function') {
                window.LeadDetails.open(lead);
            } else {
                console.error('LeadDetails module not available');
            }
        });
        
        return card;
    }
    
    // Open settings modal
    function openSettings() {
        // You can implement a settings modal here
        alert('Kanban settings will be available in the next update!');
    }
    
    // Save leads to localStorage (you can replace this with your actual save method)
    function saveLeads() {
        try {
            localStorage.setItem('leadsData', JSON.stringify(window.leadsData));
            console.log('Leads saved to localStorage');
        } catch (error) {
            console.error('Error saving leads:', error);
        }
    }
    
    // Public API
    return {
        init,
        showLeadDetails: (leadId) => {
            console.log('Showing lead details for:', leadId);
            const lead = window.leadsData.find(l => l.id == leadId);
            if (lead && typeof window.LeadDetails !== 'undefined') {
                window.LeadDetails.open(lead);
            } else {
                console.error('Lead not found or LeadDetails not available');
            }
        },
        renderKanbanBoard
    };
})();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded, initializing Kanban...');
        KanbanManager.init();
    });
} else {
    console.log('DOM already loaded, initializing Kanban...');
    KanbanManager.init();
}

// Make KanbanManager available globally
window.KanbanManager = KanbanManager;
