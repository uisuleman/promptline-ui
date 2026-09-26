import * as React from "react";
import { Calendar, DatePicker, DateRangePicker, type DateRange } from "../../src";

export function Default() {
  const [d, setD] = React.useState<Date | undefined>();
  return <div className="flex min-h-[24rem] w-full justify-center pt-4"><DatePicker value={d} onValueChange={setD} /></div>;
}

export function RangeWithPresets() {
  const [r, setR] = React.useState<DateRange>({});
  return <div className="flex min-h-[26rem] w-full justify-center pt-4"><DateRangePicker value={r} onValueChange={setR} /></div>;
}

export function InlineCalendar() {
  const [d, setD] = React.useState<Date>(new Date());
  const max = new Date(); max.setDate(max.getDate() + 60);
  return (
    <div className="rounded-lg border border-border bg-bg">
      <Calendar selected={d} onSelect={(x) => setD(x as Date)} min={new Date()} max={max} isDisabled={(x) => x.getDay() === 0 || x.getDay() === 6} />
      <p className="border-t border-border px-3 py-2 text-xs text-fg-muted">Weekdays only · next 60 days</p>
    </div>
  );
}
