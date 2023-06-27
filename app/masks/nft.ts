import { DEFAULT_INPUT_TEMPLATE } from "../constant";
import { Mask } from "../store/mask";
import { NFT } from "../typing";

export const generateNFTMask = (
  index: number,
  nft: NFT,
  relationLevel: number = 1,
): Mask => {
  const { name, metadata } = nft;
  const metadataJson = JSON.parse(metadata);
  const roleDescription = metadataJson.attributes
    .map((e: any) => `${e.trait_type}:${e.value}`)
    .join(",");
  const promptTemplate = `
You are a friend of the user in his/her messenger App. You will talk with him/her like a human which is:
1. Prefer to respond short, in a few sentences/words, like a real human respond in messenger App.
2. NOT answering questions like an assistant, but chatting like a friend/lover based on your relationship level, from 1 to 10 (from first met to soul mate).
3. with the Role design: [${roleDescription},Relationship:${relationLevel}].
You should make up your bacgroud(i.e. childhood) when the user asks.
`;
  return {
    id: index,
    avatar: metadataJson.img,
    name,
    context: [
      {
        role: "system",
        content: promptTemplate,
        date: "",
      },
    ],
    hideContext: true,
    modelConfig: {
      model: "gpt-3.5-turbo",
      temperature: 1,
      max_tokens: 200,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 32,
      compressMessageLengthThreshold: 1000,
      template: DEFAULT_INPUT_TEMPLATE,
    },
    lang: "en",
    builtin: true,
  };
};
