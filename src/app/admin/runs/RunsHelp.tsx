"use client";

import { HelpPanel, KeyConcepts, InfoTooltip } from "@/components/help";
import { runsHelp } from "@/components/admin/help-content";

export function RunsHelpPanel() {
  return (
    <HelpPanel storageKey="admin-runs">
      <p>{runsHelp.overview}</p>
      <KeyConcepts concepts={runsHelp.keyConcepts} />
      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">
          <strong>⚠️ Red highlighted rows:</strong> {runsHelp.indicators.redHighlight}
        </p>
      </div>
    </HelpPanel>
  );
}

export function RunTableHeader({
  children,
  field,
  align = "left",
}: {
  children: React.ReactNode;
  field?: keyof typeof runsHelp.fields;
  align?: "left" | "right";
}) {
  const helpText = field ? runsHelp.fields[field] : undefined;
  const alignClass = align === "right" ? "text-right" : "text-left";
  
  return (
    <th className={`px-6 py-3 ${alignClass} text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider`}>
      <span className="inline-flex items-center">
        {children}
        {helpText && <InfoTooltip content={helpText} position="bottom" />}
      </span>
    </th>
  );
}
