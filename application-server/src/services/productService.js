const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ProductService {
  async getAll(organizationId, filters = {}, pagination = { page: 1, limit: 50 }) {
    let query = db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .where('products.organization_id', organizationId);

    if (filters.category_id) {
      query = query.andWhere('products.category_id', filters.category_id);
    }
    if (filters.category_name) {
      query = query.andWhere('categories.category_name', filters.category_name);
    }
    if (filters.sub_category_name) {
      query = query.andWhere('categories.sub_category_name', filters.sub_category_name);
    }
    if (filters.search) {
      query = query.andWhere('products.product_name', 'like', `%${filters.search}%`);
    }

    const countQuery = query.clone().clearSelect().count({ total: 'products.id' }).first();
    const totalRes = await countQuery;
    const total = Number(totalRes.total || totalRes['count(`products`.`id`)'] || 0);

    const offset = (pagination.page - 1) * pagination.limit;
    const items = await query
      .select(
        'products.id',
        'products.organization_id',
        'products.product_code',
        'products.product_name',
        'products.category_id',
        'categories.category_name',
        'categories.sub_category_name',
        'products.created_at'
      )
      .limit(pagination.limit)
      .offset(offset)
      .orderBy('products.product_name', 'asc');

    return { items, total };
  }

  async getById(id, organizationId) {
    const product = await db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .where({ 'products.id': id, 'products.organization_id': organizationId })
      .select(
        'products.*',
        'categories.category_name',
        'categories.sub_category_name'
      )
      .first();

    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async create(organizationId, data) {
    const id = uuidv4();
    const newProduct = {
      id,
      organization_id: organizationId,
      category_id: data.category_id,
      product_code: data.product_code,
      product_name: data.product_name
    };

    await db('products').insert(newProduct);
    return await this.getById(id, organizationId);
  }

  async update(id, organizationId, data) {
    await this.getById(id, organizationId);
    
    const allowed = ['category_id', 'product_code', 'product_name'];
    const updateData = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    updateData.updated_at = db.fn.now();

    await db('products').where({ id, organization_id: organizationId }).update(updateData);
    return await this.getById(id, organizationId);
  }

  async deleteProduct(id, organizationId) {
    await this.getById(id, organizationId);
    await db('products').where({ id, organization_id: organizationId }).delete();
    return { success: true, message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();
