import { type Environment, type ResponseMode } from "@proof.com/proof-vc-web";

export const RESPONSE_MODES: Array<ResponseMode> = ["fragment", "direct_post"];
export type EnvironmentKey = "localhost" | "next" | "staging" | "fairfax";
type UseCaseMap = { merchant: string; ap2: string; wire: string };
export const ENVIRONMENTS: Record<
  EnvironmentKey,
  {
    label: string;
    environment: Environment;
    clientId: UseCaseMap;
    clientSecret: UseCaseMap;
  }
> = {
  localhost: {
    label: "localhost",
    environment: "localhost",
    clientId: { merchant: "cay6ej55p", ap2: "cay6ej55p", wire: "cay6ej55p" },
    clientSecret: {
      merchant: "779b9042-24be-4af6-998a-e697e1d1af2c",
      ap2: "779b9042-24be-4af6-998a-e697e1d1af2c",
      wire: "779b9042-24be-4af6-998a-e697e1d1af2c",
    },
  },
  next: {
    label: "Next",
    environment: "next",
    clientId: { merchant: "caxdw5a7d", ap2: "cabd569jn", wire: "ca3ng8pbd" },
    clientSecret: {
      merchant: "5cd353a6-b880-49f3-b2c3-59aa800351b2",
      ap2: "f2d592a4-792d-425c-b4e6-a22706b39364",
      wire: "23860ce8-a862-4ad9-87c2-95c81d5f2a9e",
    },
  },
  staging: {
    label: "Staging",
    environment: "staging",
    clientId: { merchant: "cazd76bjn", ap2: "carn6kbzd", wire: "cagnkmwyn" },
    clientSecret: {
      merchant: "3235c645-7bd1-42b8-81f5-2145312fe6a4",
      ap2: "b0d73eed-2acc-4dff-bb07-b2fc47a0a433",
      wire: "fe21458a-fa1f-47f2-93e0-223e9c25a99d",
    },
  },
  fairfax: {
    label: "Fairfax",
    environment: "sandbox",
    clientId: { merchant: "caqnb6rwn", ap2: "ca6nob9jd", wire: "camdrbpxd" },
    clientSecret: { merchant: "", ap2: "", wire: "" },
  },
};

export const callbackURI = (
  environment: Environment,
  responseMode: ResponseMode,
): string => {
  if (environment === "localhost") {
    return responseMode === "fragment"
      ? "http://localhost:3050"
      : "http://localhost:3050/api/verify";
  } else {
    return responseMode === "fragment"
      ? "https://demo.next.proof.com"
      : "https://demo.next.proof.com/api/verify";
  }
};
