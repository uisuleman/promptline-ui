import * as React from "react";
import { ArrowRight, Download, Plus, Sparkles, Trash2, Settings } from "lucide-react";
import { Button, ButtonGroup, ButtonLink } from "../../src";

export function Default() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Continue</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="link">Learn more</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button><Sparkles />Generate</Button>
      <Button variant="outline"><Download />Export</Button>
      <Button variant="secondary">Next<ArrowRight /></Button>
      <Button variant="outline" size="icon" aria-label="Settings"><Settings /></Button>
      <Button variant="ghost" size="icon-sm" aria-label="Delete"><Trash2 /></Button>
    </div>
  );
}

export function Loading() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
      Save changes
    </Button>
  );
}

export function Group() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ButtonGroup>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button><Plus />New chat</Button>
        <Button size="icon" aria-label="More options" className="border-l border-accent-fg/20">▾</Button>
      </ButtonGroup>
      <ButtonLink href="#/docs/installation" variant="outline">Link as button</ButtonLink>
    </div>
  );
}
