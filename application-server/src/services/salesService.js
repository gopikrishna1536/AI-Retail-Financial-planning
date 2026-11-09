const { db } = require('../config/database');

// In-memory cache for total counts (15 sec TTL)
let countCache = { key: null, total: 0, timestamp: 0 };

class SalesService {
  async getAll(organizationId, filters = {}, pagination = { page: 1, limit: 50 }) {
    const hasCategoryFilter = Boolean(filters.category_id || filters.category);
    const hasProductFilter = Boolean(filters.product_id || filters.product);
    const hasStoreFilter = Boolean(filters.store_id || filters.store || filters.business_unit_id || filters.business_unit || filters.region);

    // 1. Calculate count efficiently
    const cacheKey = JSON.stringify({ organizationId, filters });
    const now = Date.now();
    let total = 0;

    if (countCache.key === cacheKey && (now - countCache.timestamp) < 15000) {
      total = countCache.total;
    } else {
      let countQuery = db('sales').where('sales.organization_id', organizationId);

      if (hasStoreFilter) {
        countQuery = countQuery.join('stores', 'sales.store_id', 'stores.id');
        if (filters.store_id || filters.store) countQuery = countQuery.andWhere('sales.store_id', filters.store_id || filters.store);
        if (filters.business_unit_id || filters.business_unit) countQuery = countQuery.andWhere('stores.business_unit_id', filters.business_unit_id || filters.business_unit);
        if (filters.region) countQuery = countQuery.andWhere('stores.region', filters.region);
      }

      if (hasCategoryFilter || hasProductFilter) {
        countQuery = countQuery.join('products', 'sales.product_id', 'products.id');
        if (filters.product_id || filters.product) countQuery = countQuery.andWhere('sales.product_id', filters.product_id || filters.product);
        if (hasCategoryFilter) {
          countQuery = countQuery.join('categories', 'products.category_id', 'categories.id');
          countQuery = countQuery.andWhere('products.category_id', filters.category_id || filters.category);
        }
      }

      if (filters.date) countQuery = countQuery.andWhere('sales.sales_date', filters.date);
      if (filters.start_date) countQuery = countQuery.andWhere('sales.sales_date', '>=', filters.start_date);
      if (filters.end_date) countQuery = countQuery.andWhere('sales.sales_date', '<=', filters.end_date);

      const countRes = await countQuery.count({ total: 'sales.id' }).first();
      total = Number(countRes?.total || countRes?.['count(`sales`.`id`)'] || 0);

      countCache = { key: cacheKey, total, timestamp: now };
    }

    // 2. Query items with limit and offset
    let query = db('sales')
      .join('stores', 'sales.store_id', 'stores.id')
      .join('products', 'sales.product_id', 'products.id')
      .join('categories', 'products.category_id', 'categories.id')
      .where('sales.organization_id', organizationId);

    if (filters.store_id || filters.store) query = query.andWhere('sales.store_id', filters.store_id || filters.store);
    if (filters.product_id || filters.product) query = query.andWhere('sales.product_id', filters.product_id || filters.product);
    if (filters.category_id || filters.category) query = query.andWhere('products.category_id', filters.category_id || filters.category);
    if (filters.business_unit_id || filters.business_unit) query = query.andWhere('stores.business_unit_id', filters.business_unit_id || filters.business_unit);
    if (filters.date) query = query.andWhere('sales.sales_date', filters.date);
    if (filters.start_date) query = query.andWhere('sales.sales_date', '>=', filters.start_date);
    if (filters.end_date) query = query.andWhere('sales.sales_date', '<=', filters.end_date);
    if (filters.region) query = query.andWhere('stores.region', filters.region);

    const offset = (pagination.page - 1) * pagination.limit;
    const items = await query
      .select(
        'sales.id',
        'sales.order_id',
        'sales.sales_date',
        'sales.order_date',
        'sales.ship_date',
        'sales.ship_mode',
        'sales.year',
        'sales.quantity',
        'sales.sales_amount',
        'sales.discount',
        'sales.profit_amount',
        'stores.store_code',
        'stores.state',
        'stores.region',
        'stores.outlet_type',
        'stores.city_type',
        'products.product_code',
        'products.product_name',
        'categories.category_name',
        'categories.sub_category_name'
      )
      .limit(pagination.limit)
      .offset(offset)
      .orderBy('sales.sales_date', 'desc');

    return { items, total };
  }

  async getById(id, organizationId) {
    const sale = await db('sales')
      .join('stores', 'sales.store_id', 'stores.id')
      .join('products', 'sales.product_id', 'products.id')
      .join('categories', 'products.category_id', 'categories.id')
      .where({ 'sales.id': id, 'sales.organization_id': organizationId })
      .select(
        'sales.*',
        'stores.store_code',
        'stores.state',
        'stores.region',
        'products.product_name',
        'categories.category_name'
      )
      .first();

    if (!sale) {
      throw new Error('Sale record not found');
    }
    return sale;
  }
}

module.exports = new SalesService();
