"use client";

import { HelpPanel, KeyConcepts, InfoTooltip } from "@/components/help";
import { usersHelp } from "@/components/admin/help-content";

export function UsersHelpPanel() {
  return (
    <HelpPanel storageKey="admin-users">
      <p>{usersHelp.overview}</p>
      <KeyConcepts concepts={usersHelp.keyConcepts} />
    </HelpPanel>
  );
}

export function UserTableHeader({
  children,
  field,
  align = "left",
}: {
  children: React.ReactNode;
  field?: keyof typeof usersHelp.fields;
  align?: "left" | "right";
}) {
  const helpText = field ? usersHelp.fields[field] : undefined;
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
