import * as React from "react";
import { FileText, HardDrive, Mail, MessageSquare, GitBranch, Calendar } from "lucide-react";
import { ConnectorCard, ConnectorGrid, type ConnectorStatus } from "../../src";

export function Default() {
  const [st, setSt] = React.useState<Record<string, ConnectorStatus>>({ drive: "connected", chat: "disconnected", docs: "syncing", mail: "error", code: "disconnected", cal: "disconnected" });
  const connect = (id: string) => { setSt((s) => ({ ...s, [id]: "connecting" })); setTimeout(() => setSt((s) => ({ ...s, [id]: "connected" })), 1400); };
  const off = (id: string) => setSt((s) => ({ ...s, [id]: "disconnected" }));
  return (
    <ConnectorGrid className="max-w-3xl">
      <ConnectorCard name="Drive" icon={<HardDrive />} description="Search and cite files from your shared drives." status={st.drive} account="maya@acme.com" detail="Synced 5 min ago" onConnect={() => connect("drive")} onDisconnect={() => off("drive")} onSync={() => {}} onSettings={() => {}} />
      <ConnectorCard name="Team chat" icon={<MessageSquare />} description="Answer from channel history and threads." status={st.chat} onConnect={() => connect("chat")} onDisconnect={() => off("chat")} />
      <ConnectorCard name="Wiki" icon={<FileText />} description="Use pages and databases as context." status={st.docs} detail="Syncing 128 of 412 pages" onConnect={() => connect("docs")} onDisconnect={() => off("docs")} />
      <ConnectorCard name="Mail" icon={<Mail />} description="Draft replies with thread context." status={st.mail} error="Access expired — sign in again" onConnect={() => connect("mail")} />
      <ConnectorCard name="Code" icon={<GitBranch />} description="Read repositories, issues and pull requests." status={st.code} onConnect={() => connect("code")} onDisconnect={() => off("code")} />
      <ConnectorCard name="Calendar" icon={<Calendar />} description="Find time and prepare meeting briefs." status={st.cal} onConnect={() => connect("cal")} onDisconnect={() => off("cal")} />
    </ConnectorGrid>
  );
}
