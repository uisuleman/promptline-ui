import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Field
 * Label + control + description + error, wired together for screen readers.
 * <Field label="Email" description="We'll never share it" error={err}>{(p) => <Input {...p} />}</Field>
 * The render prop receives id, aria-describedby and aria-invalid for the control.
 */
export interface FieldControlProps { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }

export interface FieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Label beside the control instead of above (checkbox/switch rows) */
  orientation?: "vertical" | "horizontal";
  children: (props: FieldControlProps) => React.ReactNode;
  className?: string;
}

export function Field({ label, description, error, required, optional, orientation = "vertical", children, className }: FieldProps) {
  const id = React.useId();
  const descId = description ? `${id}-d` : undefined;
  const errId = error ? `${id}-e` : undefined;
  const control = children({ id, "aria-describedby": [errId, descId].filter(Boolean).join(" ") || undefined, "aria-invalid": error ? true : undefined });
  const text = (
    <>
      {label && <Label htmlFor={id} required={required} optional={optional}>{label}</Label>}
      {description && <p id={descId} className="text-xs text-fg-subtle">{description}</p>}
    </>
  );
  if (orientation === "horizontal")
    return (
      <div className={cn("flex items-start justify-between gap-4", className)}>
        <div className="space-y-0.5">{text}{error && <FieldError id={errId}>{error}</FieldError>}</div>
        <div className="pt-0.5">{control}</div>
      </div>
    );
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label htmlFor={id} required={required} optional={optional}>{label}</Label>}
      {control}
      {error ? <FieldError id={errId}>{error}</FieldError> : description && <p id={descId} className="text-xs text-fg-subtle">{description}</p>}
    </div>
  );
}

export function Label({ className, required, optional, children, ...p }: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean; optional?: boolean }) {
  return (
    <label className={cn("text-sm font-medium text-fg", className)} {...p}>
      {children}
      {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
      {optional && <span className="ml-1 font-normal text-fg-subtle">(optional)</span>}
    </label>
  );
}

export function FieldError({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p role="alert" className={cn("text-xs text-danger", className)} {...p} />;
}
