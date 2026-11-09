const systemService = require('../services/systemService');

class SystemController {
  async getHealth(req, res) {
    const health = await systemService.getHealth();
    // Return HTTP 200 with health state status: "ok" or "degraded"
    return res.status(200).json(health);
  }

  async getMlStatus(req, res) {
    const mlStatus = await systemService.getMlStatus();
    return res.status(200).json({
      success: true,
      data: mlStatus
    });
  }
}

module.exports = new SystemController();
