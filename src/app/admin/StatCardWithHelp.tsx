"use client";

import { InfoTooltip } from "@/components/help";

interface StatCardWithHelpProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  helpText?: string;
}

export function StatCardWithHelp({
  title,
  value,
  icon,
  helpText,
}: StatCardWithHelpProps) {
  return (
    <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 inline-flex items-center">
            {title}
            {helpText && <InfoTooltip content={helpText} />}
          </p>
          <p className="mt-1 text-3xl font-bold text-nnrc-purple-dark">{value}</p>
        </div>
        <div className="text-nnrc-purple">{icon}</div>
      </div>
    </div>
  );
}
