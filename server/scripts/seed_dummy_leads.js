const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../data/db.json');

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const dummyData = {
    companies: ['Alpha Corp', 'Beta Industries', 'Gamma Solutions', 'Delta Tech', 'Epsilon Enterprises', 'Zeta Global'],
    products: ['Industrial Pump', 'Solar Panel', 'Cotton Yarn', 'Steel Rods', 'Chemical Solvent', 'Packaging Machine'],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Surat'],
    names: ['Rahul Kumar', 'Amit Shah', 'Priya Patel', 'Sneha Gupta', 'Vikram Singh', 'Anjali Sharma']
};

try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);

    const salesmen = db.users.filter(u => u.role === 'salesman');

    console.log(`Found ${salesmen.length} salesmen.`);

    let newLeadsCount = 0;

    salesmen.forEach(salesman => {
        // Generate 3-4 leads for each salesman
        const leadsCount = Math.floor(Math.random() * 2) + 3; // 3 or 4

        for (let i = 0; i < leadsCount; i++) {
            const company = getRandomElement(dummyData.companies);
            const product = getRandomElement(dummyData.products);
            const city = getRandomElement(dummyData.cities);
            const name = getRandomElement(dummyData.names);

            const newLead = {
                id: uuidv4(),
                // IndiaMART Fields
                senderName: name,
                senderMobile: `98${Math.floor(Math.random() * 100000000)}`,
                senderEmail: `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(' ', '')}.com`,
                senderCompany: company,
                senderAddress: `${Math.floor(Math.random() * 100)} Industrial Estate`,
                senderCity: city,
                senderState: 'State', // Simplified
                senderCountry: 'India',
                senderPincode: `4000${Math.floor(Math.random() * 90)}`,

                queryProductName: product,
                queryMessage: `Interested in buying ${product}. Please send details.`,
                queryQuantity: `${Math.floor(Math.random() * 100) + 10}`,
                queryUnit: 'Units',
                queryBudget: 'Not Specified',

                enqSource: 'IndiaMART',

                // System Fields
                zone: salesman.zone,
                assignedTo: salesman.id,
                status: 'New', // Default status
                createdAt: new Date().toISOString(),
                photoUrl: ''
            };

            db.leads.push(newLead);
            newLeadsCount++;
        }
    });

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(`Successfully added ${newLeadsCount} new dummy leads.`);

} catch (error) {
    console.error('Error seeding leads:', error);
}
