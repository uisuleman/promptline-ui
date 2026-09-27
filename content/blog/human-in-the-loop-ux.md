---
title: "Human-in-the-Loop UX: Designing Approvals for AI Agents"
seoTitle: "Human-in-the-Loop UX: Approvals for AI Agents"
description: "Human-in-the-loop UX for AI agents: when to ask vs act, what an approval must show, equal-weight Deny, audit trails, batch approvals and timeouts."
date: 2026-09-27
topic: ai-ux-patterns
tags: [human in the loop, ai agents, approvals, agentic ux, trust]
coverTitle: Designing approvals for AI agents
coverAlt: 'Cover image for the guide "Human-in-the-Loop UX: Designing Approvals for AI Agents", showing an approval card that reads "Send email to 248 customers?" with Don''t send and Send email buttons.'
components: [confirmation, clarifying-question, plan, diff-view, alert-dialog, tool]
tldr:
  - Decide when an agent asks by crossing two questions — can this be undone, and who does it affect? Reversible actions that only touch the user should just happen.
  - An approval must name the action, the target and the key facts in plain words, with a verb on the button — "Send email", not "OK".
  - Deny must be as easy to reach as Approve, and a denial must be a normal outcome the agent handles, not an error.
  - Every decision stays in the thread as a record of what was asked, what was shown and who approved it.
  - Fight approval fatigue with batching, "always allow" for low-risk tools and undo instead of prompts; never let a pending approval time out into an action.
faq:
  - q: What is human-in-the-loop UX?
    a: It's the set of interface patterns that let a person review, approve, correct or stop an AI system at key moments. For agents that usually means clarifying questions before work starts, a plan before it runs, and approvals before anything hard to undo.
  - q: When should an AI agent ask for permission instead of acting?
    a: Ask when an action is hard to reverse or reaches beyond the user — sending messages, spending money, deleting data, publishing or changing access. Reading, searching and drafting are usually safe to do without asking, especially when the result is easy to review.
  - q: What should happen when a user denies an agent's action?
    a: The agent should stop that action, say so plainly, and continue with whatever doesn't depend on it or ask what to do instead. Treat Deny as useful input, not a failure — the user just told the agent something about what they want.
  - q: Should approvals expire if nobody responds?
    a: A pending approval can expire, but it should expire into "not done", never into "done". Pause the run, keep the card in the thread, and notify the person — a silent default of yes defeats the point of asking.
---

Human-in-the-loop UX is how you let an AI agent do real work without letting it act behind the user's back. Decide which actions need a human based on how reversible they are and how far they reach, show exactly what will happen at the moment of asking, make "no" as easy as "yes", and keep a record of every decision. Get that right and people hand your agent bigger jobs. Get it wrong and they either stop using it or approve everything without reading.

This post is one of the [AI UX patterns](/blog/ai-ux-patterns) every agent product needs. For the wider question of showing what an agent is doing between approvals, see [agentic UX design](/blog/agentic-ux-design).

## When should an AI agent ask before acting?

Most teams start with "ask before anything important" and end up with an agent that asks about everything. A better rule crosses two questions:

1. **Can it be undone?** Editing a draft can. Sending an email, charging a card or dropping a table can't.
2. **How far does it reach?** Just the user, their team, or people outside — customers, the public, a production system?

Put them together and you get a simple grid:

| | Only affects the user | Affects the team | Affects people outside |
|---|---|---|---|
| **Easy to undo** | Just do it | Do it, offer undo | Ask once, allow "always allow" |
| **Hard to undo** | Ask | Ask, show a plan first | Ask with a typed confirmation |

A few examples from real agent work:

- **Searching the web, reading files, drafting text** — just do it. Show it in the activity log so it's reviewable.
- **Renaming files in the user's own workspace** — do it, then show "Renamed 14 files · Undo".
- **Posting a message to a team channel** — ask, but let people "always allow" it for this channel.
- **Emailing 248 customers, issuing a refund, merging to main** — ask every time, with the details on the card.
- **Deleting a production table or a whole workspace** — ask, and make the person type the name.

Undo beats approval wherever you can build it. An approval stops the user before they know if the result is good; undo lets them see the result and back out. That's why the lowest-friction row of the grid has no prompt at all.

You can encode the grid as a small policy function, so the decision lives in one place instead of being scattered across tool definitions:

```tsx title="app/approval.tsx"
type Reach = "self" | "team" | "external";
export type AgentAction = { tool: string; reversible: boolean; reach: Reach };
export type Gate = "act" | "act-with-undo" | "approve" | "type-to-confirm";

// Reversibility × blast radius → how much friction this action gets.
export function gateFor(action: AgentAction, alwaysAllowed: Set<string>): Gate {
  if (action.reversible && action.reach === "self") return "act";
  if (action.reversible) return alwaysAllowed.has(action.tool) ? "act-with-undo" : "approve";
  if (action.reach === "external") return "type-to-confirm";
  return "approve";
}
```

## Three checkpoints: before, during and at the edge

Approvals aren't one moment. There are three places a human can steer an agent, and each catches a different kind of mistake.

### Before work starts: a clarifying question

The cheapest mistake to fix is the one the agent never makes. If a request is ambiguous in a way that changes the outcome — "clean up the CRM" could mean merge duplicates or delete stale leads — ask one short question with two to four answers. The [Clarifying Question](/components/clarifying-question) card does this with one-click options, a recommended default and a Skip:

:::demo clarifying-question/Default

Rules for asking well:

- **Only ask when the answer changes the work.** "Which tone would you like?" is usually a question the agent can answer itself.
- **Offer options, not an essay prompt.** "Merge duplicates / Delete leads older than a year / Both" beats "What do you mean by clean up?"
- **Mark a recommended answer** and let Skip mean "use your best judgment".

### Before it runs: a reviewable plan

For multi-step jobs, show the plan before executing. People catch wrong assumptions in a five-line plan much faster than in a finished result. A [Plan](/components/plan) with "Edit" and "Run plan" turns a whole batch of future actions into one review:

:::demo plan/Default

Once running, the same plan becomes the progress view, with each step ticking from todo to done. That continuity matters: the thing the user approved is the thing they watch.

### At the edge: the approval card

The last checkpoint sits right before an action from the "ask" cells of the grid. This is where the [Confirmation](/components/confirmation) card lives, inline in the thread, next to the tool call that triggered it.

## What an approval card must show

An approval is only as good as what people can check at a glance. Every card needs:

- **A specific title with a verb and a target.** "Send email to 248 customers?" — not "Confirm action" or "The agent wants to use a tool".
- **The facts someone would check.** Recipients, amount, file, branch, environment. Show them as a short list, not buried in a paragraph.
- **A risk signal only when it's earned.** A warning color on every card turns into wallpaper. Reserve it for high-reach or irreversible actions.
- **Buttons that say what they do.** "Send email" and "Don't send", not "Yes" and "No".
- **A way to see the raw input.** Some users want the actual payload. Keep it one click away, not on the card.

Try the card here — approve or deny, and notice it collapses into a record:

:::demo confirmation/Default

In code, the card is a few props. The details list is where the real checking happens:

```tsx title="app/approval.tsx"
import * as React from "react";
import { Confirmation, type ConfirmationState } from "@/components/ai/confirmation";

export function SendEmailApproval({
  recipients,
  subject,
  onDecision,
  onAlwaysAllow,
}: {
  recipients: number;
  subject: string;
  onDecision: (approved: boolean) => void;
  onAlwaysAllow?: () => void;
}) {
  const [state, setState] = React.useState<ConfirmationState>("pending");
  const decide = (approved: boolean) => {
    setState(approved ? "approved" : "denied");
    onDecision(approved);
  };
  return (
    <Confirmation
      title={`Send email to ${recipients} customers?`}
      description="The agent drafted a product update and wants to send it now."
      details={[
        { label: "From", value: "updates@acme.com" },
        { label: "To", value: `Customers · Active (${recipients})` },
        { label: "Subject", value: subject },
      ]}
      risk={recipients > 1 ? "high" : "low"}
      state={state}
      approveLabel="Send email"
      denyLabel="Don't send"
      onApprove={() => decide(true)}
      onDeny={() => decide(false)}
      onAlwaysAllow={recipients > 1 ? undefined : onAlwaysAllow}
    />
  );
}
```

Note that "Always allow" is only offered for the single-recipient case. Bulk sends should never be pre-approved.

### Show changes as a diff, not a description

When the action is an edit — code, a doc, a config — the approval is the diff. "The agent will update the pricing function" can't be checked; red and green lines can. A [Diff View](/components/diff-view) lets people accept or reject each hunk instead of the whole change:

:::demo diff-view/Default

Per-hunk decisions matter because the alternative is all-or-nothing. If one line out of forty is wrong, people shouldn't have to reject the good thirty-nine and re-prompt.

## Make Deny as easy as Approve

This is the rule most approval UIs break. Deny should be:

- **The same size and just as close** as Approve. A tiny grey "cancel" link next to a big colored button is a nudge, and users notice.
- **Reachable by keyboard** without tabbing past the approve button first.
- **A normal outcome.** After a denial, the agent says what it won't do and what it'll do instead: "Okay, I won't send it. The draft is saved in Documents — want me to change the subject line?"

Don't treat a denial as an error state, and don't make the agent argue. One short follow-up question is fine. Asking the same thing again with different wording is not.

For the most dangerous actions, flip the default entirely. An [Alert Dialog](/components/alert-dialog) focuses Cancel first, so a stray Enter never destroys anything, and can require typing the resource name:

:::demo alert-dialog/TypeToConfirm

Use this sparingly. If people type a confirmation word several times a day, they learn to type it without reading.

## Keep an audit trail in the thread

Every decision should leave something behind. After a Confirmation is decided it collapses to "Approved" or "Denied — the agent will not continue with this action", and that line stays where it happened. Add who and when for team products: "Approved by Maya · 2:14 PM".

The [Tool](/components/tool) component makes the full record inspectable. It has an `awaiting-approval` state and a `denied` state alongside running, completed and error, so the tool call, its input and its outcome sit in one collapsible row:

:::demo tool/AllStates

An audit trail pays off in three places:

- **For the user**, it answers "did I say yes to that?" without guessing.
- **For teams**, it answers "who approved sending that?" without a Slack thread.
- **For you**, it's the data you need to tune the policy — which tools get denied often, and which get approved every time.

## How to prevent approval fatigue

If people approve without reading, the approvals aren't protecting anyone. Signs you're asking too often: approval clicks within a second of the card appearing, and support tickets that start with "I didn't realize it would…".

### Batch related actions

Ten similar actions should be one approval, not ten. "Archive 32 stale leads?" with an expandable list beats 32 cards. The same goes for a plan: approving a plan can pre-approve its reversible steps, so the agent only stops again for the irreversible ones.

Keep batches honest. Don't bundle a harmless action with a dangerous one so the dangerous one slips through. If one item in a batch is higher risk, split it out.

### Let people raise trust per tool

"Always allow" should be scoped and visible:

- **Scoped** to one tool, and ideally one target: "Always allow posting to #launch", not "Always allow Slack".
- **Visible** in settings, with a list of what's been pre-approved and a way to revoke it.
- **Never offered** for irreversible or external actions. Pre-approving refunds isn't a convenience, it's a risk.

### Replace prompts with undo

Revisit the grid regularly. Every action you can make undoable moves out of "ask" and into "do it, offer undo" — which is better UX and fewer prompts at once.

## What happens when nobody answers?

Agents run in the background, and people walk away. A pending approval needs a plan for silence:

- **Pause, don't guess.** The run waits at the approval. Everything that doesn't depend on it can keep going.
- **Notify where people are.** A browser notification, an email or a badge on the run: "1 action waiting for your approval".
- **Expire to "not done".** If an approval has a deadline — a price quote, a booking hold — say so on the card ("Expires in 20 min") and when it passes, mark it expired, not approved.
- **Make resuming easy.** An expired card should offer "Ask again", so the person doesn't have to re-run the whole job.

The one thing an approval must never do is time out into yes. A silent default of "approve" is the same as no approval at all.

## Checklist for your agent's approvals

1. Map every tool onto the reversibility × reach grid, and write it down as a policy.
2. Ask clarifying questions only when the answer changes the work.
3. Show a plan before multi-step jobs; show a diff before edits.
4. Approval titles say the verb and the target; buttons say what they do.
5. Deny is equal in size, easy by keyboard, and handled gracefully by the agent.
6. Every decision leaves a record in the thread, with who and when for teams.
7. Batch similar actions, scope "always allow", and prefer undo over prompts.
8. Pending approvals pause and notify — and never expire into action.

Approvals are one part of the trust story. Pair them with [loading states that show real progress](/blog/ai-loading-states) and [citations people can check](/blog/ai-citations-ui), and see the full set in [AI UX patterns](/blog/ai-ux-patterns). The components here install with `npx shadcn@latest add @{{brand.slug}}/confirmation` — setup is in the [installation docs](/docs/installation).
