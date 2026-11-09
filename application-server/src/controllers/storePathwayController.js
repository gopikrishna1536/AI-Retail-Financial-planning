const storePathwayService = require('../services/storePathwayService');
const logger = require('../utils/logger');

class StorePathwayController {
  async getAllPathways(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const filters = {
        region: req.query.region,
        outlet_type: req.query.outlet_type,
        state: req.query.state
      };
      const levers = {
        discountReduction: Number(req.query.discount_reduction || 0),
        assortmentShift: Number(req.query.assortment_shift || 0),
        opexSavings: Number(req.query.opex_savings || 0)
      };

      const data = await storePathwayService.getAllStorePathways(organizationId, filters, levers);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger.error('Failed to get store pathways:', error);
      next(error);
    }
  }

  async getStorePathway(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const { id } = req.params;
      const levers = {
        discountReduction: Number(req.query.discount_reduction || 0),
        assortmentShift: Number(req.query.assortment_shift || 0),
        opexSavings: Number(req.query.opex_savings || 0)
      };

      const data = await storePathwayService.getStorePathwayById(organizationId, id, levers);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger.error(`Failed to get pathway for store ${req.params.id}:`, error);
      next(error);
    }
  }

  async getClusterAnalysis(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const state = req.query.state || null;
      const allPathways = await storePathwayService.getAllStorePathways(organizationId, {});
      const data = await storePathwayService.getCityClusterAnalysis(organizationId, state, allPathways.stores);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger.error('Failed to get cluster analysis:', error);
      next(error);
    }
  }

  async simulatePathway(req, res, next) {
    try {
      const organizationId = req.user.organization_id;
      const {
        store_id,
        discount_reduction = 0,
        assortment_shift = 0,
        opex_savings = 0
      } = req.body;

      const levers = {
        discountReduction: Number(discount_reduction),
        assortmentShift: Number(assortment_shift),
        opexSavings: Number(opex_savings)
      };

      if (store_id) {
        const data = await storePathwayService.getStorePathwayById(organizationId, store_id, levers);
        return res.status(200).json({ success: true, data });
      }

      const data = await storePathwayService.getAllStorePathways(organizationId, {}, levers);
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger.error('Failed to simulate pathway:', error);
      next(error);
    }
  }
}

module.exports = new StorePathwayController();
