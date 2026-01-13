"use client";

import { HelpPanel, KeyConcepts, InfoTooltip } from "@/components/help";
import { analyticsHelp } from "@/components/admin/help-content";

export function AnalyticsHelpPanel() {
  return (
    <HelpPanel storageKey="admin-analytics">
      <p>{analyticsHelp.overview}</p>
      <KeyConcepts concepts={analyticsHelp.keyConcepts} />
    </HelpPanel>
  );
}

interface StatCardWithHelpProps {
  title: string;
  value: number;
  highlight?: boolean;
  helpText?: string;
}

export function AnalyticsStatCard({
  title,
  value,
  highlight = false,
  helpText,
}: StatCardWithHelpProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-md ${
        highlight
          ? "bg-nnrc-purple-light border-nnrc-purple"
          : "bg-white border-nnrc-lavender"
      }`}
    >
      <p className={`text-xs ${highlight ? "text-white/80" : "text-gray-500"} inline-flex items-center`}>
        {title}
        {helpText && <InfoTooltip content={helpText} />}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${
          highlight ? "text-white" : "text-nnrc-purple-dark"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface EngagementCardProps {
  label: string;
  value: number;
  helpText?: string;
}

export function EngagementCard({ label, value, helpText }: EngagementCardProps) {
  return (
    <div className="rounded-lg bg-nnrc-lavender-light p-4">
      <p className="text-sm text-gray-500 inline-flex items-center">
        {label}
        {helpText && <InfoTooltip content={helpText} />}
      </p>
      <p className="text-2xl font-bold text-nnrc-purple-dark">{value}</p>
    </div>
  );
}

interface ChallengeStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  helpText?: string;
}

export function ChallengeStatCard({
  label,
  value,
  subtext,
  helpText,
}: ChallengeStatCardProps) {
  return (
    <div className="rounded-lg bg-nnrc-lavender-light p-4">
      <p className="text-sm text-gray-500 inline-flex items-center">
        {label}
        {helpText && <InfoTooltip content={helpText} />}
      </p>
      <p className="text-2xl font-bold text-nnrc-purple-dark">{value}</p>
      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
    </div>
  );
}

export function ChartTitleWithHelp({
  children,
  helpText,
}: {
  children: React.ReactNode;
  helpText?: string;
}) {
  return (
    <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark inline-flex items-center">
      {children}
      {helpText && <InfoTooltip content={helpText} />}
    </h2>
  );
}

export { analyticsHelp };
