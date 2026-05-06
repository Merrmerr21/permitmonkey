/**
 * In-process Prometheus-format metrics store.
 *
 * Counters and histograms accumulate during the Cloud Run instance's lifetime
 * and reset on cold start. This is the substrate the master playbook §80
 * cost-monitoring routine reads from; richer aggregation lives in Supabase
 * (see migration 0004 once cost telemetry table lands).
 */

interface Counter {
  type: 'counter';
  help: string;
  values: Map<string, number>; // labelKey → count
}

interface Histogram {
  type: 'histogram';
  help: string;
  buckets: number[]; // upper bounds, ascending
  // labelKey → { bucketCounts[], sum, count }
  values: Map<string, { bucketCounts: number[]; sum: number; count: number }>;
}

type Metric = Counter | Histogram;

class MetricsStore {
  private metrics = new Map<string, Metric>();

  counter(name: string, help: string): {
    inc: (labels?: Record<string, string>, value?: number) => void;
  } {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, { type: 'counter', help, values: new Map() });
    }
    const m = this.metrics.get(name) as Counter;
    return {
      inc: (labels = {}, value = 1) => {
        const k = labelKey(labels);
        m.values.set(k, (m.values.get(k) ?? 0) + value);
      },
    };
  }

  histogram(
    name: string,
    help: string,
    buckets: number[],
  ): {
    observe: (value: number, labels?: Record<string, string>) => void;
  } {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, { type: 'histogram', help, buckets, values: new Map() });
    }
    const m = this.metrics.get(name) as Histogram;
    return {
      observe: (value, labels = {}) => {
        const k = labelKey(labels);
        let entry = m.values.get(k);
        if (!entry) {
          entry = { bucketCounts: new Array(m.buckets.length).fill(0), sum: 0, count: 0 };
          m.values.set(k, entry);
        }
        entry.sum += value;
        entry.count += 1;
        for (let i = 0; i < m.buckets.length; i++) {
          if (value <= m.buckets[i]) entry.bucketCounts[i] += 1;
        }
      },
    };
  }

  render(): string {
    const lines: string[] = [];
    for (const [name, metric] of this.metrics) {
      lines.push(`# HELP ${name} ${metric.help}`);
      lines.push(`# TYPE ${name} ${metric.type}`);
      if (metric.type === 'counter') {
        for (const [labelStr, val] of metric.values) {
          lines.push(`${name}${labelStr} ${val}`);
        }
      } else {
        for (const [labelStr, entry] of metric.values) {
          for (let i = 0; i < metric.buckets.length; i++) {
            const le = metric.buckets[i];
            const bucketLabels = mergeLabels(labelStr, `le="${le}"`);
            lines.push(`${name}_bucket${bucketLabels} ${entry.bucketCounts[i]}`);
          }
          const infBucket = mergeLabels(labelStr, `le="+Inf"`);
          lines.push(`${name}_bucket${infBucket} ${entry.count}`);
          lines.push(`${name}_sum${labelStr} ${entry.sum}`);
          lines.push(`${name}_count${labelStr} ${entry.count}`);
        }
      }
    }
    return lines.join('\n') + '\n';
  }
}

function labelKey(labels: Record<string, string>): string {
  const keys = Object.keys(labels).sort();
  if (keys.length === 0) return '';
  return '{' + keys.map((k) => `${k}="${escape(labels[k])}"`).join(',') + '}';
}

function mergeLabels(existing: string, additional: string): string {
  if (!existing || existing === '') return `{${additional}}`;
  // existing is `{k="v"}`. Strip braces, append, rewrap.
  const inner = existing.slice(1, -1);
  return `{${inner},${additional}}`;
}

function escape(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

export const metrics = new MetricsStore();

// Pre-register the metrics we want to be present even before any request lands,
// so /metrics scrapes return a consistent shape from the first poll.
export const requestCounter = metrics.counter(
  'permitmonkey_http_requests_total',
  'Total HTTP requests by route and status',
);

export const requestLatency = metrics.histogram(
  'permitmonkey_http_request_duration_ms',
  'HTTP request latency in milliseconds',
  [10, 50, 100, 500, 1000, 5000, 30000, 120000, 600000],
);

export const agentRunCounter = metrics.counter(
  'permitmonkey_agent_runs_total',
  'Total agent runs by flow_type and outcome',
);

export const agentRunDuration = metrics.histogram(
  'permitmonkey_agent_run_duration_ms',
  'Agent run wall-clock duration in milliseconds',
  [10000, 60000, 300000, 600000, 1800000, 3600000],
);

export const agentTokenCounter = metrics.counter(
  'permitmonkey_agent_tokens_total',
  'Total tokens consumed by agent runs (input + output + cache_read + cache_write)',
);
