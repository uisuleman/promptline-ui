import * as React from "react";
import { BarChart3, Code2, FileSearch, Languages, Megaphone, PenLine, Scale, Telescope } from "lucide-react";
import { AgentGallery, type Agent } from "../../src";

const agents: Agent[] = [
  { id: "research", name: "Deep Research", description: "Reads dozens of sources and writes a cited report.", icon: <Telescope />, category: "Research", author: "Official", meta: "48k chats" },
  { id: "analyst", name: "Data Analyst", description: "Upload a CSV and ask questions in plain English.", icon: <BarChart3 />, category: "Research", author: "Official", meta: "31k chats" },
  { id: "writer", name: "Copywriter", description: "Landing pages, emails and ads in your brand voice.", icon: <PenLine />, category: "Writing", author: "by Acme", meta: "22k chats" },
  { id: "translator", name: "Translator", description: "Natural translations that keep tone and formatting.", icon: <Languages />, category: "Writing", author: "Official", meta: "19k chats" },
  { id: "code", name: "Code Reviewer", description: "Finds bugs and explains fixes in your pull requests.", icon: <Code2 />, category: "Engineering", author: "by Devtools", meta: "15k chats" },
  { id: "legal", name: "Contract Checker", description: "Flags risky clauses and summarizes obligations.", icon: <Scale />, category: "Business", author: "by LexAI", meta: "8k chats" },
  { id: "launch", name: "Launch Planner", description: "Turns a product idea into a week-by-week launch plan.", icon: <Megaphone />, category: "Business", author: "by Acme", meta: "6k chats" },
  { id: "papers", name: "Paper Explainer", description: "Explains research papers at the level you choose.", icon: <FileSearch />, category: "Research", author: "Community", meta: "5k chats" },
];

export function Default() {
  const [v, setV] = React.useState("research");
  return <AgentGallery className="max-w-4xl" agents={agents} value={v} onSelect={(a) => setV(a.id)} onCreate={() => {}} />;
}
