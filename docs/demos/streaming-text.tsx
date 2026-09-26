import * as React from "react";
import { StreamingText, Button } from "../../src";
import { RotateCcw } from "lucide-react";

const ANSWER = `Here's a quick plan for your launch week:

## Before launch
- Finish the **pricing page** and test checkout end to end
- Record a 60-second demo — show the *outcome*, not the settings
- Line up 5 friendly users to post first-day feedback

## Launch day
1. Post on Product Hunt at 12:01 AM PT
2. Share the story behind it, not just the features
3. Reply to every comment within the hour

Keep \`#launch\` open in Slack so the whole team can jump on questions.`;

function useFakeStream(text: string, run: number) {
  const [out, setOut] = React.useState("");
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    setOut(""); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      // Bursty chunks like a real stream
      i = Math.min(text.length, i + Math.floor(Math.random() * 18) + 2);
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, 70 + Math.random() * 90);
    return () => clearInterval(t);
  }, [text, run]);
  return { out, done };
}

export function Default() {
  const [run, setRun] = React.useState(0);
  const { out, done } = useFakeStream(ANSWER, run);
  return (
    <div className="w-full max-w-xl space-y-4">
      <StreamingText text={out} isStreaming={!done} />
      <Button size="sm" variant="outline" onClick={() => setRun((r) => r + 1)}><RotateCcw />Replay</Button>
    </div>
  );
}

export function PlainText() {
  const { out, done } = useFakeStream("Plain mode skips markdown — useful for short replies, titles and voice captions.", 0);
  return <div className="w-full max-w-md"><StreamingText text={out} isStreaming={!done} markdown={false} /></div>;
}
