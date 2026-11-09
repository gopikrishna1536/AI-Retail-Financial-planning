const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { getSpecificLocation } = require('../utils/storeLocationMetadata');

class StoreService {
  /**
   * Helper to enrich store entity with specific physical location and operational metadata
   */
  enrichStore(store) {
    if (!store) return null;
    const locationMeta = getSpecificLocation(store.store_code, store.state, store.outlet_type);
    return {
      ...store,
      locality: locationMeta.locality,
      address: locationMeta.address,
      landmark: locationMeta.landmark,
      trading_format: locationMeta.trading_format,
      sqft: locationMeta.sqft,
      staff_count: locationMeta.staff_count,
      manager_name: locationMeta.manager_name,
      contact_phone: locationMeta.contact_phone,
      operating_hours: locationMeta.operating_hours
    };
  }

  async getAll(organizationId, filters = {}) {
    const STATE_TO_REGION = {
      'Delhi': 'North',
      'Punjab': 'North',
      'Uttar Pradesh': 'North',
      'Maharashtra': 'West',
      'Gujarat': 'West',
      'Rajasthan': 'West',
      'Karnataka': 'South',
      'Tamil Nadu': 'South',
      'West Bengal': 'East',
      'Madhya Pradesh': 'East'
    };

    let filterState = filters.state;
    let filterRegion = filters.region;

    if (filterState && filterRegion && STATE_TO_REGION[filterState] && STATE_TO_REGION[filterState] !== filterRegion) {
      filterState = null;
    }

    let query = db('stores').where({ organization_id: organizationId });

    if (filterState) query = query.andWhere({ state: filterState });
    if (filterRegion) query = query.andWhere({ region: filterRegion });
    if (filters.outlet_type) query = query.andWhere({ outlet_type: filters.outlet_type });
    if (filters.city_type) query = query.andWhere({ city_type: filters.city_type });

    const rawStores = await query.select('*').orderBy('store_code', 'asc');
    return rawStores.map(s => this.enrichStore(s));
  }

  async getById(id, organizationId) {
    const store = await db('stores').where({ id, organization_id: organizationId }).first();
    if (!store) {
      throw new Error('Store not found');
    }
    return this.enrichStore(store);
  }

  async create(organizationId, data) {
    const id = uuidv4();
    const newStore = {
      id,
      organization_id: organizationId,
      business_unit_id: data.business_unit_id || null,
      store_code: data.store_code,
      state: data.state,
      postal_code: data.postal_code,
      city_type: data.city_type,
      outlet_type: data.outlet_type,
      region: data.region,
      country: data.country || 'India'
    };

    await db('stores').insert(newStore);
    return await this.getById(id, organizationId);
  }

  async update(id, organizationId, data) {
    await this.getById(id, organizationId); // Ensure exists
    
    const allowed = ['store_code', 'state', 'postal_code', 'city_type', 'outlet_type', 'region', 'country', 'business_unit_id'];
    const updateData = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    updateData.updated_at = db.fn.now();

    await db('stores').where({ id, organization_id: organizationId }).update(updateData);
    return await this.getById(id, organizationId);
  }

  async deleteStore(id, organizationId) {
    await this.getById(id, organizationId);
    await db('stores').where({ id, organization_id: organizationId }).delete();
    return { success: true, message: 'Store deleted successfully' };
  }
}

module.exports = new StoreService();
