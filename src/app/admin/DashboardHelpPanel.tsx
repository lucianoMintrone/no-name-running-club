"use client";

import { HelpPanel, KeyConcepts } from "@/components/help";
import { dashboardHelp } from "@/components/admin/help-content";

export function DashboardHelpPanel() {
  return (
    <HelpPanel storageKey="admin-dashboard">
      <p>{dashboardHelp.overview}</p>
      <KeyConcepts concepts={dashboardHelp.keyConcepts} />
    </HelpPanel>
  );
}
