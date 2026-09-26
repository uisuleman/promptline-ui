import * as React from "react";
import { MoreHorizontal, Pencil, Copy, Pin, Share, Trash2, Archive, Download, LogOut, User, CreditCard, Settings } from "lucide-react";
import { DropdownMenu, Button, Avatar, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  return (
    <DropdownMenu
      trigger={<Button variant="outline" size="icon" aria-label="Chat options"><MoreHorizontal /></Button>}
      items={[
        { label: "Rename", icon: <Pencil />, shortcut: ["R"], onSelect: () => toast({ title: "Rename" }) },
        { label: "Duplicate", icon: <Copy />, onSelect: () => toast({ title: "Duplicated" }) },
        { label: "Pin to top", icon: <Pin />, onSelect: () => toast({ title: "Pinned" }) },
        { type: "sub", label: "Share", icon: <Share />, items: [
          { label: "Copy link", onSelect: () => toast({ title: "Link copied", tone: "success" }) },
          { label: "Export as Markdown", icon: <Download />, onSelect: () => {} },
        ] },
        { type: "separator" },
        { label: "Archive", icon: <Archive />, onSelect: () => {} },
        { label: "Delete", icon: <Trash2 />, danger: true, shortcut: ["⌘", "⌫"], onSelect: () => toast({ title: "Deleted", tone: "error" }) },
      ]}
    />
  );
}

export function CheckboxAndRadio() {
  const [showTokens, setShowTokens] = React.useState(true);
  const [showCost, setShowCost] = React.useState(false);
  const [density, setDensity] = React.useState("comfortable");
  return (
    <DropdownMenu
      trigger={<Button variant="outline">View options</Button>}
      items={[
        { type: "label", label: "Show in messages" },
        { type: "checkbox", label: "Token count", checked: showTokens, onCheckedChange: setShowTokens },
        { type: "checkbox", label: "Cost", checked: showCost, onCheckedChange: setShowCost },
        { type: "separator" },
        { type: "label", label: "Density" },
        ...["compact", "comfortable", "spacious"].map((d) => ({ type: "radio" as const, group: "density", value: d, label: d[0].toUpperCase() + d.slice(1), checked: density === d, onSelect: () => setDensity(d) })),
      ]}
    />
  );
}

export function AccountMenu() {
  return (
    <DropdownMenu
      align="end"
      trigger={<button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20" aria-label="Account"><Avatar fallback="SK" status="online" /></button>}
      items={[
        { type: "label", label: "sam@acme.com" },
        { label: "Profile", icon: <User /> },
        { label: "Billing", icon: <CreditCard />, description: "Pro · renews Oct 1" },
        { label: "Settings", icon: <Settings />, shortcut: ["⌘", ","] },
        { type: "separator" },
        { label: "Log out", icon: <LogOut /> },
      ]}
    />
  );
}
