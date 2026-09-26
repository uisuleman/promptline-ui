/* Docs registry — one entry per component page. Order = sidebar order. */

export type Section = "ai" | "ui";
export type Group =
  | "Chat" | "Agents" | "Product states" | "Beyond chat"
  | "Actions" | "Forms" | "Overlays" | "Navigation" | "Data display";

export interface Entry {
  slug: string;
  name: string;
  group: Group;
  section?: Section;
  /** Source file relative to src/, e.g. "components/ui/menu.tsx" */
  file?: string;
  /** Scannable capability list shown above the design notes */
  features?: string[];
  description: string;
  /** Exported component names whose props are documented (in order) */
  api: string[];
  /** Why it's designed this way — the part most kits skip */
  notes: string[];
  keyboard?: [string, string][];
  isNew?: boolean;
}

export const aiGroups: Group[] = ["Chat", "Agents", "Product states", "Beyond chat"];

export const aiEntries: Entry[] = [
  // ───────────────────────── Chat
  {
    slug: "conversation", name: "Conversation", group: "Chat",
    description: "Scroll container for a thread that follows streaming text, stops when the user scrolls up, and offers a jump back to the latest message.",
    api: ["Conversation", "ConversationContent"],
    notes: [
      "Auto-scroll only while the user is at the bottom. Yanking someone back down while they read is the most common chat UX bug.",
      "The jump-to-latest button appears only when needed and sits centred above the input, where the eye already is.",
      "The log uses role=\"log\" with polite live-region semantics so screen readers hear new messages without interruption.",
      "Content is capped at 768px — the comfortable reading measure for 15px text.",
    ],
  },
  {
    slug: "message", name: "Message", group: "Chat",
    description: "A single turn. User messages sit in a soft bubble; assistant messages are full-width so long answers read like a document.",
    api: ["Message", "MessageBody", "AssistantAvatar"],
    notes: [
      "Asymmetry is intentional: bubbles signal \"short, conversational\"; full-width signals \"read this\". AI answers are often long, so they get the document treatment.",
      "Body text is 15/24 — one step larger than UI text — because it is reading material, not interface.",
      "`header` and `footer` slots keep reasoning, tools and actions in a predictable order: process → answer → actions.",
      "User bubbles cap at 80% width so they never look like the assistant speaking.",
    ],
  },
  {
    slug: "prompt-input", name: "Prompt Input", group: "Chat",
    description: "The composer: auto-growing textarea, attachments, tools and model slots, drag-and-drop, and a submit button that reflects every request state.",
    api: ["PromptInput", "PromptTool"],
    notes: [
      "One button, four states — send, sending, stop, retry — so the user always knows what clicking will do.",
      "Stop replaces send in the same spot. Users reach for it in a hurry; it must be where their cursor already is.",
      "The box grows to 10 lines then scrolls. Beyond that, a larger editor hides the conversation it's replying to.",
      "The character counter only appears past 80% of the limit — no noise until it matters.",
      "Enter-to-send is IME-safe, so Japanese, Chinese and Korean input isn't sent mid-composition.",
    ],
    keyboard: [["Enter", "Send"], ["Shift + Enter", "New line"], ["Paste files", "Attach"]],
  },
  {
    slug: "suggestion", name: "Suggestion", group: "Chat",
    description: "Starter prompts and follow-ups as chips or cards. Removes the blank-page problem in one click.",
    api: ["Suggestion", "Suggestions", "SuggestionCard"],
    notes: [
      "Write suggestions as things the user would actually type, not feature names (\"Summarise a PDF\" not \"Document analysis\").",
      "3–4 is the sweet spot. More becomes a menu to read, not a shortcut.",
      "Chips scroll horizontally on mobile instead of wrapping into a wall of pills.",
      "Cards add a second line for context — use them on empty states, chips for follow-ups.",
    ],
  },
  {
    slug: "attachments", name: "Attachments", group: "Chat",
    description: "File and image chips with uploading, ready and error states — in the composer and in sent messages.",
    api: ["Attachments", "Attachment"],
    notes: [
      "Upload progress is a ring on the file icon, not a separate bar, so chips keep a fixed size and the row never reflows.",
      "Errors keep the file in place with a retry button. Silently dropping a failed file is how users lose work.",
      "Remove buttons show on hover on desktop but are always visible on touch devices.",
      "Images show as square thumbnails — people recognise pictures faster than filenames.",
    ],
  },
  {
    slug: "model-selector", name: "Model Selector", group: "Chat",
    description: "Pick a model with plain-language descriptions, capability badges, provider groups, search, and locked models that route to your paywall.",
    api: ["ModelSelector"],
    notes: [
      "Describe what a model is good for (\"Deeper reasoning for complex work\"), not its benchmark scores.",
      "Locked models stay visible with a lock icon — hiding them hides the reason to upgrade.",
      "Search appears automatically past 6 models; below that it's friction.",
      "Opens upward by default because it lives in the composer at the bottom of the screen.",
    ],
    keyboard: [["↑ ↓", "Move"], ["Enter", "Select"], ["Esc", "Close"]],
  },
  {
    slug: "actions", name: "Actions", group: "Chat",
    description: "Copy, regenerate, feedback, read aloud and share under a response. Composable, with optional reveal-on-hover.",
    api: ["Actions", "Action", "CopyAction", "RetryAction", "FeedbackActions", "ReadAloudAction", "ShareAction"],
    notes: [
      "Copy gives instant feedback (icon → check) for 2 seconds — no toast needed for something this small.",
      "Feedback is a controlled value so you can log it; a filled icon shows the current choice.",
      "Hover-reveal keeps long threads calm, but actions stay visible on touch screens where hover doesn't exist.",
      "Every icon button has a tooltip and an aria-label. Icons alone are ambiguous.",
    ],
  },
  {
    slug: "branch", name: "Branch", group: "Chat",
    description: "Switch between alternative responses after a regenerate, or between versions of an edited prompt.",
    api: ["Branch", "BranchPager"],
    notes: [
      "Regenerating should never destroy the previous answer. Branches keep every version one click away.",
      "The pager (2 / 3) is small and quiet — most users never regenerate, so it shouldn't compete with the answer.",
      "Defaults to the newest version, since that's what the user just asked for.",
    ],
  },
  {
    slug: "loader", name: "Loader", group: "Chat",
    description: "Waiting states for the gap before the first token: dots, pulse and bars, plus shimmer text for live status and a streaming cursor.",
    api: ["Loader", "Shimmer", "StreamingCursor"],
    notes: [
      "Show something within 300ms of submit. A silent screen for one second feels broken; with a loader, five seconds feels fine.",
      "Prefer a status label (\"Searching the web…\") over a bare spinner — it tells users the wait is productive.",
      "The shimmer uses the text itself as the loading indicator, so no extra element is needed.",
      "All animations respect prefers-reduced-motion.",
    ],
  },
  {
    slug: "code-block", name: "Code Block", group: "Chat",
    description: "Code with filename, copy, download, wrap toggle, line numbers and line highlights. Built-in lightweight highlighting.",
    api: ["CodeBlock"],
    notes: [
      "Copy is always visible, not hover-only — it's the main reason people look at a code block in chat.",
      "Wrap is off by default to preserve indentation, but one click away for long lines on mobile.",
      "The built-in highlighter is tiny and covers common languages. For full grammars, pass Shiki output as children.",
      "Syntax colours are tokens (--syn-*) so they follow your theme in light and dark.",
    ],
  },
  {
    slug: "sources", name: "Sources", group: "Chat",
    description: "Collapsed \"Used 4 sources\" pill with favicons that expands into source cards.",
    api: ["Sources"],
    notes: [
      "Collapsed by default: sources support the answer, they shouldn't push it down the page.",
      "Favicons build recognition at a glance; domain names build trust. Show both.",
      "Cards number sources so inline citations and the list can refer to each other.",
    ],
  },
  {
    slug: "inline-citation", name: "Inline Citation", group: "Chat",
    description: "A domain pill right after the claim it supports, with a hover card and paging for multiple sources.",
    api: ["InlineCitation"],
    notes: [
      "Show the domain, not a bare number. \"nngroup.com\" means something; \"[3]\" makes people hunt.",
      "Place it immediately after the claim, not at the end of the paragraph.",
      "The hover card opens on focus too, so keyboard users get the same preview.",
    ],
  },
  {
    slug: "generated-image", name: "Generated Image", group: "Chat",
    description: "Image output with generating, done and error states, progress, and download/expand actions.",
    api: ["GeneratedImage"],
    notes: [
      "Reserve the final aspect ratio while generating so the layout doesn't jump when the image lands.",
      "Echo the prompt inside the placeholder — it reassures users the right thing is being made.",
      "Failures offer a retry in place instead of a generic error message.",
    ],
  },

  // ───────────────────────── Agents
  {
    slug: "reasoning", name: "Reasoning", group: "Agents",
    description: "The model's thinking. Opens while streaming, then collapses to \"Thought for 8s\" when the answer starts.",
    api: ["Reasoning"],
    notes: [
      "Visible thinking builds trust during the wait; once the answer arrives it becomes noise, so it collapses automatically.",
      "The duration label tells users the model worked hard — useful context for slow responses.",
      "Styled quieter than the answer (13px, muted, left rule) so it never reads as the response.",
    ],
  },
  {
    slug: "chain-of-thought", name: "Chain of Thought", group: "Agents",
    description: "A step-by-step timeline of what the model did — searched, read, calculated — with results attached to each step.",
    api: ["ChainOfThought"],
    notes: [
      "Use it when steps are distinct and meaningful to the user. For free-form thinking, use Reasoning.",
      "The collapsed label shows the active step, so users see progress without expanding.",
      "Pending steps are shown faded — knowing what's next makes waiting easier.",
    ],
  },
  {
    slug: "tool", name: "Tool", group: "Agents",
    description: "One tool or function call: name, status, duration, and expandable parameters and result. Supports custom result UI.",
    api: ["Tool"],
    notes: [
      "Lead with a human title (\"Searched the web\") and keep the function name as secondary detail for developers.",
      "Errors and approval requests open automatically — they need attention; successes stay collapsed.",
      "Pass children to render real UI (a weather card, a chart) instead of raw JSON wherever users will read the result.",
      "States match the AI SDK tool-invocation lifecycle, so you can map them directly.",
    ],
  },
  {
    slug: "confirmation", name: "Confirmation", group: "Agents",
    description: "Human-in-the-loop approval before an agent takes a consequential action.",
    api: ["Confirmation"],
    
    notes: [
      "Say exactly what will happen and to whom. \"Send email to 248 customers\" — not \"Run tool?\".",
      "Show the key facts in a definition list. People approve what they can check.",
      "Deny is as easy to hit as Approve. Both sit together; neither is hidden.",
      "High-risk actions get an amber border — enough to slow people down without alarming them.",
      "After deciding, the card records the outcome so the thread keeps an audit trail.",
    ],
  },
  {
    slug: "plan", name: "Plan", group: "Agents",
    description: "The agent proposes a plan before acting; the same card then shows progress as it runs.",
    api: ["Plan"],
    notes: [
      "Plan-then-run lets users correct direction before minutes of work are spent on the wrong thing.",
      "One component for both phases: the review card becomes the progress view, so users don't lose their place.",
      "Completed steps are struck through and muted — the eye jumps straight to what's in progress.",
    ],
  },
  {
    slug: "task", name: "Task", group: "Agents",
    description: "A collapsible unit of agent work with the concrete files, queries and links it touched.",
    api: ["Task", "TaskFile"],
    notes: [
      "Name the outcome (\"Found the auth logic\") rather than the action — it reads as progress.",
      "File chips in mono make it obvious what was read or changed and are easy to scan.",
    ],
  },
  {
    slug: "queue", name: "Queue", group: "Agents",
    description: "Messages the user typed while the agent was busy, plus the agent's to-do list.",
    api: ["Queue"],
    
    notes: [
      "Agents run for minutes. Let people keep typing instead of blocking the composer.",
      "Queued messages can be sent now or removed — the user stays in control of what runs next.",
      "To-dos show a count (2/4) in the header so progress is visible even when collapsed.",
    ],
  },
  {
    slug: "artifact", name: "Artifact", group: "Agents",
    description: "A standalone output — document, code, app — in a panel beside the chat, with version and actions.",
    api: ["Artifact"],
    notes: [
      "Big outputs belong beside the conversation, not inside it. The chat stays readable; the artifact stays usable.",
      "The version badge makes iterations explicit, so users know they're looking at the latest.",
      "Preview / Code tabs serve both audiences without two components.",
    ],
  },
  {
    slug: "web-preview", name: "Web Preview", group: "Agents",
    description: "Browser frame for generated sites and apps with URL bar, device widths, and a console drawer.",
    api: ["WebPreview"],
    notes: [
      "Device toggles answer the first question people ask about generated sites: \"does it work on mobile?\".",
      "The console badge counts errors so users (and the agent) notice a broken build immediately.",
      "Pass children to render your own content, or let it iframe the URL.",
    ],
  },
  {
    slug: "context", name: "Context", group: "Agents",
    description: "A small ring showing how full the context window is, with token breakdown and cost on hover.",
    api: ["Context"],
    
    notes: [
      "Answers get worse as the context fills. Showing usage lets people start fresh before quality drops.",
      "Neutral until 80%, then amber, red at 95% — calm by default, loud only when useful.",
      "Cost is optional and shown in the hover card, useful for developer-facing tools.",
    ],
  },

  // ───────────────────────── Product states
  {
    slug: "empty-state", name: "Empty State", group: "Product states",
    description: "The first screen of a chat: one line on what the product does and one-click ways to start.",
    api: ["EmptyState"],
    notes: [
      "A blank chat is the most expensive screen in an AI product — users don't know what to ask. Always give starters.",
      "Say what the product is for in one short line. Capabilities, not a mission statement.",
      "Put the prompt input inside the empty state for home-screen style products.",
    ],
  },
  {
    slug: "skeleton", name: "Skeleton", group: "Product states",
    description: "Shimmer placeholders shaped like the real content, for loading saved threads, lists and cards.",
    api: ["Skeleton", "MessageSkeleton", "ConversationSkeleton"],
    notes: [
      "Use skeletons for loading known content (history, saved chats). Use Loader for waiting on the model — they mean different things.",
      "Match the real layout closely so nothing jumps when content arrives.",
    ],
  },
  {
    slug: "status-banner", name: "Status Banner", group: "Product states",
    description: "Errors, rate limits, out-of-credits, offline and content-policy states — each with a clear next step.",
    api: ["StatusBanner"],
    
    notes: [
      "Copy formula: what happened → why (if useful) → what to do. Never \"Something went wrong\".",
      "Rate limits show a live countdown and disable retry until it's allowed — no guessing.",
      "Reassure where you can: \"Your message is saved\" turns a failure into a pause.",
      "Only real errors use red. Limits and policies are neutral — the user did nothing wrong.",
    ],
  },
  {
    slug: "usage-meter", name: "Usage Meter", group: "Product states",
    description: "Credits, messages or tokens remaining, with reset time and an upgrade link.",
    api: ["UsageMeter"],
    notes: [
      "Always say when it resets. A limit with a reset time is a pause; without one it's a wall.",
      "Neutral bar until 80%, amber at 80%, red at 95%.",
      "Pair with StatusBanner kind=\"credits\" when the limit is actually hit.",
    ],
  },
  {
    slug: "upgrade-dialog", name: "Upgrade Dialog", group: "Product states",
    description: "Paywall for credit exhaustion or locked models, with plan cards and monthly/yearly billing.",
    api: ["UpgradeDialog"],
    notes: [
      "Lead with the reason they hit the wall (\"You've used today's free messages\"), then the plan that removes it.",
      "Always offer the free way out (\"or come back tomorrow\"). A paywall with no exit feels hostile.",
      "One recommended plan, clearly marked. Two equal choices slow people down.",
      "Focus is trapped inside the dialog and restored on close; Esc and backdrop both dismiss.",
    ],
  },
  {
    slug: "api-key-input", name: "API Key Input", group: "Product states",
    description: "Bring-your-own-key field: masked, show/hide, verify with clear states, and last-4 confirmation.",
    api: ["ApiKeyInput"],
    notes: [
      "Masked by default — keys get screenshotted and screen-shared more than people think.",
      "Whitespace is trimmed on input; a trailing space is the #1 cause of \"invalid key\".",
      "After verifying, confirm with the last 4 characters only.",
      "Error copy suggests the likely fixes instead of just saying \"invalid\".",
    ],
  },
  {
    slug: "feedback-dialog", name: "Feedback Dialog", group: "Product states",
    description: "Opens after 👎 to collect specific reasons in one tap, plus an optional comment.",
    api: ["FeedbackDialog"],
    notes: [
      "Reasons map to problems your team can fix. \"Didn't follow instructions\" is actionable; \"Bad\" is not.",
      "One tap is enough to submit. The text box is optional — requiring it cuts response rates sharply.",
      "Multi-select, because bad answers are often wrong in more than one way.",
    ],
  },
  {
    slug: "chat-sidebar", name: "Chat Sidebar", group: "Product states",
    description: "Conversation history with new chat, search, pinned items, date groups and a footer slot.",
    api: ["ChatSidebar"],
    notes: [
      "Date groups (Today, Yesterday, Previous 7 days) match how people remember conversations.",
      "Pinned chats stay on top for the handful of threads people return to daily.",
      "Search is always visible — history is useless if you can't find things in it.",
      "Row actions reveal on hover and are always visible on touch.",
    ],
  },
  {
    slug: "toast", name: "Toast", group: "Product states",
    description: "Small confirmations with optional undo. Auto-dismiss, stackable, pause on hover.",
    api: ["Toaster", "ToastView", "useToast"],
    notes: [
      "Use for results of actions (\"Chat deleted\"), not for errors that need a decision — use StatusBanner or a dialog.",
      "Offer Undo instead of \"Are you sure?\" for reversible actions. Faster for everyone.",
      "Max three visible, newest at the bottom, paused while hovered so people can read them.",
    ],
  },

  // ───────────────────────── Beyond chat
  {
    slug: "inline-ai", name: "Inline AI", group: "Beyond chat",
    description: "AI inside a document: select text, pick an action or type an instruction, review the diff, accept or discard.",
    api: ["InlineAI", "InlineAITrigger"],
    
    notes: [
      "Most AI features aren't chats. Editing in place keeps users in their work instead of copy-pasting between windows.",
      "Always show a diff before applying. AI edits must be reviewable, never silent.",
      "Accept has focus by default so Enter applies; Esc discards — the whole loop works from the keyboard.",
    ],
    keyboard: [["⌘ J", "Open"], ["Enter", "Accept"], ["Esc", "Discard"]],
  },
  {
    slug: "command-bar", name: "Command Bar", group: "Beyond chat",
    description: "A ⌘K palette that mixes commands with AI. The first result is always \"Ask AI\" so every query has an answer.",
    api: ["CommandBar"],
    
    notes: [
      "Combining search and AI in one box means users never have to decide which to use first.",
      "\"Ask AI\" is always the top row once there's a query — commands filter below it.",
      "Opens from the top third of the screen, where palettes are expected.",
    ],
    keyboard: [["⌘ K", "Toggle"], ["↑ ↓", "Navigate"], ["Enter", "Run"], ["Esc", "Close"]],
  },
  {
    slug: "generate-button", name: "Generate Button", group: "Beyond chat",
    description: "The ✨ Generate button used across AI products, with generating (cancellable) and done states.",
    api: ["GenerateButton"],
    
    notes: [
      "The button reserves the width of its longest label, so nothing shifts when the text changes.",
      "Hovering while generating turns the button into Stop — cancel lives exactly where the user clicked.",
      "A short \"Done\" check confirms success, then it resets. No toast needed.",
    ],
  },
  {
    slug: "voice-input", name: "Voice Input", group: "Beyond chat",
    description: "Dictation for the composer: mic → live waveform and timer → cancel or done.",
    api: ["VoiceInput"],
    
    notes: [
      "A visible waveform proves the mic is hearing you — the most common voice-input doubt.",
      "Cancel and Done are at opposite ends so they're never confused.",
      "The red recording dot follows a familiar convention; the timer reassures on longer dictations.",
    ],
  },
  {
    slug: "confidence", name: "Confidence", group: "Beyond chat",
    description: "Honest trust signals: a confidence badge, uncertain-text highlights, and a verify note for high-stakes answers.",
    api: ["ConfidenceBadge", "UncertainText", "VerifyNote"],
    
    notes: [
      "Only show confidence your system can actually estimate. Fake certainty destroys trust faster than none.",
      "Highlight the specific uncertain phrase, not the whole answer, so users know what to double-check.",
      "Use the verify note in medical, legal, financial and numeric answers — not on every message.",
    ],
  },
  {
    slug: "memory", name: "Memory", group: "Beyond chat",
    description: "Show what the assistant remembers and let people edit, delete or turn it off.",
    api: ["MemoryManager", "MemoryUpdated", "Switch"],
    
    notes: [
      "Memory people can't see feels like surveillance. Memory they can edit feels like a feature.",
      "Show an inline \"Memory updated\" chip the moment something is saved, with a link to manage it.",
      "A single master switch lets users opt out without deleting everything.",
    ],
  },
];

/* ───────────────────────── New AI components */
export const aiEntries2: Entry[] = [
  {
    slug: "clarifying-question", name: "Clarifying Question", group: "Agents", 
    description: "The agent asks before it acts: a short question with a few answers, \"Something else…\" and Skip.",
    api: ["ClarifyingQuestion"],
    features: ["Single or multiple choice", "Recommended option marker", "Free-text \"Something else\" answer", "Skip lets the agent decide", "Number keys 1–9 answer instantly", "Collapses to a record of the answer"],
    notes: [
      "A 5-second question beats 5 minutes of work in the wrong direction. Ask when the request is ambiguous and the work is expensive.",
      "Offer concrete options, not an open text box — choosing is faster than writing.",
      "Always allow an escape: a custom answer or \"you decide\". Never trap the user in your options.",
      "After answering, the card shrinks to one line so the thread stays readable and the decision stays visible.",
    ],
    keyboard: [["1 – 9", "Choose option"]],
  },
  {
    slug: "response-compare", name: "Response Compare", group: "Chat", 
    description: "Two answers side by side and one question — which is better? For A/B tests and model evaluation.",
    api: ["ResponseCompare"],
    features: ["Side by side on desktop, stacked on mobile", "A / B / About the same", "Model names hidden until voted", "Winner highlighted, loser dimmed"],
    notes: [
      "Hide model names until the vote. Brand names bias choices more than content does.",
      "\"About the same\" is a real answer — forcing a pick adds noise to your data.",
      "Keep both answers the same height where possible so length doesn't win by default.",
    ],
  },
  {
    slug: "image-variations", name: "Image Variations", group: "Chat", 
    description: "Pick one of four generated images, view full screen, or ask for more like a favourite.",
    api: ["ImageVariations"],
    features: ["2×2 selectable grid", "Full-screen viewer with ← → and Esc", "\"More like this\" per image", "Shimmer placeholders while generating", "Explicit selection state"],
    notes: [
      "Generating four options and letting people choose is faster than regenerating one image four times.",
      "Selection is explicit (a ring and a check) so the next step always knows which image to use.",
      "Number badges let people refer to options in chat: \"make 3 warmer\".",
    ],
  },
  {
    slug: "relative-time", name: "Relative Time", group: "Chat", 
    description: "\"just now\", \"5m ago\", \"Yesterday\" — self-updating timestamps plus history group labels.",
    api: ["RelativeTime"],
    features: ["Localised with Intl.RelativeTimeFormat", "Updates itself (every 30s when recent)", "Full date on hover", "Semantic <time> element", "dayGroup() for history lists"],
    notes: [
      "Relative times are easier to scan in chat; exact times matter for audits — so show both (relative text, exact on hover).",
      "Updates slow down as messages age, so long threads don't re-render every second.",
    ],
  },
  {
    slug: "file-tree", name: "File Tree", group: "Agents", 
    description: "Project files for coding agents with added, modified and deleted markers.",
    api: ["FileTree"],
    features: ["A / M / D change markers", "Collapsed folders show a change dot", "Deleted files struck through", "Full tree keyboard navigation", "Selected file state"],
    notes: [
      "The first question after an agent edits code is \"what did it touch?\". Markers answer it at a glance.",
      "Folders roll up changes, so users can find the work without expanding everything.",
      "Letters plus colour — never colour alone — so markers work for colour-blind users.",
    ],
    keyboard: [["↑ ↓", "Move"], ["→", "Expand"], ["←", "Collapse / parent"], ["Enter", "Open"]],
  },
  {
    slug: "diff-view", name: "Diff View", group: "Agents", 
    description: "Review an agent's code changes hunk by hunk — accept, reject, or undo each decision.",
    api: ["DiffView"],
    features: ["Per-hunk Accept / Reject", "Accept all / Reject all", "Undo any decision", "+/− line stats", "Old and new line numbers", "diffLines() helper included"],
    notes: [
      "Agents are right most of the time, not all of the time. Per-hunk review lets users keep the good parts.",
      "Decided hunks collapse to one line, so what still needs review is obvious.",
      "Every decision is reversible until the user moves on.",
    ],
  },
  {
    slug: "agent-runs", name: "Agent Runs", group: "Agents", 
    description: "Background agent jobs with live progress, time, cost, and one-click Stop or Retry.",
    api: ["AgentRuns"],
    features: ["Filters: All, Active, Completed, Failed", "Live step + progress for running jobs", "Duration and cost per run", "Stop / Retry actions", "Failure reason inline"],
    notes: [
      "Long-running agents need a place people can leave and come back to — this is it.",
      "Show the current step, not just a spinner. \"Reading page 13 of 20\" builds more trust than 62%.",
      "Failures say why and what to do (\"reconnect HubSpot\"), next to a Retry button.",
    ],
  },
  {
    slug: "knowledge-upload", name: "Knowledge Upload", group: "Product states", 
    description: "Upload documents an assistant learns from, with uploading → processing → ready states.",
    api: ["KnowledgeUpload"],
    features: ["Drag-and-drop or click", "Type, size and count validation with specific messages", "Upload progress per file", "Processing and chunk count", "Retry failed files", "Storage usage"],
    notes: [
      "Uploading isn't the end — indexing is. Show \"reading and indexing\" so people don't ask questions too early.",
      "Reject bad files up front with the exact reason (\"MOV files aren't supported\"), not after upload.",
      "Chunk counts quietly confirm the file was actually read.",
    ],
  },
  {
    slug: "usage-chart", name: "Usage Chart", group: "Product states", 
    description: "Daily tokens, messages or spend with a limit line, hover details and range switcher.",
    api: ["UsageChart"],
    features: ["Headline total", "7 / 30 day ranges", "Dashed daily-limit line", "Over-limit days in amber", "Per-bar hover tooltip", "Screen-reader data table"],
    notes: [
      "Lead with the total — that's the number people came for. The bars explain it.",
      "One series, one colour. Only over-limit days change colour, and the limit line is labelled.",
      "Bars sit on a zero baseline so heights are honest.",
    ],
  },
  {
    slug: "model-status", name: "Model Status", group: "Product states", 
    description: "Service health for the models you depend on — inline dots and a status list with 30-day uptime.",
    api: ["ModelStatusList", "StatusDot"],
    features: ["Operational, degraded, outage, maintenance", "Pulsing dot when something's wrong", "30-day uptime bars", "Plain-language impact notes"],
    notes: [
      "When a provider is slow, users blame your product. Saying so first keeps their trust.",
      "Describe the effect (\"about 2× slower\"), not internal jargon (\"elevated p95 latency\").",
      "Status always pairs colour with a label.",
    ],
  },
  {
    slug: "announcement", name: "Announcement", group: "Product states", 
    description: "Tell users about something new without a modal — a pill or a dismissible top bar.",
    api: ["AnnouncementPill", "AnnouncementBar"],
    features: ["Pill for empty states and headers", "Full-width bar with action", "Dismissal remembered per announcement", "Accent or subtle tone"],
    notes: [
      "Announcements should never block work. A pill or bar informs; a modal interrupts.",
      "One announcement at a time, and remember dismissals — showing it again feels like nagging.",
    ],
  },
  {
    slug: "onboarding-wizard", name: "Onboarding Wizard", group: "Product states", 
    description: "A short multi-step setup: goal → data → first prompt, with a stepper and skippable steps.",
    api: ["OnboardingWizard"],
    features: ["Stepper with completed steps", "Per-step validation (canContinue)", "Optional steps with Skip", "Back always available", "Focus moves to each new step"],
    notes: [
      "Three to five steps. Every extra step loses people.",
      "One decision per step, and end on a first prompt — the goal of onboarding is the first useful answer.",
      "Focus moves to the step title so screen-reader users hear where they are.",
    ],
  },
  {
    slug: "prompt-template", name: "Prompt Template", group: "Beyond chat", 
    description: "Reusable prompts with {{variables}} that become a form, with a live preview.",
    api: ["PromptTemplate"],
    features: ["{{name}} and {{name:hint}} syntax", "Fields generated automatically", "Live highlighted preview", "Enabled once all fields are filled", "parseTemplate() / fillTemplate() helpers"],
    notes: [
      "Most people reuse the same five prompts. Templates turn them into forms anyone on the team can fill.",
      "Missing values stay visible in the preview as dashed placeholders — nothing is sent half-filled.",
    ],
  },
];


/* ───────────────────────── Latest batch */
export const aiEntries3: Entry[] = [
  {
    slug: "slash-commands", name: "Slash Commands", group: "Chat", isNew: true,
    description: "Type \"/\" to open a searchable command list above the prompt — the power-user shortcut in every modern AI tool.",
    api: ["SlashCommands"],
    features: ["Opens on \"/\" at the start of the prompt", "Ranked matching with highlighted query", "Groups, icons, descriptions and keywords", "↑ ↓ Enter Tab Esc", "Works with any input via a render prop", "Never steals Enter when closed"],
    notes: [
      "Only trigger at the start of the message — a slash in the middle of a sentence is just a slash.",
      "Rank label matches above description matches, so typing \"/tr\" finds Translate before anything that merely mentions it.",
      "Show the command id next to each item. Users learn \"/summarize\" and stop needing the menu.",
      "Esc closes the menu without clearing the text — the user might really want to send \"/\".",
    ],
    keyboard: [["/", "Open"], ["↑ ↓", "Move"], ["Enter / Tab", "Run"], ["Esc", "Close"]],
  },
  {
    slug: "mention-picker", name: "Mention Picker", group: "Chat", isNew: true,
    description: "Type \"@\" to add a file, agent or person as context. Picks become removable chips above the prompt.",
    api: ["MentionPicker", "MentionChip"],
    features: ["Opens on \"@\" anywhere in the message", "Files, agents and people with type headers", "Already-mentioned items are hidden", "Chips with remove buttons", "Keyboard first"],
    notes: [
      "Turn mentions into chips instead of leaving \"@file\" in the text — the user can see exactly what context the model gets.",
      "Hide items that are already attached so the list only offers new context.",
      "Show a small hint on the right (folder, size, team) to tell similar names apart.",
    ],
    keyboard: [["@", "Open"], ["↑ ↓", "Move"], ["Enter / Tab", "Add"], ["Esc", "Close"]],
  },
  {
    slug: "streaming-text", name: "Streaming Text", group: "Chat", isNew: true,
    description: "Smooths bursty model tokens into an even, readable reveal — with light markdown and a caret while streaming.",
    api: ["StreamingText"],
    features: ["Even reveal that speeds up when behind", "Headings, lists, bold, italic, code, code blocks", "Blinking caret while streaming", "Plain-text mode", "Reduced-motion safe", "aria-busy until complete"],
    notes: [
      "Tokens arrive in bursts. Revealing them as they land looks jittery; a steady reveal reads like typing.",
      "Speed up when the backlog grows so text never trails the stream by more than about a second.",
      "Keep the caret only while text is still coming — a caret on a finished answer looks broken.",
      "Mark the region aria-busy while streaming so screen readers announce the full answer once.",
    ],
  },
  {
    slug: "research-progress", name: "Research Progress", group: "Agents", isNew: true,
    description: "The deep-research view: plan phases, the sources being read right now, a live count and a Stop button.",
    api: ["ResearchProgress"],
    features: ["Phase checklist with active spinner", "Live source feed with favicons", "Sources count and elapsed time", "Stop while running, Open report when done", "Collapses to one line when finished", "Two columns on desktop, stacked on mobile"],
    notes: [
      "Long tasks need proof of progress. A growing source list does that better than any spinner.",
      "Always show elapsed time and a Stop button — users wait longer when they know they can leave.",
      "Show the newest sources first and cap the list; \"+ 29 more\" says \"thorough\" without the noise.",
      "When it's done, collapse the details and put the report one click away.",
    ],
  },
  {
    slug: "voice-mode", name: "Voice Mode", group: "Beyond chat", isNew: true,
    description: "A live voice conversation: an orb that shows who's talking, state in words, captions, mute and end.",
    api: ["VoiceMode", "VoiceOrb"],
    features: ["Connecting, listening, thinking, speaking", "Orb reacts to your audio level", "Live captions toggle", "Mute and end buttons", "State announced to screen readers", "Neutral — follows your theme"],
    notes: [
      "Always say the state in words too. An animation alone doesn't tell you whether it's your turn.",
      "Make mute and end the biggest targets. People reach for them fast, often with one hand.",
      "End is red and always visible — nobody should hunt for how to hang up.",
      "Captions help in noisy rooms and build trust that the AI heard you correctly.",
    ],
  },
  {
    slug: "audio-player", name: "Audio Player", group: "Beyond chat", isNew: true,
    description: "Playback for AI speech and audio: a seekable waveform, time, speed and download.",
    api: ["AudioPlayer"],
    features: ["Waveform doubles as the scrubber", "Click or drag to seek", "Speed cycling (1×, 1.25×, 1.5×, 2×, 0.75×)", "Download button", "Keyboard seeking", "Stable pseudo-waveform when you have no peaks"],
    notes: [
      "The waveform is the progress bar — one control instead of two, and it shows where the pauses are.",
      "Speed is the most-used control for generated speech. Keep it one tap away.",
      "Use tabular numbers for time so the layout doesn't jitter while playing.",
    ],
    keyboard: [["Space", "Play / pause"], ["← →", "Seek 5s"], ["Home / End", "Start / end"]],
  },
  {
    slug: "json-viewer", name: "JSON Viewer", group: "Agents", isNew: true,
    description: "Structured output and tool results as a collapsible, copyable tree.",
    api: ["JsonViewer"],
    features: ["Collapsible objects and arrays", "Item and key counts when collapsed", "Type colours from your syntax tokens", "Copy all or any value", "Expand / collapse all", "Scrolls inside a max height"],
    notes: [
      "Collapsed nodes show their size (\"3 items\") so you can scan structure without opening everything.",
      "Open two levels by default — enough to see the shape, not so much that it floods the chat.",
      "Copy per value is what people actually need when debugging a tool call.",
    ],
    keyboard: [["Enter / Space", "Toggle node"], ["→ / ←", "Expand / collapse"]],
  },
  {
    slug: "share-dialog", name: "Share Dialog", group: "Chat", isNew: true,
    description: "Share a chat with clear access levels and an honest note about what's included.",
    api: ["ShareDialog"],
    features: ["Private, link, public access", "Link appears only when sharing is on", "Copy with confirmation", "Custom privacy note", "Option to hide Public", "Arrow keys change access"],
    notes: [
      "Say exactly what gets shared. \"Messages after sharing stay private\" prevents the most common surprise.",
      "Grey out the link while the chat is private so nobody copies a link that doesn't work.",
      "Describe each level by who can see it, not by technical terms.",
    ],
  },
  {
    slug: "connectors", name: "Connectors", group: "Agents", isNew: true,
    description: "Tiles for connecting the apps your AI reads from — with connecting, syncing and error states.",
    api: ["ConnectorCard", "ConnectorGrid"],
    features: ["Disconnected, connecting, connected, syncing, error", "Account and last-sync detail", "Sync, settings and disconnect in a menu", "Reconnect on error", "One or two columns"],
    notes: [
      "Each state has exactly one obvious next step: Connect, wait, Reconnect — or nothing when it works.",
      "Show which account is connected. \"Why can't it see my file?\" is usually the wrong account.",
      "Put Disconnect in the menu, not on the card. It's rare and destructive.",
    ],
  },
  {
    slug: "agent-gallery", name: "Agent Gallery", group: "Agents", isNew: true,
    description: "Pick an assistant: search, category filters and cards that say what each agent is for.",
    api: ["AgentGallery", "AgentCard"],
    features: ["Search by name and description", "Category filters from your data", "Selected state", "Create-an-agent card", "Arrow-key grid navigation", "1, 2 or 3 columns"],
    notes: [
      "Describe the outcome (\"writes a cited report\"), not the model or the prompt behind it.",
      "Two lines of description, then truncate — cards of equal height scan faster.",
      "Usage counts are social proof; show them quietly in the footer.",
    ],
    keyboard: [["← → ↑ ↓", "Move between cards"]],
  },
];

/* ───────────────────────── UI components */
const ui = (slug: string, name: string, group: Group, file: string, description: string, api: string[], features: string[], notes: string[], keyboard?: [string, string][]): Entry =>
  ({ slug, name, group, section: "ui", file: `components/ui/${file}.tsx`, description, api, features, notes, keyboard });

export const uiEntries: Entry[] = [
  ui("button", "Button", "Actions", "button", "Five variants, four sizes, icon buttons, a loading state and button groups.", ["Button", "ButtonGroup", "ButtonLink"],
    ["Primary, secondary, outline, ghost, danger, link", "Heights 28 / 32 / 36 / 40", "Icon-only sizes", "Loading keeps the width", "ButtonGroup joins related actions"],
    ["One primary button per view. If everything is primary, nothing is.", "Loading keeps the label's width so the layout never jumps.", "Icon-only buttons always need an aria-label — and usually a Tooltip."]),
  ui("toggle", "Toggle", "Actions", "toggle", "Pressed / unpressed buttons and groups — formatting, view modes, tool switches.", ["Toggle", "ToggleGroup"],
    ["Single toggle", "Single-select group (segmented)", "Multi-select group", "Arrow-key navigation"],
    ["Use a ToggleGroup for 2–4 mutually exclusive views. More options belong in a Select.", "Segmented style is ideal for Preview / Code and Grid / List."], [["← →", "Move between items"]]),
  ui("dropdown-menu", "Dropdown Menu", "Actions", "menu", "Actions from a trigger — row actions, account menus, \"more\" menus.", ["DropdownMenu"],
    ["Items with icons and shortcuts", "Checkbox and radio items", "Labels and separators", "One level of submenu", "Type-ahead", "Portalled — never clipped"],
    ["Put destructive items last, separated, in red.", "Keep menus under ~8 items. Group with labels before adding submenus.", "Shortcuts shown in menus teach power users over time."],
    [["↑ ↓", "Move"], ["Enter", "Select"], ["→ / ←", "Open / close submenu"], ["Esc", "Close"]]),
  ui("context-menu", "Context Menu", "Actions", "menu", "Right-click or long-press menu for messages, files and canvas items.", ["ContextMenu"],
    ["Right-click on desktop", "Long-press on touch", "Same item types as DropdownMenu"],
    ["Context menus are invisible — always mirror their actions in a visible place.", "Use them as shortcuts for power users, never as the only path."]),
  ui("input", "Input", "Forms", "input", "Text fields with sizes, invalid state and addons for icons, text and buttons.", ["Input", "InputGroup"],
    ["Sizes 32 / 36 / 40", "Invalid state via aria-invalid", "Leading and trailing addons", "File input styling"],
    ["Labels go above inputs, never only as placeholders — placeholders disappear when typing starts.", "Focus shows a soft 4px ring plus a darker border, visible in both themes."]),
  ui("textarea", "Textarea", "Forms", "textarea", "Multi-line input with auto-resize and a character counter.", ["Textarea"],
    ["Auto-resize up to maxRows", "Counter with maxLength", "Same focus and invalid styles as Input"],
    ["Auto-resize for prompts and instructions; fixed height for short notes.", "Counters turn red at the limit instead of silently stopping input."]),
  ui("field", "Field", "Forms", "field", "Label, control, description and error wired together for screen readers.", ["Field", "Label", "FieldError"],
    ["Automatic id and aria-describedby", "Required and optional markers", "Error replaces description", "Horizontal layout for switches"],
    ["Errors say how to fix it (\"Enter a valid email\"), not just that it's wrong.", "Mark the minority: if most fields are required, label the optional ones instead."]),
  ui("checkbox", "Checkbox", "Forms", "checkbox", "Native checkbox with custom styling, labels, descriptions and an indeterminate state.", ["Checkbox"],
    ["Label and description", "Indeterminate for select-all", "Native input — works in forms", "Disabled and invalid states"],
    ["Checkboxes are for choices applied on Save. For instant on/off, use a Switch.", "The whole row is clickable, not just the 16px box."]),
  ui("radio-group", "Radio Group", "Forms", "radio-group", "One choice from a short list — default or card style.", ["RadioGroup"],
    ["Default and card variants", "Descriptions per option", "Vertical or horizontal", "Native arrow-key behaviour"],
    ["Use radios for 2–5 options that benefit from being seen at once. More than that, use a Select.", "Card style works well for plans and models where each option needs a line of explanation."]),
  ui("switch", "Switch", "Forms", "switch", "Instant on/off settings.", ["Switch"],
    ["Two sizes", "Controlled or uncontrolled", "role=\"switch\" semantics"],
    ["A switch applies immediately. If a Save button is needed, use a Checkbox.", "Pair with a Field so the label explains what \"on\" means."]),
  ui("select", "Select", "Forms", "select", "Pick one option from a list, with descriptions, icons, groups and type-ahead.", ["Select"],
    ["Descriptions and icons", "Groups and disabled options", "Type-ahead", "Width matches the trigger", "Portalled — never clipped"],
    ["For more than ~15 options, or when users know what they want, use Combobox.", "Descriptions help when option names alone are ambiguous (models, visibility)."],
    [["↑ ↓", "Move"], ["Enter", "Select"], ["Type", "Jump to option"], ["Esc", "Close"]]),
  ui("combobox", "Combobox", "Forms", "combobox", "Searchable select for long lists — single or multiple, with create-new.", ["Combobox"],
    ["Type to filter", "Multi-select with removable chips", "Create a new option", "Backspace removes the last chip", "Empty state"],
    ["Focus stays in the input the whole time, so typing never stops.", "\"Create …\" appears only when nothing matches exactly — no accidental duplicates."],
    [["↑ ↓", "Move"], ["Enter", "Choose"], ["Backspace", "Remove last chip"]]),
  ui("slider", "Slider", "Forms", "slider", "Numeric values on a track — temperature, top-p, token limits, ranges.", ["Slider"],
    ["Single value or range", "Formatted value readout", "End labels (\"Precise\" ↔ \"Creative\")", "Native keyboard support"],
    ["Label the ends in plain words. \"Temperature 0.7\" means nothing to most users; \"Precise ↔ Creative\" does.", "Show the exact value next to the label for people who do care."]),
  ui("input-otp", "Input OTP", "Forms", "input-otp", "One-time code entry with paste, auto-advance and SMS autofill.", ["InputOTP"],
    ["Paste fills every box", "Auto-advance and Backspace back", "onComplete callback", "autocomplete=\"one-time-code\"", "Grouped display"],
    ["Verify automatically when the last digit is entered — no extra button press.", "Keep the code on error so users can fix one digit instead of retyping six."]),
  ui("dialog", "Dialog", "Overlays", "dialog", "Modal for focused tasks, with header, body and footer helpers.", ["Dialog", "DialogHeader", "DialogFooter"],
    ["Focus trap and restore", "Esc and backdrop close", "Scroll lock", "Top position for palettes", "Layout helpers"],
    ["Use dialogs for short, focused tasks. Anything with lots of fields fits better in a Sheet or page.", "Put the primary action last (right) and Cancel before it."]),
  ui("alert-dialog", "Alert Dialog", "Overlays", "alert-dialog", "Confirmation for irreversible actions, with optional type-to-confirm.", ["AlertDialog"],
    ["Cancel focused by default", "Can't be dismissed by clicking outside", "Async confirm with loading", "Type-to-confirm for the most dangerous actions"],
    ["Only for actions that can't be undone. For everything else, act and offer Undo.", "Name the thing being destroyed and the consequence in the title and description."]),
  ui("sheet", "Sheet", "Overlays", "sheet", "A panel that slides in from an edge — settings, filters, mobile navigation, drawers.", ["Sheet"],
    ["Right, left or bottom", "Bottom drawer with handle", "Header and sticky footer", "Focus trap", "Enter and exit animation"],
    ["Sheets keep context visible behind them — better than dialogs for longer forms.", "On phones, prefer the bottom drawer: it's where thumbs are."]),
  ui("popover", "Popover", "Overlays", "popover", "Interactive floating panel anchored to a trigger.", ["Popover"],
    ["Flips when there's no room", "Portalled — never clipped", "Closes on outside click and Esc", "Render prop gives you close()"],
    ["Popovers hold small, optional controls. If it needs a title and Save, it's a Dialog.", "Focus returns to the trigger on close."]),
  ui("tooltip", "Tooltip", "Overlays", "tooltip", "Short labels for icon buttons and truncated text.", ["Tooltip"],
    ["Shows on hover and focus", "Top or bottom", "Start, center or end alignment"],
    ["A few words only. Never put links or buttons inside a tooltip — use HoverCard.", "Every icon-only button in this kit has one."]),
  ui("hover-card", "Hover Card", "Overlays", "hover-card", "Rich preview on hover — profiles, links, sources.", ["HoverCard"],
    ["Open and close delays", "Stays open while hovered", "Opens on keyboard focus"],
    ["Hover cards preview; they never hold the only copy of important information.", "The open delay stops cards flashing as the mouse crosses the page."]),
  ui("tabs", "Tabs", "Navigation", "tabs", "Switch between views — underline, segmented and pills.", ["Tabs"],
    ["Three variants", "Icons and badges", "Actions slot", "Arrow keys, Home, End", "Scrolls on overflow"],
    ["Tabs switch views of the same thing. For steps in a process, use a wizard.", "Underline for page sections, segmented for compact toggles, pills for filters."],
    [["← →", "Previous / next tab"], ["Home / End", "First / last tab"]]),
  ui("breadcrumb", "Breadcrumb", "Navigation", "breadcrumb", "Where you are in a hierarchy, with collapsing for long paths.", ["Breadcrumb"],
    ["Icons", "Collapses the middle with maxItems", "aria-current on the last item"],
    ["Keep the first and last items visible; the middle can collapse.", "The current page is not a link."]),
  ui("pagination", "Pagination", "Navigation", "pagination", "Page numbers with ellipses, or a simple \"Page 2 of 10\".", ["Pagination"],
    ["Smart ellipses", "Siblings count", "Simple variant", "Accessible labels"],
    ["Use pagination for tables and history. For feeds, prefer \"Load more\".", "The current page gets a border, not just colour."]),
  ui("accordion", "Accordion", "Navigation", "accordion", "Expandable sections for FAQs, settings groups and long content.", ["Accordion"],
    ["Single or multiple open", "Smooth height animation", "Card variant", "Arrow-key navigation between headers"],
    ["Don't hide critical information in an accordion — people skip closed sections.", "Open the most useful item by default."],
    [["↑ ↓", "Move between headers"], ["Enter / Space", "Toggle"]]),
  ui("collapsible", "Collapsible", "Navigation", "collapsible", "Show and hide one region with an animated height.", ["Collapsible"],
    ["Default chevron trigger", "Custom trigger via render prop", "Controlled or uncontrolled"],
    ["The building block behind Reasoning, Tool and Sources.", "Collapsed content is hidden from screen readers and the tab order."]),
  ui("card", "Card", "Data display", "card", "Bordered container with header, content and footer.", ["Card", "CardHeader", "CardContent", "CardFooter"],
    ["Title, description and action slot", "Footer with divider", "Interactive variant"],
    ["Cards group related things. Nesting cards inside cards is a sign the layout needs rethinking.", "Interactive cards get hover and focus styles so they read as clickable."]),
  ui("avatar", "Avatar", "Data display", "avatar", "User or assistant images with initials fallback, presence and stacks.", ["Avatar", "AvatarStack"],
    ["Four sizes", "Falls back when images fail", "Online / busy / offline", "Circle or square", "Stack with +N"],
    ["Use square avatars for bots and orgs, circles for people — a quiet way to tell them apart."]),
  ui("badge", "Badge", "Data display", "badge", "Short labels for status and categories.", ["Badge"],
    ["Seven tones", "Leading dot", "Two sizes", "Icon support"],
    ["Use semantic tones only when the colour carries meaning. Most badges should be neutral."]),
  ui("kbd", "Kbd", "Data display", "kbd", "Keyboard keys and shortcuts.", ["Kbd", "KbdGroup"],
    ["Single keys and combos", "Works inside tooltips and menus"],
    ["Show shortcuts where the action lives — in menus and tooltips — not in a separate help page."]),
  ui("table", "Table", "Data display", "table", "Semantic table primitives for static data.", ["Table", "TH", "TD"],
    ["Header, rows and caption", "Right-aligned tabular numbers", "Selected row style", "Horizontal scroll on small screens"],
    ["Align numbers right so digits line up.", "For sorting, filtering or selection, use DataTable."]),
  ui("data-table", "Data Table", "Data display", "data-table", "A complete table card: search, filters, sorting, selection with bulk actions, row menus, column toggles and pagination.", ["DataTable"],
    ["Search with clear button", "Faceted filters with counts", "Sortable columns (numeric-aware)", "Row selection with bulk actions", "Per-row action menu", "Show / hide columns", "Rows per page + pagination", "Sticky header", "Loading skeletons and empty states", "Compact density"],
    ["The toolbar swaps to bulk actions while rows are selected, at the same height — the table never jumps.", "Filters are dashed until active, then solid with a count, so it's obvious when data is filtered — and Reset is one click away.", "Numbers are right-aligned with tabular figures, and their sort icon sits on the left so labels stay aligned with values.", "Empty states say why it's empty (no data vs. no matches) and how to fix it.", "Row menus hold secondary actions; the row itself stays calm until hovered."]),
  ui("progress", "Progress", "Data display", "progress", "Bars and rings for known progress, plus an indeterminate bar.", ["Progress", "ProgressRing"],
    ["Determinate and indeterminate", "Label and percentage", "Tones", "Ring variant"],
    ["Use progress for measurable work (uploads, indexing). For model responses, use Loader."]),
  ui("separator", "Separator", "Data display", "separator", "Horizontal, vertical and labelled dividers.", ["Separator"],
    ["Horizontal and vertical", "Label (\"or\")", "Decorative by default"],
    ["Prefer spacing over lines. Use separators only when spacing alone doesn't group things clearly."]),
  ui("scroll-area", "Scroll Area", "Data display", "scroll-area", "Scroll container with thin scrollbars and edge fades.", ["ScrollArea"],
    ["Vertical or horizontal", "Fades only where more content exists", "Themed scrollbars", "Keyboard scrollable"],
    ["Edge fades are a quiet hint that a list continues — no \"scroll for more\" text needed."]),
  ui("spinner", "Spinner", "Data display", "spinner", "Small indicator for short, unknown waits.", ["Spinner"],
    ["Inherits colour and size", "Optional accessible label"],
    ["Spinners are for short waits in buttons and inline actions. Use Skeleton for page loads and Loader for AI responses."]),
  ui("alert", "Alert", "Data display", "alert", "Inline, persistent messages in pages and forms.", ["Alert"],
    ["Info, success, warning, danger, neutral", "Title, body and action", "Dismissible"],
    ["For AI failures (limits, credits, offline), StatusBanner ships the copy and actions for you."]),
  ui("date-picker", "Date Picker", "Forms", "date-picker", "A keyboard-first calendar with single-date and range pickers, presets and disabled days.", ["DatePicker", "DateRangePicker", "Calendar"],
    ["Single date or range", "Presets (Today, Last 7 days…)", "Min, max and disabled days", "Locale-aware names", "Full keyboard navigation", "Today marker and clear button"],
    ["Offer presets for ranges — most people want \"Last 30 days\", not two clicks on a grid.", "Start weeks on Monday by default and let locales change it.", "Show disabled days struck through so the rule is visible, not mysterious."],
    [["← → ↑ ↓", "Move a day / week"], ["PageUp / PageDown", "Change month"], ["Home / End", "Start / end of week"], ["Enter", "Select"]]),
  ui("tags-input", "Tags Input", "Forms", "tags-input", "Add values as tags — keywords, stop sequences, email invites.", ["TagsInput"],
    ["Enter or comma adds a tag", "Paste a list to add many", "Backspace twice removes the last tag", "Validation with a message", "Max count with counter", "Duplicates ignored"],
    ["Backspace selects the last tag before deleting it, so nobody loses a tag by holding the key.", "Split pasted text on commas and new lines — people paste lists from spreadsheets.", "Say why a value was rejected, right under the field."],
    [["Enter / ,", "Add tag"], ["Backspace", "Select, then remove last"]]),
  ui("number-input", "Number Input", "Forms", "number-input", "A numeric field with steppers — temperature, max tokens, seat counts.", ["NumberInput"],
    ["Min, max, step and precision", "Hold a stepper to repeat", "Shift or PageUp for ×10", "Suffix units", "Clamps on blur, not while typing"],
    ["Let people type freely and clamp on blur — fighting half-typed numbers is the most common number-field bug.", "Show the unit (\"tokens\", \"%\") next to the value, not in the label.", "Disable the stepper at the limit so the boundary is visible."],
    [["↑ ↓", "Step"], ["Shift + ↑ ↓", "Step × 10"], ["Home / End", "Min / max"]]),
  ui("resizable", "Resizable Panels", "Data display", "resizable", "Panels with draggable dividers — chat beside a canvas, files beside a preview.", ["ResizablePanels"],
    ["Horizontal or vertical", "Two or more panels", "Min sizes per panel", "Keyboard resizing", "Double-click to reset", "Large touch-friendly hit area"],
    ["Give handles a bigger invisible hit area than the 1px line — precise dragging is hard, especially on touch.", "Respect minimum sizes so a panel can never be dragged into uselessness.", "Double-click to reset is the escape hatch everyone eventually looks for."],
    [["← →", "Resize 5%"], ["Shift + ← →", "Resize 10%"], ["Home / End", "Min / max"], ["Enter", "Reset"]]),
];

/* ───────────────────────── Features for the original AI components */
const aiFeatures: Record<string, string[]> = {
  conversation: ["Sticks to bottom while streaming", "Stops following when the user scrolls up", "Jump-to-latest button", "role=\"log\" live region"],
  message: ["User bubble / full-width assistant", "Avatar, meta, header and footer slots", "Markdown prose styles", "Enter animation"],
  "prompt-input": ["Auto-grow to 10 lines", "Send / sending / stop / retry states", "Drag, drop and paste files", "Tools and model slots", "Character counter near the limit", "IME-safe Enter"],
  suggestion: ["Chips and cards", "Horizontal scroll on mobile", "Icons"],
  attachments: ["Files and image thumbnails", "Upload progress ring", "Error with retry", "Remove on hover (always on touch)"],
  "model-selector": ["Provider groups", "Descriptions and capability badges", "Search past 6 models", "Locked models route to paywall", "Full keyboard support"],
  actions: ["Copy with confirmation", "Regenerate", "Thumbs up / down (controlled)", "Read aloud and share", "Reveal on hover"],
  branch: ["Version pager (2 / 3)", "Controlled or uncontrolled", "Top or bottom pager"],
  loader: ["Dots, pulse and bars", "Shimmer status text", "Streaming cursor", "Reduced-motion safe"],
  "code-block": ["Copy, download, wrap", "Line numbers and highlights", "Built-in lightweight highlighting", "Themeable syntax tokens"],
  sources: ["Collapsed pill with favicons", "Numbered source cards", "Descriptions"],
  "inline-citation": ["Domain pill", "Hover and focus preview", "Pages through multiple sources"],
  "generated-image": ["Generating with progress", "Reserved aspect ratio", "Error with retry", "Download and expand"],
  reasoning: ["Auto-opens while thinking", "Auto-collapses when done", "\"Thought for Ns\" label", "Shimmer while streaming"],
  "chain-of-thought": ["Step timeline", "Active and pending states", "Result chips per step", "Custom step content"],
  tool: ["Six lifecycle states", "Parameters and result as JSON", "Custom result UI", "Errors open automatically"],
  confirmation: ["Title, description and fact list", "High-risk styling", "Approve, deny, always allow", "Recorded outcome"],
  plan: ["Review then run", "Live step progress", "Progress bar and count", "Edit plan action"],
  task: ["Collapsible", "File chips", "Running state"],
  queue: ["Queued messages", "Send now / remove", "To-do checklist with count"],
  artifact: ["Title, description, version", "Preview / Code tabs", "Copy, download, expand, close"],
  "web-preview": ["URL bar and reload", "Desktop / tablet / mobile widths", "Console drawer with error count", "Iframe or custom content"],
  context: ["Usage ring in the toolbar", "Warns at 80% and 95%", "Token breakdown", "Cost estimate"],
  "empty-state": ["Title, description and icon", "Slot for suggestions or the composer"],
  skeleton: ["Primitive + message + conversation skeletons", "Shimmer animation"],
  "status-banner": ["Error, rate-limit, credits, offline, content-policy", "Live countdown", "Action and dismiss", "Ready-made copy"],
  "usage-meter": ["Card or inline", "Colour thresholds at 80% and 95%", "Reset text and upgrade link"],
  "upgrade-dialog": ["Plan cards", "Monthly / yearly toggle", "Recommended and current plans", "Focus-trapped"],
  "api-key-input": ["Masked with show/hide", "Verify states", "Trims whitespace", "Last-4 confirmation"],
  "feedback-dialog": ["One-tap reasons", "Multi-select", "Optional comment"],
  "chat-sidebar": ["Search", "Pinned chats", "Date groups", "Row menu", "Footer slot"],
  toast: ["Provider + hook", "Success, error, default", "Action (Undo)", "Pause on hover", "Max three"],
  "inline-ai": ["Quick actions", "Custom instruction", "Diff review", "Accept / Retry / Discard", "Keyboard loop"],
  "command-bar": ["⌘K hotkey", "Commands with groups and shortcuts", "\"Ask AI\" row", "Keyboard navigation"],
  "generate-button": ["Idle / generating / done", "Hover to stop", "Width never changes", "Three variants"],
  "voice-input": ["Live waveform", "Timer", "Cancel and done", "Processing state"],
  confidence: ["High / medium / low badges", "Uncertain-text highlight", "Verify note"],
  memory: ["Master switch", "Search, edit, delete", "Clear all", "\"Memory updated\" chip"],
};

const latestUi = ["date-picker", "tags-input", "number-input", "resizable"];
uiEntries.forEach((e) => { if (latestUi.includes(e.slug)) e.isNew = true; });

/* ───────────────────────── Compose */
const withDefaults = (e: Entry): Entry => ({
  ...e,
  section: e.section ?? "ai",
  file: e.file ?? `components/ai/${e.slug}.tsx`,
  features: e.features ?? aiFeatures[e.slug] ?? [],
});

const order = (list: Entry[], groups: Group[]) => groups.flatMap((g) => list.filter((e) => e.group === g));

export const aiGroupsAll: Group[] = aiGroups;
export const uiGroups: Group[] = ["Actions", "Forms", "Overlays", "Navigation", "Data display"];

export const registry: Entry[] = [
  ...order([...aiEntries, ...aiEntries2, ...aiEntries3].map(withDefaults), aiGroups),
  ...order(uiEntries.map(withDefaults), uiGroups),
];

export const sections: { id: Section; title: string; groups: Group[] }[] = [
  { id: "ai", title: "AI components", groups: aiGroups },
  { id: "ui", title: "UI components", groups: uiGroups },
];

/** @deprecated use sections */
export const groups = aiGroups;
