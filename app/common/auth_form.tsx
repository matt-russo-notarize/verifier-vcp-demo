"use client";
import { useId, useState } from "react";
import "@proof.com/proof-vc-web";
import { clsx } from "clsx";
import { type UseCase } from "@/app/lib/util";
import { TRANSACTION_DATA } from "@/app/data/transaction_data";

// Collects the user's email and initiates the OID4VP authorization flow
export function AuthForm({
  useCase,
  email,
  onEmailChange,
  nonce,
}: {
  useCase: UseCase;
  email: string;
  onEmailChange: (value: string) => void;
  nonce?: string;
}) {
  const emailErrorId = useId();
  const [showEmailError, setShowEmailError] = useState(false);
  const transactionData = TRANSACTION_DATA[useCase];

  return (
    <>
      <label htmlFor="email" className="flex flex-col gap-1">
        <span className="mb-2 text-base font-bold">
          Email <span className="text-red-400">*</span>
        </span>
        <input
          aria-required="true"
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          aria-invalid={showEmailError}
          value={email}
          aria-describedby={showEmailError ? emailErrorId : undefined}
          onChange={(e) => {
            onEmailChange(e.target.value);
            if (showEmailError) {
              setShowEmailError(false);
            }
          }}
          onBlur={() => {
            if (email) {
              const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
              if (!isValidEmail) {
                setShowEmailError(true);
              }
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

      {nonce && (
        <proof-verify-id
          nonce={nonce}
          state={useCase}
          size="medium"
          login-hint={email}
          transactionData={transactionData}
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        />
      )}

      <div className="mt-2">
        <p className="text-xs/5 font-light text-gray-400">
          By clicking &quot;Continue with Proof,&quot; you are agreeing to{" "}
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
    </>
  );
}
