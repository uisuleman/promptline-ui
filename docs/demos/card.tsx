import * as React from "react";
import { MoreHorizontal, Bot, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, Button, Badge, AvatarStack } from "../../src";

export function Default() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader title="Usage this month" description="Resets on October 1" action={<Button variant="ghost" size="icon-sm" aria-label="More"><MoreHorizontal /></Button>} />
      <CardContent>
        <p className="text-4xl font-semibold tabular-nums text-fg">1.2M <span className="text-base font-normal text-fg-muted">tokens</span></p>
        <p className="mt-1 text-sm text-success">↑ 18% vs last month</p>
      </CardContent>
      <CardFooter><Button variant="link" size="sm">View details</Button></CardFooter>
    </Card>
  );
}

export function Interactive() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      {[["Support bot", "Answers customer questions from your help centre.", "Live"], ["Research agent", "Finds and summarises sources on any topic.", "Draft"]].map(([t, d, s]) => (
        <Card key={t} interactive>
          <a href="#" className="block focus:outline-none">
            <CardHeader title={<span className="flex items-center gap-2"><Bot className="size-4 text-fg-muted" />{t}</span>} description={d} action={<ArrowUpRight className="size-4 text-fg-subtle" />} />
            <CardContent className="flex items-center justify-between">
              <Badge tone={s === "Live" ? "success" : "neutral"} dot>{s}</Badge>
              <AvatarStack size="xs" avatars={[{ fallback: "SK" }, { fallback: "MA" }, { fallback: "JC" }]} />
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  );
}
