const { readDB, writeDB } = require('../utils/dbHandler');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const addSeller = async (req, res) => {
    const { name, email, password, zone } = req.body;
    try {
        const db = await readDB();

        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role: 'salesman',
            zone
        };

        db.users.push(newSeller);
        await writeDB(db);

        // Remove password from response
        const { password: _, ...sellerData } = newSeller;
        res.status(201).json(sellerData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateSeller = async (req, res) => {
    const { id } = req.params;
    const { name, zone } = req.body;

    try {
        const db = await readDB();
        const userIndex = db.users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = db.users[userIndex];
        if (user.role !== 'salesman') {
            return res.status(400).json({ message: 'Can only update salesmen' });
        }

        db.users[userIndex] = { ...user, name: name || user.name, zone: zone || user.zone };
        await writeDB(db);

        const { password: _, ...updatedUser } = db.users[userIndex];
        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getSellers = async (req, res) => {
    try {
        const db = await readDB();
        const sellers = db.users
            .filter(u => u.role === 'salesman')
            .map(({ password, ...u }) => u);
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { addSeller, updateSeller, getSellers };
