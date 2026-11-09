import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const routes = [
    'login',
    'dashboard',
    'store-profit-pathway',
    'financial-planning',
    'sales',
    'expenses',
    'budgets',
    'forecasting',
    'variance-analysis',
    'budget-optimization',
    'what-if-analysis',
    'risk-alerts',
    'recommendations',
    'stores',
    'products',
    'business-units',
    'reports',
    'aws-deployment',
    'settings',
    '404'
  ];

  routes.forEach((route) => {
    const targetFile = path.join(distDir, `${route}.html`);
    fs.copyFileSync(indexPath, targetFile);
  });

  console.log(`[SPA Routing] Generated ${routes.length} pre-rendered SPA entry points for clean routing on Vercel.`);
} else {
  console.warn('[SPA Routing] dist/index.html not found, skipping route copies.');
}
