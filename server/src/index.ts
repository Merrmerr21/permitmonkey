import express from 'express';
import { generateRouter } from './routes/generate.js';
import { extractRouter } from './routes/extract.js';
import { metricsRouter } from './routes/metrics.js';
import { requestLogger } from './middleware/logging.js';
import { requestCounter, requestLatency } from './services/metrics-store.js';

const app = express();

// Middleware — order matters: json body parsing first so logger can sniff
// project_id, then logger so every request gets a structured line.
app.use(express.json({ limit: '5mb' }));
app.use(requestLogger);
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const route = req.route?.path ?? req.path;
    requestCounter.inc({ route, status: String(res.statusCode), method: req.method });
    requestLatency.observe(Date.now() - start, { route });
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/generate', generateRouter);
app.use('/extract', extractRouter);
app.use('/metrics', metricsRouter);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Structured error log; the requestLogger already captured the 500 status.
  process.stdout.write(
    JSON.stringify({
      severity: 'ERROR',
      requestId: res.getHeader('x-request-id'),
      message: err.message,
      stack: err.stack,
    }) + '\n',
  );
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`PermitMonkey server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
