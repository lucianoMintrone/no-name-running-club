"use client";

import { HelpPanel, KeyConcepts, InfoTooltip } from "@/components/help";
import { challengesHelp } from "@/components/admin/help-content";

export function ChallengesHelpPanel() {
  return (
    <HelpPanel storageKey="admin-challenges">
      <p>{challengesHelp.overview}</p>
      <KeyConcepts concepts={challengesHelp.keyConcepts} />
    </HelpPanel>
  );
}

export function ChallengeTableHeader({
  children,
  field,
}: {
  children: React.ReactNode;
  field?: keyof typeof challengesHelp.fields;
}) {
  const helpText = field ? challengesHelp.fields[field] : undefined;
  
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
      <span className="inline-flex items-center">
        {children}
        {helpText && <InfoTooltip content={helpText} position="bottom" />}
      </span>
    </th>
  );
}
