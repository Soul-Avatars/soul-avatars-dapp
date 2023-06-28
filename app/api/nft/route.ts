import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";

const chain_id_goerli = 5;
const nft_contract_address = "0x96FCa6B25B01C8baB624c460490b3f018886018E";

let lastFetchTime = new Date().getTime();
let lastFetchData: any = null;

const Auth = Buffer.from(
  process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_KEY_SECRET,
).toString("base64");

async function handle() {
  try {
    if (lastFetchData && lastFetchTime + 1000 * 60 > new Date().getTime()) {
      console.log("[NFT Route] return cached data");
      return NextResponse.json(lastFetchData);
    }

    console.log("[NFT Route] fetch data from infura");
    const res = await fetch(
      `https://nft.api.infura.io/networks/${chain_id_goerli}/nfts/${nft_contract_address}/owners`,
      {
        headers: {
          Authorization: `Basic ${Auth}`,
        },
      },
    );
    lastFetchData = await res.json();
    lastFetchTime = new Date().getTime();
    return NextResponse.json(lastFetchData);
  } catch (e) {
    console.error("[NFT Query] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
