import * as React from "react";
import { Search, BookOpen, Calculator, Lightbulb } from "lucide-react";
import { ChainOfThought } from "../../src";

export function Default() {
  return (
    <ChainOfThought
      className="w-full max-w-2xl"
      steps={[
        { label: "Searched for 2026 EV sales in Europe", icon: Search, results: ["https://www.acea.auto", "https://www.iea.org", "https://www.reuters.com"] },
        { label: "Read 3 reports", icon: BookOpen, description: "Focused on monthly registrations and market share." },
        { label: "Calculated year-over-year growth", icon: Calculator, status: "active" },
        { label: "Draft the answer", icon: Lightbulb, status: "pending" },
      ]}
    />
  );
}
