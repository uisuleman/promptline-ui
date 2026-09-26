import * as React from "react";
import { AnnouncementPill, AnnouncementBar, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  return <AnnouncementPill onClick={() => toast({ title: "Open the Nova launch post" })}>Nova is here — our most capable model</AnnouncementPill>;
}

export function Bar() {
  return (
    <div className="w-full space-y-3">
      <AnnouncementBar action={{ label: "Try it now", onClick: () => {} }}>Deep research is now available on all plans.</AnnouncementBar>
      <AnnouncementBar tone="subtle" action={{ label: "See what's new", onClick: () => {} }}>We've improved answers with sources.</AnnouncementBar>
    </div>
  );
}
