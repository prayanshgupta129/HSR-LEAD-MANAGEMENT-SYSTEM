// Dashboard Utilities
const DashboardUtils = (function() {
    // Get lead statistics
    function getLeadStats(leads) {
        const totalLeads = leads.length;
        const newLeads = leads.filter(lead => lead.status === 'new').length;
        const contactedLeads = leads.filter(lead => lead.status === 'contacted').length;
        const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
        const notInterested = leads.filter(lead => lead.status === 'not_interested').length;
        
        // Calculate conversion rate (percentage of converted leads)
        const conversionRate = totalLeads > 0 
            ? Math.round((convertedLeads / totalLeads) * 100) 
            : 0;
            
        return {
            totalLeads,
            newLeads,
            contactedLeads,
            convertedLeads,
            notInterested,
            conversionRate
        };
    }
    
    // Get leads by source
    function getLeadsBySource(leads) {
        const sources = {};
        leads.forEach(lead => {
            const source = lead.source || 'Unknown';
            sources[source] = (sources[source] || 0) + 1;
        });
        return sources;
    }
    
    // Get leads by status
    function getLeadsByStatus(leads) {
        const statusCounts = {
            'new': 0,
            'contacted': 0,
            'follow_up': 0,
            'converted': 0,
            'not_interested': 0
        };
        
        leads.forEach(lead => {
            if (statusCounts.hasOwnProperty(lead.status)) {
                statusCounts[lead.status]++;
            }
        });
        
        return statusCounts;
    }
    
    // Get recent leads
    function getRecentLeads(leads, limit = 5) {
        return [...leads]
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .slice(0, limit);
    }
    
    // Get leads by date (for time-based analysis)
    function getLeadsByDate(leads, days = 30) {
        const dateMap = {};
        const today = new Date();
        
        // Initialize date map for the last 'days' days
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dateMap[dateStr] = 0;
        }
        
        // Count leads per day
        leads.forEach(lead => {
            if (lead.created) {
                const leadDate = new Date(lead.created).toISOString().split('T')[0];
                if (dateMap.hasOwnProperty(leadDate)) {
                    dateMap[leadDate]++;
                }
            }
        });
        
        return dateMap;
    }
    
    // Get leads by preferred model
    function getLeadsByModel(leads) {
        const models = {};
        leads.forEach(lead => {
            if (lead.preferredModel) {
                const model = lead.preferredModel;
                models[model] = (models[model] || 0) + 1;
            }
        });
        return models;
    }
    
    // Get leads by budget range
    function getLeadsByBudget(leads) {
        const budgetRanges = {
            'Under 5L': 0,
            '5L - 10L': 0,
            '10L - 15L': 0,
            '15L - 20L': 0,
            '20L+': 0
        };
        
        leads.forEach(lead => {
            if (lead.budget) {
                // Extract numeric value from budget string
                const match = lead.budget.match(/(\d+)/);
                if (match) {
                    const value = parseInt(match[0], 10);
                    if (value < 5) budgetRanges['Under 5L']++;
                    else if (value < 10) budgetRanges['5L - 10L']++;
                    else if (value < 15) budgetRanges['10L - 15L']++;
                    else if (value < 20) budgetRanges['15L - 20L']++;
                    else budgetRanges['20L+']++;
                }
            }
        });
        
        return budgetRanges;
    }
    
    // Get leads requiring follow-up
    function getLeadsNeedingFollowUp(leads) {
        const today = new Date().toISOString().split('T')[0];
        return leads.filter(lead => 
            lead.nextFollowUp && 
            lead.nextFollowUp <= today &&
            lead.status !== 'converted' &&
            lead.status !== 'not_interested'
        );
    }
    
    return {
        getLeadStats,
        getLeadsBySource,
        getLeadsByStatus,
        getRecentLeads,
        getLeadsByDate,
        getLeadsByModel,
        getLeadsByBudget,
        getLeadsNeedingFollowUp
    };
})();
