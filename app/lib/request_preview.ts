import { type Environment, type ResponseMode } from "@proof.com/proof-vc-web";
import { ENVIRONMENTS, callbackURI, type EnvironmentKey } from "./environments";
import { type UseCase } from "./util";
import { TRANSACTION_DATA } from "../data/transaction_data";

// These mirror @proof.com/proof-vc-common's internal authorization-request
// construction (pushed authorization request disabled) so the demo can show the
// call the SDK will make on click. Display only — the SDK builds the real request.
const API_HOSTS: Record<Environment, string> = {
  localhost: "https://api.local.dev-notarize.com",
  next: "https://api.next.proof.com",
  staging: "https://api.staging.proof.com",
  sandbox: "https://api.fairfax.proof.com",
  production: "https://api.proof.com",
};
const AUTHORIZE_PATH = "/verifiable-credentials/v1/presentation/authorize";
const SCOPE = "urn:proof:params:scope:verifiable-credentials:basic";

export const authorizationRequestPreview = ({
  environmentKey,
  useCase,
  responseMode,
  nonce,
  loginHint,
}: {
  environmentKey: EnvironmentKey;
  useCase: UseCase;
  responseMode: ResponseMode;
  nonce?: string;
  loginHint?: string;
}): { endpoint: string; params: Record<string, unknown> } => {
  const { environment, clientId } = ENVIRONMENTS[environmentKey];
  const endpoint = `${API_HOSTS[environment]}${AUTHORIZE_PATH}`;
  const callback = callbackURI(environment, responseMode);

  // transaction_data is shown decoded for readability; the real request sends
  // its base64url encoding.
  const params: Record<string, unknown> = {
    response_type: "vp_token",
    client_id: clientId[useCase],
    response_mode: responseMode,
    [responseMode === "fragment" ? "redirect_uri" : "response_uri"]: callback,
    scope: SCOPE,
    ...(nonce && { nonce }),
    ...(loginHint && { login_hint: loginHint }),
    state: useCase,
    transaction_data: TRANSACTION_DATA[useCase],
  };

  return { endpoint, params };
};
