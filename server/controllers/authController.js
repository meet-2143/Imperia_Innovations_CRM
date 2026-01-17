const { readDB, writeDB } = require('../utils/dbHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Login & Mark Attendance
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await readDB();
        const user = db.users.find(u => u.email === email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        // Mark Attendance
        const today = new Date().toISOString().split('T')[0];
        const existingAttendance = db.attendance.find(a => a.userId === user.id && a.date === today);

        if (!existingAttendance) {
            db.attendance.push({
                id: uuidv4(),
                userId: user.id,
                date: today,
                status: 'Present',
                timestamp: new Date().toISOString()
            });
            await writeDB(db);
        }

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, zone: user.zone }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMe = async (req, res) => {
    // Configured middleware will attach user to req
    try {
        const db = await readDB();
        const user = db.users.find(u => u.id === req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { login, getMe };
