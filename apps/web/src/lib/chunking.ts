import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
  separators: [" "],
});

export async function splitText(text: string) {
  return splitter.splitText(text);
}
