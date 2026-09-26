import * as React from "react";
import { Bot } from "lucide-react";
import { Avatar, AvatarStack } from "../../src";
import { imageThumb } from "./_data";

export function Default() {
  return (
    <div className="flex items-center gap-4">
      <Avatar src={imageThumb} fallback="SK" size="lg" />
      <Avatar fallback="MA" size="lg" status="online" />
      <Avatar fallback="JC" status="busy" />
      <Avatar fallback={<Bot className="size-4" />} shape="square" />
      <Avatar src="broken.png" fallback="FB" size="sm" status="offline" />
    </div>
  );
}

export function Stack() {
  return <AvatarStack max={4} avatars={["SK", "MA", "JC", "BO", "EL", "HS"].map((f) => ({ fallback: f }))} />;
}
