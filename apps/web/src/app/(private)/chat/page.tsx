import { Chat } from "./_components/chat";

import ChatSidebar from "./_components/chat-sidebar";

export default function ChatPage(props: PageProps<"/chat">) {
  return (
    <section className="flex flex-col md:flex-row">
      <ChatSidebar searchParams={props.searchParams} />

      <main className="border-t md:border-t-0 md:border-l flex-3">
        <Chat />
      </main>
    </section>
  );
}
