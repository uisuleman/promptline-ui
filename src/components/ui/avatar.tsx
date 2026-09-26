import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Avatar & AvatarStack
 * Image with initials fallback (also used when the image fails). Optional presence dot.
 * AvatarStack overlaps avatars and collapses the rest into "+N".
 */
export interface AvatarProps {
  src?: string;
  /** Initials or an icon */
  fallback: React.ReactNode;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg";
  status?: "online" | "busy" | "offline";
  shape?: "circle" | "square";
  className?: string;
}

const sizes = { xs: "size-6 text-2xs", sm: "size-7 text-xs", md: "size-8 text-xs", lg: "size-10 text-sm" };

export function Avatar({ src, fallback, alt = "", size = "md", status, shape = "circle", className }: AvatarProps) {
  const [err, setErr] = React.useState(false);
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span className={cn("inline-grid place-items-center overflow-hidden bg-surface-2 font-medium text-fg-muted ring-1 ring-border", sizes[size], shape === "circle" ? "rounded-full" : "rounded-md")}>
        {src && !err ? <img src={src} alt={alt} onError={() => setErr(true)} className="size-full object-cover" /> : fallback}
      </span>
      {status && (
        <span aria-label={status} className={cn("absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-bg", status === "online" ? "bg-success" : status === "busy" ? "bg-warning" : "bg-fg-subtle")} />
      )}
    </span>
  );
}

export function AvatarStack({ avatars, max = 4, size = "md", className }: { avatars: Omit<AvatarProps, "size">[]; max?: number; size?: AvatarProps["size"]; className?: string }) {
  const shown = avatars.slice(0, max);
  const rest = avatars.length - shown.length;
  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {shown.map((a, i) => <Avatar key={i} {...a} size={size} className="rounded-full ring-2 ring-bg" />)}
      {rest > 0 && <span className={cn("relative inline-grid place-items-center rounded-full bg-surface-2 font-medium text-fg-muted ring-2 ring-bg", sizes[size ?? "md"])}>+{rest}</span>}
    </div>
  );
}
