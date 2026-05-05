import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

/**
 * Structured request logger.
 *
 * Emits one JSON line per request to stdout. Cloud Run ingests stdout into
 * Cloud Logging, where the JSON object is parsed into structured fields.
 * Per CLAUDE.md non-negotiable: no raw plan bytes or corrections-letter
 * contents are ever written to logs — only metadata (path, status, latency,
 * request id, project id when present in body).
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = (req.headers['x-request-id'] as string | undefined) || randomUUID();
  res.setHeader('x-request-id', requestId);

  // Capture the project_id if the route validates it later; we read after
  // express.json() has populated req.body, but only sniff a known-safe field.
  const projectId =
    typeof req.body === 'object' && req.body !== null && 'project_id' in req.body
      ? String((req.body as Record<string, unknown>).project_id ?? '')
      : undefined;

  res.on('finish', () => {
    const entry = {
      severity: res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARNING' : 'INFO',
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      latencyMs: Date.now() - start,
      projectId,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] ?? req.socket.remoteAddress,
    };
    // One JSON line per request; Cloud Logging parses this format natively.
    process.stdout.write(JSON.stringify(entry) + '\n');
  });

  next();
}
