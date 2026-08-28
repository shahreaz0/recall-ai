import { Chat } from "./chat-prompt-input";

import ChatSidebar from "./chat-sidebar";

export default function ChatPage() {
  return (
    <section className="flex flex-col md:flex-row">
      <ChatSidebar />

      <main className="border-t md:border-t-0 md:border-l flex-3">
        <Chat />
      </main>
    </section>
  );
}
