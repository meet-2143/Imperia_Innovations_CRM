const fs = require('fs/promises');
const path = require('path');

// Helper to read DB
const getDb = async () => {
    const data = await fs.readFile(path.join(__dirname, '../data/db.json'), 'utf8');
    return JSON.parse(data);
};

const getAdminStats = async (req, res) => {
    try {
        const db = await getDb();
        const { users, leads, attendance } = db;

        const totalLeads = leads.length;
        const activeEmployees = users.filter(u => u.role === 'salesman').length; // Assuming all in db are 'active' for now

        // Attendance today
        const today = new Date().toISOString().split('T')[0];
        const presentRecords = attendance.filter(a => a.date === today && a.status === 'Present');
        const presentToday = presentRecords.length;

        // Get details of present employees
        const presentEmployeesList = presentRecords.map(record => {
            const user = users.find(u => u.id === record.userId);
            return {
                id: user ? user.id : record.userId,
                name: user ? user.name : 'Unknown',
                role: user ? user.role : 'N/A',
                checkInTime: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'Present'
            };
        });

        // Calculate Absent Employees (Active Salesmen not in present list)
        const allSalesmen = users.filter(u => u.role === 'salesman');
        const presentUserIds = presentRecords.map(r => r.userId);

        const absentEmployeesList = allSalesmen
            .filter(user => !presentUserIds.includes(user.id))
            .map(user => ({
                id: user.id,
                name: user.name,
                role: user.role,
                status: 'Absent'
            }));

        res.json({
            totalLeads,
            activeEmployees,
            presentToday,
            presentEmployeesList,
            absentEmployeesList,
            performance: 'Good'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
};

const getEmployeeStats = async (req, res) => {
    try {
        const db = await getDb();
        const { leads, users, attendance } = db;
        const userId = req.user.id;

        const myLeads = leads.filter(l => l.assignedTo === userId);
        const assignedLeadsCount = myLeads.length;

        // Targets (Mock data if not in user object yet, or fetch from user)
        const user = users.find(u => u.id === userId);
        const targets = user.targets || 50;
        const achieved = user.achieved || myLeads.filter(l => l.status === 'Closed').length;

        // Follow-ups due (Mocking logic: leads in 'In Progress')
        const followUpsDue = myLeads.filter(l => l.status === 'In Progress').length;

        // Attendance status
        const today = new Date().toISOString().split('T')[0];
        const attendanceRecord = attendance.find(a => a.userId === userId && a.date === today);
        const attendanceStatus = attendanceRecord ? attendanceRecord.status : 'Not Marked';

        res.json({
            assignedLeadsCount,
            targets,
            achieved,
            followUpsDue,
            attendanceStatus
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee stats' });
    }
};

module.exports = { getAdminStats, getEmployeeStats };
