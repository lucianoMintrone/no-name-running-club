import React from "react";
import { cn } from "@/lib/design-utils";

type CardProps = React.PropsWithChildren<{
  className?: string;
}>;

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-xl bg-white shadow-card", className)}>
      {children}
    </div>
  );
}

