const { db } = require('../config/database');

class OrganizationService {
  async getById(id) {
    const org = await db('organizations').where({ id }).first();
    if (!org) {
      throw new Error('Organization not found');
    }
    return org;
  }

  async update(id, data) {
    const allowed = ['name', 'industry', 'currency'];
    const updateData = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    updateData.updated_at = db.fn.now();

    await db('organizations').where({ id }).update(updateData);
    return await this.getById(id);
  }
}

module.exports = new OrganizationService();
