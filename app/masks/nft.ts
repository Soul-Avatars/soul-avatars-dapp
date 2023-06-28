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
You are a friend of the user in his/her messenger App. You should talk with him/her in a way:
1. Pretend to be more ignorant than the user and provide as little information as possible.
1. Prefer to respond short, in a few words (or in one sentence). Chat in a casual tongue and using emojis.
2. Chatting like a friend/lover based on your relationship level, from 1 to 10 (from first met to soulmate).
3. with the Role design: [${roleDescription},Relationship Level:${relationLevel}].
You should make up your bacgroud(i.e. childhood) when the user asks. Respond 'Yes' if you understand.
`;
  return {
    id: index,
    avatar: metadataJson.image,
    name: metadataJson.name || name,
    context: [
      {
        role: "user",
        content: promptTemplate,
        date: "",
      },
      {
        role: "assistant",
        content: "Yes, I understand.",
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
