import * as React from "react";
import { Queue, type QueuedMessage, type Todo } from "../../src";

export function Default() {
  const [messages, setMessages] = React.useState<QueuedMessage[]>([
    { id: "1", text: "Also add dark mode to the settings page" },
    { id: "2", text: "Use the brand colour for the primary button" },
  ]);
  const [todos, setTodos] = React.useState<Todo[]>([
    { id: "a", text: "Create settings layout", done: true },
    { id: "b", text: "Add profile form", done: true },
    { id: "c", text: "Wire up save action" },
    { id: "d", text: "Write tests" },
  ]);
  return (
    <Queue
      className="w-full max-w-md"
      messages={messages}
      todos={todos}
      onRemove={(id) => setMessages((m) => m.filter((x) => x.id !== id))}
      onSendNow={(id) => setMessages((m) => m.filter((x) => x.id !== id))}
      onToggleTodo={(id) => setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))}
    />
  );
}
