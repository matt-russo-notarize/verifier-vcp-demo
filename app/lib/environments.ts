import { type Environment, type ResponseMode } from "@proof.com/proof-vc-web";

export const RESPONSE_MODES: Array<ResponseMode> = ["fragment", "direct_post"];
export type EnvironmentKey = "localhost" | "next" | "staging" | "fairfax";
export const ENVIRONMENTS: Record<
  EnvironmentKey,
  {
    label: string;
    environment: Environment;
    clientId: { merchant: string; ap2: string; wire: string };
  }
> = {
  localhost: {
    label: "localhost",
    environment: "localhost",
    clientId: { merchant: "cay6ej55p", ap2: "cay6ej55p", wire: "cay6ej55p" },
  },
  next: {
    label: "Next",
    environment: "next",
    clientId: { merchant: "caxdw5a7d", ap2: "cabd569jn", wire: "ca3ng8pbd" },
  },
  staging: {
    label: "Staging",
    environment: "staging",
    clientId: { merchant: "cazd76bjn", ap2: "carn6kbzd", wire: "cagnkmwyn" },
  },
  fairfax: {
    label: "Fairfax",
    environment: "sandbox",
    clientId: { merchant: "caqnb6rwn", ap2: "ca6nob9jd", wire: "camdrbpxd" },
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
