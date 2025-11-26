// Lead Details Module
const LeadDetails = (function() {
    // Status and source mappings to match the app's design
    const statusMap = {
        'new': { text: 'New', class: 'new' },
        'contacted': { text: 'Contacted', class: 'contacted' },
        'follow_up': { text: 'Follow-up', class: 'follow_up' },
        'converted': { text: 'Converted', class: 'converted' },
        'not_interested': { text: 'Not Interested', class: 'not_interested' }
    };
    
    const sourceMap = {
        'Facebook': { icon: 'facebook', class: 'source-facebook' },
        'Website': { icon: 'language', class: 'source-website' },
        'Google Ads': { icon: 'ads_click', class: 'source-google' },
        'Instagram': { icon: 'photo_camera', class: 'source-instagram' },
        'Referral': { icon: 'group', class: 'source-referral' },
        'Other': { icon: 'more_horiz', class: 'source-other' }
    };
    // DOM Elements
    let leadDetailsModal, closeModalBtns, detailName, detailEmail, detailPhone, detailStatus, detailSource,
        detailLastContact, detailNextFollowup, detailInitials, callBtn, whatsappBtn, emailBtn,
        addNoteBtn, cancelNoteBtn, saveNoteBtn, notesTimeline, addNoteForm, newNoteTextarea;

    // Current lead data
    let currentLead = null;

    // Initialize the module
    function init() {
        initializeElements();
        setupEventListeners();
    }

    // Initialize DOM elements
    function initializeElements() {
        leadDetailsModal = document.getElementById('lead-details-modal');
        closeModalBtns = leadDetailsModal ? leadDetailsModal.querySelectorAll('.close-modal') : [];
        
        // Lead info elements
        detailName = document.getElementById('detail-name');
        detailEmail = document.getElementById('detail-email');
        detailPhone = document.getElementById('detail-phone');
        detailStatus = document.getElementById('detail-status');
        detailSource = document.getElementById('detail-source');
        detailLastContact = document.getElementById('detail-last-contact');
        detailNextFollowup = document.getElementById('detail-next-followup');
        detailInitials = document.getElementById('detail-initials');
        
        // Action buttons
        callBtn = document.getElementById('call-btn');
        whatsappBtn = document.getElementById('whatsapp-btn');
        emailBtn = document.getElementById('email-btn');
        
        // Notes elements
        addNoteBtn = document.getElementById('add-note-btn');
        cancelNoteBtn = document.getElementById('cancel-note');
        saveNoteBtn = document.getElementById('save-note');
        notesTimeline = document.getElementById('notes-timeline');
        addNoteForm = document.getElementById('add-note-form');
        newNoteTextarea = document.getElementById('new-note');
    }

    // Set up event listeners
    function setupEventListeners() {
        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        // Close modal when clicking outside content
        if (leadDetailsModal) {
            leadDetailsModal.addEventListener('click', (e) => {
                if (e.target === leadDetailsModal) {
                    closeModal();
                }
            });
        }

        // Action buttons
        if (callBtn) {
            callBtn.addEventListener('click', handleCall);
        }
        
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', handleWhatsApp);
        }
        
        if (emailBtn) {
            emailBtn.addEventListener('click', handleEmail);
        }

        // Notes functionality
        if (addNoteBtn) {
            addNoteBtn.addEventListener('click', () => {
                addNoteForm.style.display = 'block';
                newNoteTextarea.focus();
            });
        }
        
        if (cancelNoteBtn) {
            cancelNoteBtn.addEventListener('click', () => {
                addNoteForm.style.display = 'none';
                newNoteTextarea.value = '';
            });
        }
        
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', saveNote);
        }
    }

    // Open the lead details modal
    function openModal(lead) {
        if (!lead) return;
        
        currentLead = lead;
        
        // Update lead info
        if (detailName) detailName.textContent = lead.name || 'No Name';
        if (detailEmail) detailEmail.textContent = lead.email || 'No email';
        if (detailPhone) {
            detailPhone.textContent = lead.phone || 'No phone';
            detailPhone.href = lead.phone ? `tel:${lead.phone.replace(/\D/g, '')}` : '#';
        }
        
        // Update status with proper class and text
        if (detailStatus) {
            const statusInfo = statusMap[lead.status] || { text: lead.status || 'Unknown', class: 'unknown' };
            detailStatus.textContent = statusInfo.text;
            // Remove all status classes first
            detailStatus.className = 'status-badge';
            // Add the appropriate status class
            detailStatus.classList.add(statusInfo.class);
        }
        
        // Update source with icon if available
        if (detailSource) {
            const sourceInfo = sourceMap[lead.source] || { icon: 'source', class: 'source-other' };
            detailSource.innerHTML = `
                <span class="material-icons" style="vertical-align: middle; font-size: 16px; margin-right: 4px;">
                    ${sourceInfo.icon}
                </span>
                ${lead.source || 'Unknown'}
            `;
        }
        
        // Format dates
        if (detailLastContact) {
            detailLastContact.textContent = lead.lastContacted 
                ? formatDate(lead.lastContacted) 
                : 'Not contacted yet';
        }
        
        if (detailNextFollowup) {
            detailNextFollowup.textContent = lead.nextFollowUp 
                ? formatDate(lead.nextFollowUp) 
                : 'Not scheduled';
        }
        
        // Set initials for avatar with a random background color
        if (detailInitials) {
            detailInitials.textContent = getInitials(lead.name || '?');
            // Generate a consistent color based on the name
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
            const colorIndex = Math.abs(hashCode(lead.name || '?')) % colors.length;
            detailInitials.style.backgroundColor = colors[colorIndex];
        }
        
        // Load notes
        loadNotes(lead.id);
        
        // Show the modal
        if (leadDetailsModal) {
            leadDetailsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    // Close the modal
    function closeModal() {
        if (leadDetailsModal) {
            leadDetailsModal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
        // Reset the form when closing
        if (addNoteForm) {
            addNoteForm.style.display = 'none';
            newNoteTextarea.value = '';
        }
    }

    // Handle call button click
    function handleCall() {
        if (!currentLead || !currentLead.phone) return;
        window.open(`tel:${currentLead.phone}`, '_self');
    }

    // Handle WhatsApp button click
    function handleWhatsApp() {
        if (!currentLead || !currentLead.phone) return;
        const message = `Hi ${currentLead.name ? currentLead.name.split(' ')[0] : 'there'}, `;
        const url = `https://wa.me/${currentLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Handle email button click
    function handleEmail() {
        if (!currentLead || !currentLead.email) return;
        window.open(`mailto:${currentLead.email}`, '_self');
    }

    // Load notes for a lead
    function loadNotes(leadId) {
        if (!notesTimeline) return;
        
        // Use the lead's notes if available, or create some sample notes
        const notes = [];
        
        // Add the main note if it exists
        if (currentLead.notes) {
            notes.push({
                id: 'note-1',
                author: 'System',
                timestamp: currentLead.created || new Date().toISOString(),
                content: currentLead.notes
            });
        }
        
        // Add some sample interaction history
        if (currentLead.lastContacted) {
            notes.push({
                id: 'interaction-1',
                author: 'You',
                timestamp: currentLead.lastContacted,
                content: `Contacted ${currentLead.name.split(' ')[0]} about ${currentLead.preferredModel || 'their inquiry'}.`
            });
        }
        
        // Add a default note if no notes exist
        if (notes.length === 0) {
            notes.push({
                id: 'default-note',
                author: 'System',
                timestamp: currentLead.created || new Date().toISOString(),
                content: `Lead created from ${currentLead.source || 'an unknown source'}.`
            });
        }
        
        // Clear existing notes
        notesTimeline.innerHTML = '';
        
        // Add notes to the timeline (newest first)
        notes
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach(note => {
                const noteElement = createNoteElement(note);
                notesTimeline.appendChild(noteElement);
            });
    }

    // Create a note element
    function createNoteElement(note) {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        
        const timeAgo = getTimeAgo(note.timestamp);
        
        noteItem.innerHTML = `
            <div class="note-header">
                <span class="note-author">${note.author}</span>
                <span class="note-time">${timeAgo}</span>
            </div>
            <div class="note-content">
                ${note.content}
            </div>
        `;
        
        return noteItem;
    }

    // Save a new note
    function saveNote() {
        if (!newNoteTextarea || !newNoteTextarea.value.trim() || !currentLead) return;
        
        // In a real app, you would save this to your data store
        const newNote = {
            id: Date.now().toString(),
            author: 'You',
            timestamp: new Date().toISOString(),
            content: newNoteTextarea.value.trim()
        };
        
        // Add the note to the timeline
        const noteElement = createNoteElement(newNote);
        if (notesTimeline.firstChild) {
            notesTimeline.insertBefore(noteElement, notesTimeline.firstChild);
        } else {
            notesTimeline.appendChild(noteElement);
        }
        
        // Update the lead's notes array
        if (!currentLead.notes) {
            currentLead.notes = [];
        }
        currentLead.notes.unshift(newNote);
        
        // Reset the form
        newNoteTextarea.value = '';
        addNoteForm.style.display = 'none';
        
        // Show a success message
        showNotification('Note added successfully', 'success');
    }

    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Helper function to get time ago string
    function getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return `${interval} years ago`;
        if (interval === 1) return '1 year ago';
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} months ago`;
        if (interval === 1) return '1 month ago';
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} days ago`;
        if (interval === 1) return 'yesterday';
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} hours ago`;
        if (interval === 1) return '1 hour ago';
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} minutes ago`;
        if (interval === 1) return '1 minute ago';
        
        return 'just now';
    }

    // Helper function to get initials from name
    function getInitials(name) {
        if (!name) return '?';
        return name.split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    // Helper function to generate a consistent hash code for a string
    function hashCode(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // Show notification (you can replace this with your app's notification system)
    function showNotification(message, type = 'info') {
        console.log(`[${type}] ${message}`);
        // In a real app, you would show a nice notification to the user
    }

    // Public API
    return {
        init,
        open: openModal,
        close: closeModal
    };
})();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', LeadDetails.init);
} else {
    // DOMContentLoaded has already fired
    setTimeout(LeadDetails.init, 0);
}
