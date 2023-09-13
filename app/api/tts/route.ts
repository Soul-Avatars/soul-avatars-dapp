import { NextRequest, NextResponse } from "next/server";
import { prettyObject } from "@/app/utils/format";

const voiceMap: Record<string, string> = {
  Zachary: "zh-CN-YunxiNeural",
  Max: "zh-CN-YunxiNeural",
  Oliver: "zh-CN-YunfengNeural",
  Nora: "zh-CN-YunhaoNeural",
  Ryan: "zh-CN-YunhaoNeural",
  William: "zh-CN-YunyegNeural",
  Liam: "zh-CN-YunyeNeural",
  Logan: "zh-CN-YunyangNeural",
  Daniel: "zh-CN-YunjianNeural",
  Chloe: "zh-CN-XiaoshuangNeural",
  Noah: "zh-CN-XiaoshuangNeural",
  Alice: "zh-CN-XiaoyiNeural",
  Mia: "zh-CN-XiaoyiNeural",
  Sophia: "zh-CN-XiaoyanNeural",
  Emma: "zh-CN-XiaochenNeural",
  Grace: "zh-CN-XiaozhenNeural",
  Harper: "zh-CN-XiaozhenNeural",
  Madison: "zh-CN-XiaomoNeural",
  Ava: "zh-CN-XiaohanNeural",
  Sophie: "zh-CN-XiaoxuanNeural",
  Olivia: "zh-CN-XiaoxiaoNeural",
  Alex: "zh-CN-XiaomengNeural",
  Lily: "zh-CN-XiaohanNeural",
  Ling: "zh-CN-XiaohanNeural",
};

async function requestAzure(name: string, text: string) {
  try {
    if (!text) {
      throw new Error("Text parameter is required.");
    }
    const speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural";
    const endpoint = `https://${process.env.TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `<speak version='1.0' xml:lang='en-US'>
    <voice xml:lang='en-US' name='${
      voiceMap[name] || speechSynthesisVoiceName
    }'>
        ${text}
    </voice>
  </speak>`;

    const headers = {
      "Ocp-Apim-Subscription-Key": process.env.TTS_KEY || "",
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
      "User-Agent": "curl",
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: ssml,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to synthesize speech. Status: ${response.status} ${response.statusText}`,
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(audioBuffer).toString("base64");
    return base64Data;
  } catch (error) {
    throw new Error("Something went wrong.");
  }
}

async function handle(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  try {
    const { name, text } = await req.json();
    const res = await requestAzure(name, text);
    return NextResponse.json({ audioBase64: res });
  } catch (e) {
    console.error("[TTS] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
