import * as React from "react";
import { Home } from "lucide-react";
import { Breadcrumb } from "../../src";

export function Default() {
  return <Breadcrumb items={[{ label: "Acme Design", href: "#", icon: <Home /> }, { label: "Projects", href: "#" }, { label: "Onboarding revamp" }]} />;
}

export function Collapsed() {
  return (
    <Breadcrumb
      maxItems={3}
      items={[{ label: "Acme", href: "#" }, { label: "Workspaces", href: "#" }, { label: "Design", href: "#" }, { label: "Assistants", href: "#" }, { label: "Support bot" }]}
    />
  );
}
