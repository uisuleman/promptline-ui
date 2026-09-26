import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Spinner
 * Inherits text colour and size via className (size-3 … size-6). Use for short, unknown waits;
 * prefer Skeleton when the layout is known and Loader for waiting on a model.
 */
export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role={label ? "status" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn("inline-block size-4 shrink-0 rounded-full border-[1.5px] border-current border-r-transparent", className)} style={{ animation: "pl-spin .7s linear infinite" }} />
  );
}
