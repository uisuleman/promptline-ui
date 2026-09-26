import * as React from "react";
import { Search, Mail, Link2, Copy, Check } from "lucide-react";
import { Input, InputGroup, Button, Kbd, useCopy } from "../../src";

export function Default() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Project name" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Invalid" aria-invalid defaultValue="not-an-email" />
      <Input type="file" />
    </div>
  );
}

export function Sizes() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input size="sm" placeholder="Small · 32px" />
      <Input size="md" placeholder="Medium · 36px" />
      <Input size="lg" placeholder="Large · 40px" />
    </div>
  );
}

export function WithAddons() {
  const { copied, copy } = useCopy();
  return (
    <div className="grid w-full max-w-sm gap-3">
      <InputGroup leading={<Search />} trailing={<Kbd>/</Kbd>} placeholder="Search chats" />
      <InputGroup leading={<Mail />} type="email" placeholder="you@company.com" />
      <InputGroup leading={<span className="text-fg-subtle">https://</span>} placeholder="acme.com" />
      <InputGroup
        leading={<Link2 />}
        readOnly
        value="https://acme.ai/share/8f2a91"
        trailing={<Button size="icon-xs" variant="ghost" aria-label="Copy link" onClick={() => copy("https://acme.ai/share/8f2a91")}>{copied ? <Check /> : <Copy />}</Button>}
      />
    </div>
  );
}
