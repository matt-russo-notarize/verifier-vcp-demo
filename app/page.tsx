"use client";
import { useState, useEffect } from "react";
import { init, type ResponseMode } from "@proof.com/proof-vc-web";
import { Block } from "./common/block";
import { PillTabs } from "./common/tabs";
import { MeshGradient } from "./common/mesh-gradient/mesh-gradient";
import { AuthForm } from "./common/auth_form";
import { MerchantCase } from "./_components/use_cases/merchant-case";
import { WireTransferCase } from "./_components/use_cases/wire-transfer-case";
import { AP2Case } from "./_components/use_cases/ap2-case";
import { ProtocolPanel } from "./_components/protocol-panel";
import { consumeNonce, getNonce, parseUseCase, type UseCase } from "./lib/util";
import {
  callbackURI,
  EnvironmentKey,
  ENVIRONMENTS,
  RESPONSE_MODES,
} from "./lib/environments";
import {
  AUTHORIZATION_METHODS,
  type AuthorizationMethod,
} from "./lib/authorization_methods";
import { authorizationRequestPreview } from "./lib/request_preview";

type Presentation = Partial<Record<UseCase, Record<string, unknown>>>;

const getInitialEnvironmentKey = (): EnvironmentKey => {
  if (typeof document !== "undefined") {
    if (/\.next\.proof\.com/.test(document.referrer)) {
      return "next";
    }
    if (/\.staging\.proof\.com/.test(document.referrer)) {
      return "staging";
    }
  }
  return "localhost";
};

export default function Home() {
  const [useCase, setUseCase] = useState<UseCase>("merchant");
  const [environmentKey, setEnv] = useState<EnvironmentKey>(
    getInitialEnvironmentKey(),
  );
  const [responseMode, setResponseMode] = useState<ResponseMode>("fragment");
  const [authzMethod, setAuthzMethod] = useState<AuthorizationMethod>("query");
  const [email, setEmail] = useState("");
  const [nonce, setNonce] = useState<string | undefined>(undefined);

  useEffect(() => {
    getNonce().then(setNonce);
  }, []);

  const fetchVPToken = async (responseCode: string): Promise<string> => {
    const request = new Request(`/api/search?response_code=${responseCode}`);
    // promise error is uncaught
    const response = await fetch(request);
    const json = await response.json();
    return json["vp_token"];
  };

  const [presentation, setPresentation] = useState<Presentation>({});

  useEffect(() => {
    const environment = ENVIRONMENTS[environmentKey].environment;
    init({
      environment,
      client_id: ENVIRONMENTS[environmentKey].clientId[useCase],
      response_mode: responseMode,
      callback_uri: callbackURI(environment, responseMode),
      use_pushed_authorization_request: authzMethod === "pushed",
    });
  }, [useCase, environmentKey, responseMode, authzMethod]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const state = params.get("state") ?? undefined;
    const responseCode = params.get("response_code");
    const vpToken = params.get("vp_token");

    const resolveToken = vpToken
      ? Promise.resolve(vpToken)
      : responseCode
        ? fetchVPToken(responseCode)
        : Promise.resolve(null);

    resolveToken.then((token) => {
      if (!token) {
        return;
      }
      consumeNonce().then((nonce) =>
        fetch("/api/verify_vp_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vp_token: token, nonce }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`verification failed: ${response.status}`);
            }
            return response.json() as Promise<Record<string, unknown>>;
          })
          .then((result) => {
            const useCase = parseUseCase(state);
            if (useCase) {
              setUseCase(useCase);
              setPresentation({ [useCase]: result });
            }
          }),
      );
    });
  }, []);

  const [dismissed, setDismissed] = useState<Set<UseCase>>(new Set());
  const showSuccess = !!presentation[useCase] && !dismissed.has(useCase);
  const handleDismissSuccess = () =>
    setDismissed((prev) => new Set(prev).add(useCase));

  const { endpoint, params: requestParams } = authorizationRequestPreview({
    environmentKey,
    useCase,
    responseMode,
    pushedAuthorization: authzMethod === "pushed",
    nonce,
    loginHint: email,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <MeshGradient />
      <main className="flex w-full max-w-6xl flex-1 flex-col px-2 pt-6 pb-6 sm:px-6 sm:pt-16">
        <div className="px-2 sm:px-0">
          <h1 className="sr-only">Proof</h1>
          <img
            className="mt-0 mb-6 h-8 w-auto self-start sm:mt-4 sm:mb-4 sm:h-12"
            src="/proof-logo-full-white.svg"
            alt=""
            aria-hidden="true"
          />
          <p>Demo Proof’s verifiable credential presentation.</p>
        </div>
        <div className="mt-6 mb-0 sm:mt-8 sm:mb-4">
          <PillTabs
            tabs={[
              { key: "merchant", label: "Payment" },
              { key: "wire", label: "Wire Transfer" },
              { key: "ap2", label: "Agent Authorization" },
            ]}
            selectedTab={useCase}
            onChange={setUseCase}
          />
        </div>
        <div className="mt-4 grid w-full grid-cols-1 items-start gap-4 md:grid-cols-[3fr_5fr]">
          <Block
            title={
              useCase === "merchant"
                ? "Verified Payment"
                : useCase === "wire"
                  ? "Wire Transfer"
                  : "Agent Authorization"
            }
          >
            <div>
              {useCase === "merchant" && (
                <MerchantCase
                  showSuccess={showSuccess}
                  onDismiss={handleDismissSuccess}
                />
              )}
              {useCase === "wire" && (
                <WireTransferCase
                  showSuccess={showSuccess}
                  onDismiss={handleDismissSuccess}
                />
              )}
              {useCase === "ap2" && (
                <AP2Case
                  showSuccess={showSuccess}
                  onDismiss={handleDismissSuccess}
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="my-4 border-t-2 border-gray-300 pt-2 text-lg font-bold">
                {useCase === "wire"
                  ? "Authorize your wire transfer"
                  : useCase === "ap2"
                    ? "Authorize the agent to shop"
                    : "Authorize your purchase"}
              </h2>
              <AuthForm
                useCase={useCase}
                email={email}
                onEmailChange={setEmail}
                nonce={nonce}
              />
            </div>
          </Block>

          <Block id="protocol-block" title="Protocol">
            <ProtocolPanel
              presentation={presentation[useCase] ?? null}
              requestParams={requestParams}
              endpoint={endpoint}
            />
          </Block>
        </div>
      </main>
      <footer className="flex w-full items-center justify-center px-3 pt-4 pb-2 text-xs text-gray-400 backdrop-blur sm:px-6 sm:py-4 sm:pt-6 sm:text-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-4">
          <div className="mb-2 text-center">
            © 2026. Notarize, Inc. dba Proof.com. All&nbsp;rights&nbsp;reserved.
          </div>
          <div className="mb-2">
            <a
              href="https://www.proof.com/legal/general-terms"
              className="ml-4 text-gray-400 transition-colors hover:text-gray-200"
            >
              General Terms
            </a>
            <a
              href="https://www.proof.com/legal/privacy-policy"
              className="ml-4 text-gray-400 transition-colors hover:text-gray-200"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.proof.com/about/accessibility"
              className="ml-4 text-gray-400 transition-colors hover:text-gray-200"
            >
              Accessibility
            </a>
          </div>
          <select
            name="environments"
            aria-label="Endpoint environment:"
            value={environmentKey}
            onChange={(e) => setEnv(e.target.value as EnvironmentKey)}
            className="pointer-cursor mb-2 bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
          >
            {(Object.keys(ENVIRONMENTS) as EnvironmentKey[]).map((key) => (
              <option key={key} value={key}>
                {ENVIRONMENTS[key].label}
              </option>
            ))}
          </select>
          <select
            name="responseMode"
            aria-label="Response mode:"
            value={responseMode}
            onChange={(e) => setResponseMode(e.target.value as ResponseMode)}
            className="pointer-cursor mb-2 bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
          >
            {RESPONSE_MODES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            name="authzMethod"
            aria-label="Authorization method:"
            value={authzMethod}
            onChange={(e) =>
              setAuthzMethod(e.target.value as AuthorizationMethod)
            }
            className="pointer-cursor mb-2 bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
          >
            {(Object.keys(AUTHORIZATION_METHODS) as AuthorizationMethod[]).map(
              (key) => (
                <option key={key} value={key}>
                  {AUTHORIZATION_METHODS[key].label}
                </option>
              ),
            )}
          </select>
        </div>
      </footer>
    </div>
  );
}
