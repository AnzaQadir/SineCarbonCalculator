import React, { useState, Fragment } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import type { RecommendationDetails } from '@/services/engagementService';
import { Checklist } from './Checklist';

type DetailsPanelProps = {
  item: {
    id: string;
    category: 'waste' | 'transport' | 'food' | 'home' | string;
    whyShown?: string;
    source?: string;
    learn?: { summary?: string | null } | null;
    recommendation: RecommendationDetails;
    previewImpact?: { rupees?: number | null; co2_kg?: number | null; label?: string | null } | null;
  };
  onLearnMore?: () => void;
};

const FALLBACK_STEPS = [
  'Pick one item to start with (bottle or tote).',
  "Place it near your keys/bag so you don't forget.",
  'Carry it today and use it once.',
  'Log it to track your streak.',
];

const groupTitleClass = 'text-xs font-semibold text-slate-500 uppercase tracking-wide';

function buildEffortLine(effort?: RecommendationDetails['effort']) {
  if (!effort) return null;

  const fragments: string[] = [];

  if (effort.avgMinutesToDo !== null && effort.avgMinutesToDo !== undefined) {
    fragments.push(`${effort.avgMinutesToDo} min`);
  }
  if (effort.steps !== null && effort.steps !== undefined) {
    fragments.push(`${effort.steps} ${effort.steps === 1 ? 'step' : 'steps'}`);
  }
  if (effort.requiresPurchase !== null && effort.requiresPurchase !== undefined) {
    fragments.push(effort.requiresPurchase ? 'may need purchase' : 'no-spend');
  }

  if (fragments.length === 0) return null;

  return `Effort: ${fragments.join(' • ')}`;
}

const ChipGroup: React.FC<{
  title: string;
  values?: (string | null | undefined)[] | null;
}> = ({ title, values }) => {
  const filtered = (values || []).filter(Boolean) as string[];

  if (filtered.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className={groupTitleClass}>{title}</p>
      <div className="flex flex-wrap gap-2">
        {filtered.map((value) => (
          <span
            key={value}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ item, onLearnMore }) => {
  const [howOpen, setHowOpen] = useState(false);

  const recommendation = item.recommendation || ({} as RecommendationDetails);
  const effortLine = buildEffortLine(recommendation.effort);
  const howSteps = (Array.isArray(recommendation.how) && recommendation.how.length > 0
    ? recommendation.how
    : FALLBACK_STEPS
  ).filter(Boolean);

  const showVerification =
    Array.isArray(recommendation.verify) && recommendation.verify.length > 0;
  const showRewards =
    recommendation.rewards && Object.keys(recommendation.rewards).length > 0;

  return (
    <section
      role="region"
      aria-label="Action details"
      className="space-y-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[inset_0_1px_0_theme(colors.slate.100)]"
    >
      <header className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-400">
          Action Details
        </p>
        {recommendation.story_snippet && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {recommendation.story_snippet}
          </p>
        )}
      </header>

      {/* Effort */}
      {effortLine && (
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {effortLine}
        </div>
      )}

      {/* How to do it */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <button
          type="button"
          aria-expanded={howOpen}
          aria-controls="how-to-do-it"
          className="flex w-full items-center justify-between rounded-t-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          onClick={() => setHowOpen((prev) => !prev)}
        >
          <span>How to do it</span>
          {howOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {howOpen && (
          <div id="how-to-do-it" className="border-t border-slate-200 bg-white px-5 py-5">
            <Checklist steps={howSteps} />
          </div>
        )}
      </div>

      {/* Did you know */}
      {item.learn?.summary && (
        <div className="rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-white to-white px-5 py-4 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.45)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-500">
            Did you know?
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {item.learn.summary}
          </p>
        </div>
      )}

      {/* Verification & Rewards */}
      {(showVerification || showRewards) && (
        <div className="space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
          {showVerification && (
            <div>
              <p className="font-semibold text-slate-700">Verification</p>
              <ul className="list-disc space-y-1 pl-5">
                {(recommendation.verify || []).filter(Boolean).map((item) => (
                  <li key={item} className="text-sm text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showRewards && (
            <p className="font-semibold text-slate-700">
              Rewards available
            </p>
          )}
        </div>
      )}

      {/* Empathy note */}
      {recommendation.empathy_note && (
        <p className="rounded-2xl bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
          {recommendation.empathy_note}
        </p>
      )}

      {/* CTA */}
      {recommendation.cta?.label && recommendation.cta?.href && (
        <a
          href={recommendation.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-brand-teal px-4 py-2 text-sm font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          {recommendation.cta.label}
        </a>
      )}

      {/* Source */}
      {/* Learn more */}
      {onLearnMore && (
        <button
          type="button"
          onClick={onLearnMore}
          className="inline-flex items-center rounded-lg border border-brand-teal px-4 py-2 text-sm font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          Learn more
        </button>
      )}
    </section>
  );
};


