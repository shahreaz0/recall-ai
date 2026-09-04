import { Chat } from "./_components/chat";

import { Conversations } from "./_components/conversations";
import { DocumentsManager } from "./_components/documents-manager";

export default function ChatPage(props: PageProps<"/chat">) {
  return (
    <section className="flex flex-col md:flex-row">
      <Conversations searchParams={props.searchParams} />
      <main className="border-x md:border-t-0 px-4 md:border-l flex-3">
        <Chat />
      </main>

      <DocumentsManager searchParams={props.searchParams} />
    </section>
  );
}
