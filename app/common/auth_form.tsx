"use client";
import { useId, useRef, useState } from "react";
import { clsx } from "clsx";

import { Button } from "./button";
import { AuthorizationMethod } from "../lib/authorization_methods";
import { AUTHORIZATION_ENDPOINT, type Environment } from "../lib/environments";

async function generateTransactionUrl({
  hostname,
  environment,
  requestParams,
  authzMethod,
}: {
  hostname: string;
  environment: Environment;
  requestParams: Record<string, string>;
  authzMethod: AuthorizationMethod;
}) {
  const requestBody = new URLSearchParams(requestParams);
  const valuesToRemove: string[] = [];
  requestBody.forEach((entry, key) => {
    const value = entry.valueOf();
    if (value === undefined || value === "undefined") {
      valuesToRemove.push(key);
    }
  });

  valuesToRemove.forEach((key) => requestBody.delete(key));

  if (authzMethod === "query") {
    return `${hostname}${AUTHORIZATION_ENDPOINT}?${requestBody}`;
  } else {
    const request = new Request(`/api/create?environment=${environment}`);
    return await fetch(request, {
      method: "POST",
      body: requestBody,
    })
      .then((response) => response.json())
      .then((json) => {
        const requestUri = json["request_uri"];
        return `${hostname}${AUTHORIZATION_ENDPOINT}?request_uri=${requestUri}&client_id=${requestParams.client_id}`;
      });
  }
}

// Collects the user's email and initiates the OID4VP authorization flow
export function AuthForm({
  email,
  setEmail,
  environment,
  requestParams,
  hostname,
  authzMethod,
}: {
  email: string;
  setEmail: (email: string) => void;
  environment: Environment;
  requestParams: Record<string, string>;
  hostname: string;
  authzMethod: AuthorizationMethod;
}) {
  const emailErrorId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  // Redirects to <endpoint> with <requestParams> as query parameters
  const handleAuthorize = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setShowEmailError(true);
      emailRef.current?.focus();
      return;
    }
    setIsLoading(true);

    await generateTransactionUrl({ hostname, environment, requestParams, authzMethod }).then(
      (transactionUrl) => {
        window.location.href = transactionUrl;
      },
    );
  };

  return (
    <form onSubmit={handleAuthorize}>
      <label htmlFor="email" className="mb-4 flex flex-col gap-1">
        <span className="mb-2 text-base font-bold">
          Email <span className="text-red-400">*</span>
        </span>
        <input
          ref={emailRef}
          aria-required="true"
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          aria-invalid={showEmailError}
          value={email}
          aria-describedby={showEmailError ? emailErrorId : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (showEmailError) {
              setShowEmailError(false);
            }
          }}
          onBlur={() => {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!isValidEmail) {
              setShowEmailError(true);
            }
          }}
          placeholder="you@email.com"
          className={clsx(
            "w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-base text-white placeholder-gray-400 transition-colors",
            showEmailError && "border-red-400",
          )}
        />
        <div role="alert" aria-live="polite">
          {showEmailError && (
            <span id={emailErrorId} className="text-xs text-red-400">
              Enter a valid email address
            </span>
          )}
        </div>
      </label>
      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="w-full"
      >
        {isLoading ? "Authorizing..." : "Authorize"}
      </Button>
      <div className="mt-2">
        <p className="text-xs/5 font-light text-gray-400">
          By clicking &quot;Authorize,&quot; you are agreeing to{" "}
          <a
            href="https://www.proof.com/legal/general-terms"
            className="underline hover:text-gray-200"
          >
            General Terms
          </a>
          . For information on our privacy and data use practices please see{" "}
          <a
            href="https://www.proof.com/legal/privacy-policy"
            className="underline hover:text-gray-200"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}
