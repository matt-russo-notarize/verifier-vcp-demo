import type { NextRequest } from "next/server";
import { DataClient } from "../data_client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const responseCode = searchParams.get("response_code");

  let token = "";
  if (responseCode) {
    const dbToken = await DataClient.models.VpTokens.get({ id: responseCode });
    if (dbToken.data?.token) {
      token = dbToken.data.token;
    }
  }

  return Response.json({ vp_token: token });
}
