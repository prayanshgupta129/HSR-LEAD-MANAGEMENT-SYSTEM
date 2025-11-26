// Sample leads data
window.leadsData = [
    {
        id: 1,
        name: 'Rahul Sharma',
        email: 'rahul.s@email.com',
        phone: '+91 98765 43210',
        source: 'Facebook',
        status: 'new',
        lastContacted: null,
        nextFollowUp: '2023-11-28',
        notes: 'Interested in SUVs',
        budget: '10-15L',
        preferredModel: 'XUV700',
        created: '2023-11-25T10:30:00Z'
    },
    {
        id: 2,
        name: 'Priya Patel',
        email: 'priya.p@email.com',
        phone: '+91 87654 32109',
        source: 'Website',
        status: 'contacted',
        lastContacted: '2023-11-25T14:20:00Z',
        nextFollowUp: '2023-11-29',
        notes: 'Test drive requested',
        budget: '15-20L',
        preferredModel: 'Scorpio',
        created: '2023-11-24T09:15:00Z'
    },
    {
        id: 3,
        name: 'Amit Kumar',
        email: 'amit.k@email.com',
        phone: '+91 76543 21098',
        source: 'Google Ads',
        status: 'not_interested',
        lastContacted: '2023-11-20T11:45:00Z',
        nextFollowUp: null,
        notes: 'Budget constraints',
        budget: '5-10L',
        preferredModel: 'Bolero',
        created: '2023-11-19T16:30:00Z'
    },
    {
        id: 4,
        name: 'Sneha Gupta',
        email: 'sneha.g@email.com',
        phone: '+91 65432 10987',
        source: 'Instagram',
        status: 'follow_up',
        lastContacted: '2023-11-24T15:10:00Z',
        nextFollowUp: '2023-11-26',
        notes: 'Deciding between 2 models',
        budget: '20L+',
        preferredModel: 'XUV400 EV',
        created: '2023-11-23T12:20:00Z'
    },
    {
        id: 5,
        name: 'Vikram Singh',
        email: 'vikram.s@email.com',
        phone: '+91 98765 43211',
        source: 'Walk-in',
        status: 'new',
        lastContacted: null,
        nextFollowUp: '2023-11-27',
        notes: 'Corporate fleet inquiry',
        budget: '20L+',
        preferredModel: 'Scorpio',
        created: '2023-11-25T17:30:00Z'
    },
    {
        id: 6,
        name: 'Anjali Mehta',
        email: 'anjali.m@email.com',
        phone: '+91 87654 32110',
        source: 'Facebook',
        status: 'contacted',
        lastContacted: '2023-11-25T16:45:00Z',
        nextFollowUp: '2023-11-28',
        notes: 'Family car needed',
        budget: '10-15L',
        preferredModel: 'XUV700',
        created: '2023-11-24T14:10:00Z'
    },
    {
        id: 7,
        name: 'Rajesh Iyer',
        email: 'rajesh.i@email.com',
        phone: '+91 76543 21099',
        source: 'Website',
        status: 'converted',
        lastContacted: '2023-11-15T12:20:00Z',
        nextFollowUp: null,
        notes: 'Purchased XUV700',
        budget: '15-20L',
        preferredModel: 'XUV700',
        created: '2023-11-10T11:30:00Z'
    },
    {
        id: 8,
        name: 'Meera Nair',
        email: 'meera.n@email.com',
        phone: '+91 65432 10988',
        source: 'Google Ads',
        status: 'new',
        lastContacted: null,
        nextFollowUp: '2023-11-29',
        notes: 'Looking for electric vehicles',
        budget: '15-20L',
        preferredModel: 'XUV400 EV',
        created: '2023-11-25T10:15:00Z'
    },
    {
        id: 9,
        name: 'Arjun Reddy',
        email: 'arjun.r@email.com',
        phone: '+91 98765 43212',
        source: 'Twitter',
        status: 'not_interested',
        lastContacted: '2023-11-22T14:30:00Z',
        nextFollowUp: null,
        notes: 'Found better deal elsewhere',
        budget: '10-15L',
        preferredModel: 'Scorpio',
        created: '2023-11-20T09:45:00Z'
    },
    {
        id: 10,
        name: 'Divya Menon',
        email: 'divya.m@email.com',
        phone: '+91 87654 32111',
        source: 'Facebook',
        status: 'follow_up',
        lastContacted: '2023-11-23T15:20:00Z',
        nextFollowUp: '2023-11-27',
        notes: 'Waiting for loan approval',
        budget: '15-20L',
        preferredModel: 'XUV700',
        created: '2023-11-22T11:10:00Z'
    }
];

// Status mapping
const statusMap = {
    'new': { text: 'New', class: 'status-new' },
    'contacted': { text: 'Contacted', class: 'status-contacted' },
    'follow_up': { text: 'Follow-up', class: 'status-follow-up' },
    'not_interested': { text: 'Not Interested', class: 'status-not-interested' },
    'converted': { text: 'Converted', class: 'status-converted' }
};

// Source mapping
const sourceMap = {
    'Facebook': { icon: 'facebook', class: 'source-facebook' },
    'Twitter': { icon: 'twitter', class: 'source-twitter' },
    'Google Ads': { icon: 'google', class: 'source-google' },
    'Website': { icon: 'language', class: 'source-website' },
    'Instagram': { icon: 'instagram', class: 'source-instagram' },
    'Walk-in': { icon: 'directions_walk', class: 'source-walkin' }
};

// Get status count
function getStatusCount(leads) {
    return leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
    }, { 'new': 0, 'contacted': 0, 'follow_up': 0, 'not_interested': 0, 'converted': 0 });
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Format time
function formatTime(dateString) {
    if (!dateString) return '';
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
}
