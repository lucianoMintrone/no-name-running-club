import React from "react";
import { cn } from "@/lib/design-utils";

type BadgeTone = "neutral" | "success" | "danger" | "nnrc";

type BadgeProps = React.PropsWithChildren<{
  tone?: BadgeTone;
  className?: string;
}>;

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  const toneClass =
    tone === "success"
      ? "bg-green-50 text-green-800 ring-1 ring-green-200"
      : tone === "danger"
        ? "bg-red-50 text-red-800 ring-1 ring-red-200"
        : tone === "nnrc"
          ? "bg-nnrc-lavender-light text-nnrc-purple-dark ring-1 ring-nnrc-lavender"
          : "bg-gray-50 text-gray-700 ring-1 ring-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
        toneClass,
        className
      )}
    >
      {children}
    </span>
  );
}

