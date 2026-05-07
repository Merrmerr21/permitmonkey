'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2Icon, CopyIcon, CheckIcon } from 'lucide-react';

interface ShareVerdictProps {
  token: string;
  verdict: 'likely_eligible' | 'needs_review' | 'not_eligible';
}

export function ShareVerdict({ token, verdict }: ShareVerdictProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/eligibility/v/${token}`
    : `/eligibility/v/${token}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fall through; user can select the
      // input value manually.
    }
  }

  const verdictLabel = {
    likely_eligible: 'an "Likely Eligible" verdict',
    needs_review: 'a "Needs Review" verdict',
    not_eligible: 'a "Not Eligible" verdict',
  }[verdict];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Share2Icon className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="heading-card text-foreground">Share this verdict</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Public, read-only snapshot of {verdictLabel}. Same citations,
              same verifier badges. No signup needed to view.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <input
                readOnly
                value={url}
                onClick={(e) => e.currentTarget.select()}
                className="flex-1 text-xs font-mono px-3 py-2 rounded-md border border-border bg-muted/40 text-muted-foreground"
              />
              <Button
                type="button"
                variant="outline"
                onClick={copy}
                className="shrink-0"
              >
                {copied ? <CheckIcon className="h-4 w-4 mr-1.5" /> : <CopyIcon className="h-4 w-4 mr-1.5" />}
                {copied ? 'Copied' : 'Copy link'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
