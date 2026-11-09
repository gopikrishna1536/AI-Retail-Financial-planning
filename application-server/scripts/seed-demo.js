const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../src/config/database');
const logger = require('../src/utils/logger');

async function seedDemoData() {
  logger.info('Starting development seed script...');

  await db.transaction(async (trx) => {
    // 1. Create demo organization
    let org = await trx('organizations').where({ code: 'retailcorp-india' }).first();
    if (!org) {
      const orgId = uuidv4();
      await trx('organizations').insert({
        id: orgId,
        name: 'RetailCorp India',
        code: 'retailcorp-india',
        currency: 'INR',
        industry: 'Retail Store Operations'
      });
      org = { id: orgId, name: 'RetailCorp India' };
      logger.info(`Created demo organization: ${org.name} (${org.id})`);
    }

    const orgId = org.id;

    // 2. Demo Users
    const demoUsers = [
      {
        email: 'admin@retailcorp.com',
        password: 'AdminPassword123!',
        first_name: 'System',
        last_name: 'Admin',
        role: 'ADMIN'
      },
      {
        email: 'manager@retailcorp.com',
        password: 'ManagerPassword123!',
        first_name: 'Store',
        last_name: 'Manager',
        role: 'MANAGER'
      },
      {
        email: 'analyst@retailcorp.com',
        password: 'AnalystPassword123!',
        first_name: 'Financial',
        last_name: 'Analyst',
        role: 'ANALYST'
      },
      {
        email: 'staff@retailcorp.com',
        password: 'StaffPassword123!',
        first_name: 'Frontline',
        last_name: 'Staff',
        role: 'STAFF'
      }
    ];

    for (const u of demoUsers) {
      const existing = await trx('users').where({ organization_id: orgId, email: u.email }).first();
      if (!existing) {
        const password_hash = await bcrypt.hash(u.password, 10);
        await trx('users').insert({
          id: uuidv4(),
          organization_id: orgId,
          email: u.email,
          password_hash,
          first_name: u.first_name,
          last_name: u.last_name,
          role: u.role,
          is_active: true
        });
        logger.info(`Created demo user: ${u.email} [Role: ${u.role}]`);
      }
    }
  });

  logger.info('Demo seeding completed successfully.');
}

if (require.main === module) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Seeding failed', { error: err.message, stack: err.stack });
      process.exit(1);
    });
}

module.exports = seedDemoData;
