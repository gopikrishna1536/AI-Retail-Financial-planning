const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CategoryService {
  async getAll(organizationId) {
    return await db('categories')
      .where({ organization_id: organizationId })
      .select('*')
      .orderBy('category_name', 'asc')
      .orderBy('sub_category_name', 'asc');
  }

  async getById(id, organizationId) {
    const category = await db('categories').where({ id, organization_id: organizationId }).first();
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async create(organizationId, data) {
    const id = uuidv4();
    const newCat = {
      id,
      organization_id: organizationId,
      category_name: data.category_name,
      sub_category_name: data.sub_category_name
    };

    await db('categories').insert(newCat);
    return await this.getById(id, organizationId);
  }

  async update(id, organizationId, data) {
    await this.getById(id, organizationId);
    
    const allowed = ['category_name', 'sub_category_name'];
    const updateData = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    updateData.updated_at = db.fn.now();

    await db('categories').where({ id, organization_id: organizationId }).update(updateData);
    return await this.getById(id, organizationId);
  }

  async deleteCategory(id, organizationId) {
    await this.getById(id, organizationId);
    await db('categories').where({ id, organization_id: organizationId }).delete();
    return { success: true, message: 'Category deleted successfully' };
  }
}

module.exports = new CategoryService();
