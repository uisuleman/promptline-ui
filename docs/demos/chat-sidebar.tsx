import * as React from "react";
import { ChatSidebar, UsageMeter, ConversationSkeleton } from "../../src";

const chats = [
  { id: "p1", title: "Brand voice guide", group: "", pinned: true },
  { id: "1", title: "Landing page copy for Nova", group: "Today" },
  { id: "2", title: "Debug Stripe webhook", group: "Today" },
  { id: "3", title: "Pricing page teardown", group: "Yesterday" },
  { id: "4", title: "Onboarding email sequence", group: "Previous 7 days" },
  { id: "5", title: "SQL for weekly retention", group: "Previous 7 days" },
  { id: "6", title: "Investor update — September", group: "Previous 30 days" },
];

export function Default() {
  const [active, setActive] = React.useState("1");
  return (
    <div className="flex h-[480px] w-full overflow-hidden rounded-lg border border-border">
      <ChatSidebar
        chats={chats}
        activeId={active}
        onSelect={setActive}
        onNew={() => setActive("")}
        onMore={() => {}}
        header="Acme AI"
        footer={<UsageMeter variant="inline" used={41} limit={50} label="Messages today" resetText="Resets in 6h" onUpgrade={() => {}} />}
      />
      <div className="hidden flex-1 p-8 sm:block"><ConversationSkeleton /></div>
    </div>
  );
}
