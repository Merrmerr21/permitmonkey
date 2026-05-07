/**
 * PermitMonkey MCP server — remote, intent-grouped, ready for the
 * claude.ai/directory.
 *
 * Per master playbook §65 + §104:
 *   - Pattern 1: Remote (HTTP transport, not stdio) — required for the
 *     directory.
 *   - Pattern 2: Intent-grouped tools, not endpoint mirrors. One tool:
 *     `check_ma_adu_eligibility`.
 *   - Pattern 4 (deferred to v0.2): MCP App for the verdict card. v0.1
 *     ships a structured JSON payload that any MCP-compatible client can
 *     render natively.
 *   - Pattern 5 (not applicable v0.1): CIMD auth. The eligibility check
 *     is a read-only public tool — no OAuth needed. Add when the
 *     corrections flow lands paid tiers.
 *
 * Cache discipline (master playbook §217): the server is stateless. Each
 * tool invocation is a deterministic function call with no side effects
 * and no cross-request state. There is no agent SDK call here, so the
 * cache-prefix invariants in docs/cache-discipline.md do not apply to
 * this surface — they apply to any future MCP server that wraps an LLM
 * call.
 *
 * Companion skill (master playbook §107): server/skills/permitmonkey-ma-eligibility/
 * pairs with this server. When the MCP skill-delivery extension at
 * github.com/modelcontextprotocol/experimental-ext-skills stabilizes,
 * the skill ships alongside the server automatically.
 */

import express, { type Request, type Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { evaluateEligibility, type EligibilityInput } from './eligibility.ts';

const TOOL_INPUT_SCHEMA = z.object({
  address: z.string().min(1).describe(
    'Property street address including city and "MA" or "Massachusetts". Example: "123 Main St, Boston, MA 02115".',
  ),
  lot_size_sqft: z.number().positive().describe(
    'Lot size in square feet. Find on the city assessor record or property deed.',
  ),
  primary_dwelling_sqft: z.number().positive().describe(
    'Gross floor area of the existing primary dwelling in square feet.',
  ),
  zoning_district: z.string().optional().describe(
    'Optional zoning district code if known (e.g., "R1", "Residence A-2").',
  ),
  proposed_adu_type: z.enum(['detached', 'attached', 'conversion', 'undecided']).optional()
    .describe('Type of ADU under consideration. Optional but improves accuracy.'),
  proposed_adu_sqft: z.number().positive().optional().describe(
    'Proposed ADU size in square feet. Optional. If provided and exceeds the state cap (lesser of 900 sqft or 50% of primary), the verdict will flag the issue.',
  ),
  within_half_mile_transit: z.boolean().optional().describe(
    'Whether the parcel is within 0.5 mi of a commuter rail station, subway stop, ferry terminal, or designated bus station. If true, parking is exempted under 760 CMR 71.00.',
  ),
  in_historic_district: z.boolean().optional().describe(
    'Whether the parcel is in a local historic district. Adds design-review process per MGL Ch 40C — does not preempt ADU use.',
  ),
});

type ToolInput = z.infer<typeof TOOL_INPUT_SCHEMA>;

const TOOL_NAME = 'check_ma_adu_eligibility';

const TOOL_DESCRIPTION = [
  'Check Massachusetts ADU (accessory dwelling unit) eligibility for a parcel.',
  '',
  'Returns a verdict (likely_eligible / needs_review / not_eligible) plus the maximum',
  'permitted ADU size, parking requirement, city-specific gotchas, next steps, and',
  'verifiable citations to MGL Ch 40A § 3 (as amended by St. 2024 c. 150 § 8) and',
  '760 CMR 71.00.',
  '',
  'Covered cities with full local-rule research: Boston, Cambridge, Somerville, Newton,',
  'Brookline. Other MA municipalities receive state-law-only analysis with a',
  'needs_review flag.',
  '',
  'This is a deterministic check (no LLM call, runs under 100ms). Suitable for',
  'real-time conversational use. Verdicts are non-binding preliminary analyses —',
  'always verify with the city building department before committing.',
].join('\n');

function buildServer(): Server {
  const server = new Server(
    {
      name: 'permitmonkey-ma-eligibility',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: TOOL_NAME,
        description: TOOL_DESCRIPTION,
        inputSchema: {
          type: 'object',
          properties: {
            address: { type: 'string', description: TOOL_INPUT_SCHEMA.shape.address.description },
            lot_size_sqft: { type: 'number', description: TOOL_INPUT_SCHEMA.shape.lot_size_sqft.description },
            primary_dwelling_sqft: { type: 'number', description: TOOL_INPUT_SCHEMA.shape.primary_dwelling_sqft.description },
            zoning_district: { type: 'string', description: TOOL_INPUT_SCHEMA.shape.zoning_district.description },
            proposed_adu_type: {
              type: 'string',
              enum: ['detached', 'attached', 'conversion', 'undecided'],
              description: TOOL_INPUT_SCHEMA.shape.proposed_adu_type.description,
            },
            proposed_adu_sqft: { type: 'number', description: TOOL_INPUT_SCHEMA.shape.proposed_adu_sqft.description },
            within_half_mile_transit: { type: 'boolean', description: TOOL_INPUT_SCHEMA.shape.within_half_mile_transit.description },
            in_historic_district: { type: 'boolean', description: TOOL_INPUT_SCHEMA.shape.in_historic_district.description },
          },
          required: ['address', 'lot_size_sqft', 'primary_dwelling_sqft'],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req: CallToolRequest) => {
    if (req.params.name !== TOOL_NAME) {
      throw new Error(`unknown tool: ${req.params.name}`);
    }

    const parsed = TOOL_INPUT_SCHEMA.safeParse(req.params.arguments);
    if (!parsed.success) {
      throw new Error(`invalid arguments: ${parsed.error.message}`);
    }

    const result = evaluateEligibility(parsed.data as EligibilityInput);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
      structuredContent: result,
    };
  });

  return server;
}

async function main() {
  const port = Number(process.env.PORT ?? 8787);
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', server: 'permitmonkey-ma-eligibility', version: '0.1.0' });
  });

  app.post('/mcp', async (req: Request, res: Response) => {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.listen(port, () => {
    process.stdout.write(
      JSON.stringify({
        severity: 'INFO',
        message: 'permitmonkey-mcp listening',
        port,
        endpoint: `/mcp`,
      }) + '\n',
    );
  });
}

main().catch((err) => {
  process.stdout.write(
    JSON.stringify({
      severity: 'ERROR',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    }) + '\n',
  );
  process.exit(1);
});
