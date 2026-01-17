const { writeDB } = require('./utils/dbHandler');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedData = async () => {
    console.log('Seeding Data...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
        {
            id: uuidv4(),
            name: 'Admin User',
            email: 'admin@crm.com',
            password: hashedPassword,
            role: 'admin',
            zone: 'Global'
        },
        {
            id: uuidv4(),
            name: 'Salesman A',
            email: 'salesA@crm.com',
            password: hashedPassword,
            role: 'salesman',
            zone: 'Zone A'
        },
        {
            id: uuidv4(),
            name: 'Salesman B',
            email: 'salesB@crm.com',
            password: hashedPassword,
            role: 'salesman',
            zone: 'Zone B'
        },
        {
            id: uuidv4(),
            name: 'Salesman C',
            email: 'salesC@crm.com',
            password: hashedPassword,
            role: 'salesman',
            zone: 'Zone C'
        }
    ];

    // Leads - some unassigned, some assigned based on logic (will be done in controller, but here static)
    // Actually, let's leave leads empty or just minimal to test list
    const leads = [
        {
            id: uuidv4(),
            name: 'Potential Client 1',
            contact: '1234567890',
            zone: 'Zone A',
            assignedTo: users[1].id, // Salesman A
            status: 'New'
        },
        {
            id: uuidv4(),
            name: 'Potential Client 2',
            contact: '0987654321',
            zone: 'Zone B',
            assignedTo: users[2].id, // Salesman B
            status: 'In Progress'
        }
    ];

    const attendance = [];

    await writeDB({ users, leads, attendance });
    console.log('Data Seeded Successfully!');
};

seedData();
