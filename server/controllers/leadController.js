const { readDB, writeDB } = require('../utils/dbHandler');
const { v4: uuidv4 } = require('uuid');

// Get all leads (with filters)
const getLeads = async (req, res) => {
    try {
        const db = await readDB();
        let leads = db.leads;

        // If salesman, only show their leads
        if (req.user.role === 'salesman') {
            leads = leads.filter(l => l.assignedTo === req.user.id);
        }

        // Hydrate AssignedTo Name
        const hydratedLeads = leads.map(lead => {
            const assignee = db.users.find(u => u.id === lead.assignedTo);
            return { ...lead, assignedToName: assignee ? assignee.name : 'Unassigned' };
        });

        res.json(hydratedLeads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create Lead & Auto Assign
// Create Lead & Auto Assign
const createLead = async (req, res) => {
    try {
        const db = await readDB();
        const {
            // Sender Details
            senderName, senderMobile, senderEmail, senderCompany,
            senderAddress, senderCity, senderState, senderCountry, senderPincode,

            // Query Details
            queryProductName, queryMessage, queryQuantity, queryUnit, queryBudget,

            // Meta
            enqSource, zone
        } = req.body;

        // Duplicate Check (using Mobile or Email)
        const duplicate = db.leads.find(l =>
            (senderEmail && l.senderEmail === senderEmail) ||
            (senderMobile && l.senderMobile === senderMobile)
        );

        if (duplicate) {
            return res.status(400).json({ message: 'Lead with this email or mobile already exists' });
        }

        // Automatic Assignment Logic
        const salesmanUsers = db.users.filter(u => u.role === 'salesman');
        let assignedTo = null;

        // 1. Try to assign by Zone
        if (zone) {
            const zoneSalesmen = salesmanUsers.filter(u => u.zone === zone);
            if (zoneSalesmen.length > 0) {
                // Randomly pick one from the zone
                assignedTo = zoneSalesmen[Math.floor(Math.random() * zoneSalesmen.length)].id;
            }
        }

        // 2. Fallback: Assign to ANY salesman if no zone match
        if (!assignedTo && salesmanUsers.length > 0) {
            assignedTo = salesmanUsers[Math.floor(Math.random() * salesmanUsers.length)].id;
        }

        const newLead = {
            id: uuidv4(),
            // Core IndiaMART Fields
            senderName,
            senderMobile,
            senderEmail,
            senderCompany,
            senderAddress,
            senderCity,
            senderState,
            senderCountry,
            senderPincode,

            queryProductName,
            queryMessage,
            queryQuantity,
            queryUnit,
            queryBudget,

            enqSource: enqSource || 'Manual',

            // System Fields
            zone: zone || 'Unassigned',
            assignedTo,
            status: 'New',
            createdAt: new Date().toISOString(),
            photoUrl: req.file ? `/uploads/${req.file.filename}` : ''
        };

        db.leads.push(newLead);
        await writeDB(db);

        // Fetch assigned user name for response if needed
        const assignedUser = db.users.find(u => u.id === assignedTo);
        const responseLead = { ...newLead, assignedToName: assignedUser ? assignedUser.name : 'Unassigned' };

        res.status(201).json(responseLead);

    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({ message: 'Error creating lead' });
    }
};

const updateLead = async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    try {
        const db = await readDB();
        const leadIndex = db.leads.findIndex(l => l.id === id);

        if (leadIndex === -1) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Permission check: Admin or Assigned Salesman
        const lead = db.leads[leadIndex];
        if (req.user.role !== 'admin' && lead.assignedTo !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update fields if provided
        if (status) db.leads[leadIndex].status = status;
        if (notes !== undefined) db.leads[leadIndex].notes = notes;

        await writeDB(db);

        res.json(db.leads[leadIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getLeads, createLead, updateLead };
