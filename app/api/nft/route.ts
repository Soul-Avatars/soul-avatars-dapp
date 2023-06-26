import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";

const chain_id_goerli = 5;
const nft_contract_address = "0x619DC42967E6220A5762ee2554eD2E57d8515A98";

const Auth = Buffer.from(
  process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_KEY_SECRET,
).toString("base64");

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[NFT Route] params ", params);

  try {
    return await fetch(
      `https://nft.api.infura.io/networks/${chain_id_goerli}/nfts/${nft_contract_address}/owners`,
      {
        headers: {
          Authorization: `Basic ${Auth}`,
        },
      },
    );
  } catch (e) {
    console.error("[NFT Query] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
