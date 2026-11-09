const axios = require('axios');
const env = require('../config/env');
const { checkDatabaseConnection, getDatabaseDebugInfo } = require('../config/database');

class SystemService {
  async getHealth() {
    const dbStatus = await checkDatabaseConnection();
    let debugInfo = {};
    try {
      debugInfo = await getDatabaseDebugInfo();
    } catch (_) {}
    return {
      status: dbStatus.connected ? 'ok' : 'degraded',
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
      database: {
        connected: dbStatus.connected,
        client: dbStatus.client,
        error: dbStatus.error,
        ...debugInfo
      }
    };
  }

  async getMlStatus() {
    try {
      const response = await axios.get(`${env.mlServerUrl}/health`, { timeout: 3000 });
      return {
        reachable: true,
        url: env.mlServerUrl,
        response: response.data
      };
    } catch (err) {
      return {
        reachable: false,
        url: env.mlServerUrl,
        error: err.message || 'Server 2 ML microservice unreachable'
      };
    }
  }
}

module.exports = new SystemService();
