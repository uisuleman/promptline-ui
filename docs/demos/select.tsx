import * as React from "react";
import { Globe, Lock, Users } from "lucide-react";
import { Select } from "../../src";

export function Default() {
  const [lang, setLang] = React.useState("en");
  return (
    <div className="w-64">
      <Select
        aria-label="Response language"
        value={lang}
        onValueChange={setLang}
        options={[
          { value: "auto", label: "Auto-detect" },
          { value: "en", label: "English" },
          { value: "es", label: "Español" },
          { value: "fr", label: "Français" },
          { value: "de", label: "Deutsch" },
          { value: "ur", label: "اردو" },
          { value: "ja", label: "日本語" },
        ]}
      />
    </div>
  );
}

export function RichOptions() {
  return (
    <div className="w-72">
      <Select
        aria-label="Visibility"
        defaultValue="team"
        options={[
          { value: "private", label: "Private", description: "Only you can see this chat", icon: <Lock /> },
          { value: "team", label: "Workspace", description: "Everyone in Acme Design", icon: <Users /> },
          { value: "public", label: "Public link", description: "Anyone with the link", icon: <Globe /> },
        ]}
      />
    </div>
  );
}

export function Grouped() {
  return (
    <div className="w-64">
      <Select
        aria-label="Model"
        placeholder="Choose a model"
        options={[
          { value: "swift", label: "Swift", group: "Acme" },
          { value: "swift-pro", label: "Swift Pro", group: "Acme" },
          { value: "orbit", label: "Orbit Large", group: "Orbit Labs" },
          { value: "orbit-mini", label: "Orbit Mini", group: "Orbit Labs" },
          { value: "legacy", label: "Legacy 1.0", group: "Deprecated", disabled: true },
        ]}
      />
    </div>
  );
}
