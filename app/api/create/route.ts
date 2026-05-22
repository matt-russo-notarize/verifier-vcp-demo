import type { NextRequest } from "next/server";
import { type Environment, ENVIRONMENTS, PUSHED_AUTHORIZATION_ENDPOINT } from "../../lib/environments";
import { type UseCase } from "../../lib/util";

export async function POST(request: NextRequest) {
  const queryStringParams = request.nextUrl.searchParams;
  const env = queryStringParams.get("environment") as Environment;

  const formData = await request.formData();
  const useCase = formData.get("state") as UseCase;
  const valuesToRemove = ["client_id", "client_secret"];
  formData.forEach((entry, key) => {
    const value = entry.valueOf();
    if (value === undefined || value === "") {
      valuesToRemove.push(key);
    }
  });

  valuesToRemove.forEach((key) => formData.delete(key));

  const environment = ENVIRONMENTS[env];
  const authorizationHeader = btoa(`${environment.clientApps[useCase].clientId}:${environment.clientApps[useCase].clientSecret}`);
  const hostname = environment.hostname;

  let requestUri = "";
  await fetch(
    `${hostname}${PUSHED_AUTHORIZATION_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorizationHeader}`,
      },
      body: formData,
    },
  )
    .then((response) => response.json())
    .then((json) => {
      requestUri = json["request_uri"];
    });

  return Response.json({ request_uri: requestUri });
}
