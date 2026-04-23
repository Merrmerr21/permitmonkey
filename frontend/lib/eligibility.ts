/**
 * MA ADU Eligibility Checker — server-side logic.
 *
 * Implements `.claude/skills/adu-eligibility-checker/SKILL.md` as a deterministic
 * fast path. No LLM call — runs under 100ms. For uncovered cities the result is
 * flagged "state law only" so the UI can surface the caveat.
 *
 * State floor: Ch 150 of the Acts of 2024 §§7-8, amending MGL Ch 40A §§1A, 3,
 * implemented by 760 CMR 71.00 (effective 2025-01-31).
 */

export type AduType = 'detached' | 'attached' | 'conversion' | 'undecided';

export interface EligibilityInput {
  address: string;
  lot_size_sqft: number;
  primary_dwelling_sqft: number;
  zoning_district?: string;
  proposed_adu_type?: AduType;
  proposed_adu_sqft?: number;
  within_half_mile_transit?: boolean;
  in_historic_district?: boolean;
}

export type Verdict = 'likely_eligible' | 'needs_review' | 'not_eligible';

export interface EligibilityOutput {
  verdict: Verdict;
  verdict_summary: string;
  max_adu_sqft: number;
  parking_required: number;
  parking_exemption_reason: string | null;
  city: string | null;
  city_covered: boolean;
  city_gotchas: string[];
  overlay_flags: {
    historic: 'yes' | 'possible' | 'unlikely' | 'not_checked';
    wetlands: 'not_checked';
    floodplain: 'not_checked';
    specialized_code: 'yes' | 'no' | 'unknown';
  };
  next_steps: string[];
  citations: Array<{ authority: string; source_url: string; relevance: string }>;
  upgrade_cta: string;
  disclaimer: string;
}

const STATE_MAX_SQFT = 900;
const STATE_MAX_PCT = 0.5;

interface CityProfile {
  name: string;
  gotchas: string[];
  specialized_code: boolean;
  has_historic_overlay: boolean;
}

const CITY_PROFILES: Record<string, CityProfile> = {
  boston: {
    name: 'Boston',
    gotchas: [
      'Boston zoning is article-based; confirm your neighborhood article governs ADU use before relying on state preemption.',
      'Specialized Energy Code adopted — heat pump or equivalent required; expect HERS rating.',
      'Many Boston parcels sit within a historic district or protected landmark area — design review adds 60-120 days.',
    ],
    specialized_code: true,
    has_historic_overlay: true,
  },
  cambridge: {
    name: 'Cambridge',
    gotchas: [
      'Lot coverage caps bind before setbacks in Residence A/B/C districts — confirm headroom for primary + ADU combined footprint.',
      'Specialized Energy Code adopted — heat pump required.',
      'Old Cambridge, Mid Cambridge, and Harvard Square districts trigger Historical Commission review.',
    ],
    specialized_code: true,
    has_historic_overlay: true,
  },
  somerville: {
    name: 'Somerville',
    gotchas: [
      'Somerville Zoning Ordinance (SZO) uses a form-based code — FAR and lot coverage often bind tighter than state floor.',
      'Specialized Energy Code adopted.',
      'Historic districts cover multiple neighborhoods (e.g., Old West Somerville); verify parcel overlay before design.',
    ],
    specialized_code: true,
    has_historic_overlay: true,
  },
  newton: {
    name: 'Newton',
    gotchas: [
      'Newton enforces substantial minimum lot sizes in SR districts — state ADU use preemption applies, but dimensional form still binds.',
      'Specialized Energy Code adopted.',
      'Multiple local historic districts (Newton Centre, Chestnut Hill) trigger HDC review.',
    ],
    specialized_code: true,
    has_historic_overlay: true,
  },
  brookline: {
    name: 'Brookline',
    gotchas: [
      'Brookline Zoning Bylaw FAR limits are tight in S-7/S-10/S-15 districts — verify primary + ADU FAR headroom.',
      'Specialized Energy Code adopted.',
      'Historic districts cover significant portions of town; Preservation Commission review likely.',
    ],
    specialized_code: true,
    has_historic_overlay: true,
  },
};

function parseCityFromAddress(address: string): string | null {
  const normalized = address.toLowerCase();
  for (const key of Object.keys(CITY_PROFILES)) {
    if (normalized.includes(key)) return key;
  }
  const maMatch = normalized.match(/,\s*([a-z\s]+?)\s*,?\s*ma\b/);
  if (maMatch) return maMatch[1].trim();
  return null;
}

export function evaluateEligibility(input: EligibilityInput): EligibilityOutput {
  const cityKey = parseCityFromAddress(input.address);
  const profile = cityKey ? CITY_PROFILES[cityKey] : undefined;
  const cityCovered = !!profile;
  const cityName = profile?.name ?? cityKey ?? null;

  const max_adu_sqft = Math.floor(
    Math.min(STATE_MAX_SQFT, input.primary_dwelling_sqft * STATE_MAX_PCT),
  );

  const parking_required = input.within_half_mile_transit ? 0 : 1;
  const parking_exemption_reason = input.within_half_mile_transit
    ? 'Within 0.5 mi of commuter rail, subway, ferry, or bus station — 760 CMR 71.00 preempts any parking requirement.'
    : null;

  const reasons: string[] = [];
  let verdict: Verdict = 'likely_eligible';

  if (input.primary_dwelling_sqft < 400) {
    verdict = 'not_eligible';
    reasons.push('Primary dwelling below typical habitable threshold — state floor assumes an existing single-family primary dwelling.');
  }
  if (input.lot_size_sqft < 3000) {
    verdict = verdict === 'not_eligible' ? 'not_eligible' : 'needs_review';
    reasons.push('Lot size is small; local dimensional bylaws may bind even after state use preemption.');
  }
  if (input.proposed_adu_sqft && input.proposed_adu_sqft > max_adu_sqft) {
    verdict = 'not_eligible';
    reasons.push(`Proposed ADU (${input.proposed_adu_sqft} sqft) exceeds state-protected max of ${max_adu_sqft} sqft.`);
  }
  if (input.in_historic_district && profile?.has_historic_overlay) {
    verdict = verdict === 'not_eligible' ? 'not_eligible' : 'needs_review';
    reasons.push('Historic district membership triggers design review — not a veto but adds 60-120 days.');
  }
  if (!cityCovered && verdict === 'likely_eligible') {
    verdict = 'needs_review';
    reasons.push(`${cityName ?? 'Your city'} is not yet in our fully-researched list; results reflect state law only.`);
  }

  const city_gotchas = profile
    ? profile.gotchas
    : ['We have not fully researched this city yet — verify local dimensional bylaws before committing.'];

  const next_steps = [
    'Confirm zoning district and dimensional rules with city planning office.',
    'Verify lot coverage / FAR headroom for primary + ADU combined footprint.',
    profile?.specialized_code
      ? 'Plan for heat pump or equivalent and a HERS rating (Specialized Energy Code applies).'
      : 'Confirm whether the municipality has adopted the Stretch or Specialized Energy Code.',
  ];

  const citations = [
    {
      authority: 'MGL Ch 40A § 3 as amended by St. 2024, c. 150, § 8',
      source_url: 'https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3',
      relevance: 'State by-right protection for protected-use accessory dwelling units',
    },
    {
      authority: '760 CMR 71.00',
      source_url: 'https://www.mass.gov/regulations/760-CMR-71-protected-use-accessory-dwelling-units',
      relevance: 'EOHLC implementing regulation — size cap, parking cap, owner-occupancy preemption',
    },
  ];

  const verdict_summary =
    verdict === 'likely_eligible'
      ? `Your lot looks eligible for a protected-use ADU up to ${max_adu_sqft} sqft under state law.`
      : verdict === 'needs_review'
        ? `Your lot passes the state floor but ${reasons[0] ?? 'local bylaws need verification'}.`
        : `Your lot does not clear the state floor: ${reasons[0] ?? 'see details'}`;

  return {
    verdict,
    verdict_summary,
    max_adu_sqft,
    parking_required,
    parking_exemption_reason,
    city: cityName,
    city_covered: cityCovered,
    city_gotchas,
    overlay_flags: {
      historic: input.in_historic_district
        ? 'yes'
        : profile?.has_historic_overlay
          ? 'possible'
          : 'not_checked',
      wetlands: 'not_checked',
      floodplain: 'not_checked',
      specialized_code: profile ? (profile.specialized_code ? 'yes' : 'no') : 'unknown',
    },
    next_steps,
    citations,
    upgrade_cta:
      "Ready to submit? PermitMonkey's corrections-interpretation service gets your permit through plan check faster.",
    disclaimer:
      'This is a non-binding preliminary analysis based on state law and city-level profiles. Always verify with your city building department before committing.',
  };
}
