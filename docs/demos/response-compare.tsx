import * as React from "react";
import { ResponseCompare, type Preference } from "../../src";

export function Default() {
  const [v, setV] = React.useState<Preference>(null);
  return (
    <div className="w-full">
      <ResponseCompare
        value={v}
        onValueChange={setV}
        a={{ model: "Swift Pro", content: <p>Ship Friday behind a feature flag. You get the release out this week and can switch it off instantly if something breaks, without a redeploy.</p> }}
        b={{ model: "Nova (preview)", content: <p>Wait until Monday. Friday releases leave fewer people around to respond if the checkout flow misbehaves over the weekend.</p> }}
      />
      {v && <button className="mt-3 text-sm text-fg-muted underline" onClick={() => setV(null)}>Reset vote</button>}
    </div>
  );
}
