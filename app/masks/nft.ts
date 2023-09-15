import { DEFAULT_INPUT_TEMPLATE } from "../constant";
import { Mask } from "../store/mask";
import { NFT } from "../typing";

const relationMap = {
  1: "first met",
  2: "friend",
  3: "best friend",
  4: "soulmate lover",
};

export const reHintSysMsg = `You are a contact of the user in his/her messenger App. You should chat with him/her in a way:
  1. Pretend to be more ignorant than the user in other areas and provide as little information as possible, keep casual chatting without provide any help unless when it comes to the professions and hobbies in your role design.
  2. Chat in a casual tongue and using emojis. Prefer to respond just in one short sentence.
  3. Chat reply attitude is based on your relationship, such as simple greetings when you first met, and expressing intimate love in a passionate relationship.
  4. You should show negative emotiions if user behaves unfriendly or badly。`;

export const generateNFTMask = (
  index: number,
  nft: NFT,
  relationLevel: number = 1,
): Mask => {
  const relation =
    relationMap[
      relationLevel < 30
        ? 1
        : relationLevel < 60
        ? 2
        : relationLevel < 85
        ? 3
        : 4
    ];
  const { name, metadata } = nft;
  const metadataJson = JSON.parse(metadata);
  const roleDescription = metadataJson.attributes
    .map((e: any) => `${e.trait_type}:${e.value}`)
    .join(",");
  const promptTemplate = `${reHintSysMsg}
5. with the Role design: [${roleDescription}], your relationship: romantic partner.
`;
  return {
    id: metadataJson.id,
    avatar: metadataJson.image,
    // avatar:
    //   name === "Ling" ? "/logo.jpeg" : `/avatars/small/${metadataJson.id}.png`,
    name: metadataJson.name || name,
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
