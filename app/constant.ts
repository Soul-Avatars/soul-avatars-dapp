export const OWNER = "Yidadaa";
export const REPO = "ChatGPT-Next-Web";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";
export const DEFAULT_API_HOST = "https://chatgpt1.nextweb.fun/api/proxy";

export enum Path {
  Landing = "/",
  Home = "/home",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",
  Auth = "/auth",
  Profile = "/profile",
}

export enum SlotID {
  AppBody = "app-body",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
}

export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "ak-";

export const LAST_INPUT_KEY = "last-input";

export const REQUEST_TIMEOUT_MS = 60000;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2021-09
Current model: {{model}}
Current time: {{time}}`;

export enum ChainName {
  Goerli = "Goerli",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
}

export const allVoices: Record<string, string> = {
  Xiaochen: "zh-CN-XiaochenNeural (Female)",
  Xiaohan: "zh-CN-XiaohanNeural (Female)",
  Xiaomeng: "zh-CN-XiaomengNeural (Female)",
  Xiaomo: "zh-CN-XiaomoNeural (Female)",
  Xiaoqiu: "zh-CN-XiaoqiuNeural (Female)",
  Xiaorui: "zh-CN-XiaoruiNeural (Female)",
  Xiaoshuang: "zh-CN-XiaoshuangNeural (Female, Child)",
  Xiaoxiao: "zh-CN-XiaoxiaoNeural (Female)",
  Xiaoxuan: "zh-CN-XiaoxuanNeural (Female)",
  Xiaoyuan: "zh-CN-XiaoyuanNeural (Female)",
  Xiaoyi: "zh-CN-XiaoyiNeural (Female)",
  Xiaoyou: "zh-CN-XiaoyouNeural (Female, Child)",
  Xiaozhen: "zh-CN-XiaozhenNeural (Female)",
  Yunfeng: "zh-CN-YunfengNeural (Male)",
  Yunhao: "zh-CN-YunhaoNeural (Male)",
  Yunjian: "zh-CN-YunjianNeural (Male)",
  Yunxia: "zh-CN-YunxiaNeural (Male)",
  Yunxi: "zh-CN-YunxiNeural (Male)",
  Yunyang: "zh-CN-YunyangNeural (Male)",
  Yunye: "zh-CN-YunyeNeural (Male)",
  Yunze: "zh-CN-YunzeNeural (Male)",
};
