import * as React from "react";
import { FilePlus, Settings, Moon, MessageSquarePlus, Search } from "lucide-react";
import { CommandBar, Button, Kbd, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="w-64 justify-start text-fg-muted">
        <Search />Search or ask AI…<span className="ml-auto flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      </Button>
      <CommandBar
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        onAsk={(q) => toast({ title: "Asking AI", description: q })}
        onCommand={(id) => toast({ title: `Ran: ${id}` })}
        commands={[
          { id: "new-chat", label: "New chat", group: "Actions", icon: <MessageSquarePlus />, shortcut: ["⌘", "N"] },
          { id: "new-doc", label: "New document", group: "Actions", icon: <FilePlus /> },
          { id: "theme", label: "Toggle dark mode", group: "Preferences", icon: <Moon />, shortcut: ["⌘", "D"] },
          { id: "settings", label: "Open settings", group: "Preferences", icon: <Settings />, shortcut: ["⌘", ","] },
        ]}
      />
    </>
  );
}
