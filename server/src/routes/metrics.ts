import { Router } from 'express';
import { metrics } from '../services/metrics-store.js';

/**
 * Prometheus-compatible /metrics endpoint.
 *
 * Read by any standard scraper. The metrics store is in-process and resets
 * on each Cloud Run cold start — adequate for spot-checks and low-volume
 * dashboards; upgrade to a hosted backend (e.g. Grafana Cloud) before scale.
 */
export const metricsRouter = Router();

metricsRouter.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain; version=0.0.4');
  res.send(metrics.render());
});
