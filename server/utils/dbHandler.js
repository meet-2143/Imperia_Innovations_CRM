const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

const readDB = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading DB:", error);
        // If file doesn't exist, return default structure
        return { users: [], leads: [], attendance: [] };
    }
};

const writeDB = async (data) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing DB:", error);
    }
};

module.exports = { readDB, writeDB };
