const env = require('../config/env');

const SENSITIVE_KEYS = ['password', 'password_hash', 'token', 'jwt', 'secret', 'aws_secret_access_key'];

function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitized[key] = sanitize(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}

const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      meta: sanitize(meta)
    }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      meta: sanitize(meta)
    }));
  },
  error: (message, meta = {}) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      meta: sanitize(meta)
    }));
  },
  debug: (message, meta = {}) => {
    if (env.nodeEnv === 'development') {
      console.debug(JSON.stringify({
        level: 'DEBUG',
        timestamp: new Date().toISOString(),
        message,
        meta: sanitize(meta)
      }));
    }
  }
};

module.exports = logger;
