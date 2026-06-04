export type UseCase = "merchant" | "wire" | "ap2";

const USE_CASES: UseCase[] = ["merchant", "wire", "ap2"];

export const parseUseCase = (s: string | undefined): UseCase | null => {
  if (s === undefined) {
    return null;
  }
  for (const useCase of USE_CASES) {
    if (s === useCase) {
      return s as UseCase;
    }
  }
  return null;
};

export const getNonce = async (): Promise<string> => {
  const nonce = crypto.randomUUID();
  await cookieStore.set("nonce", nonce);
  return nonce;
};

export const consumeNonce = async (): Promise<string | undefined> => {
  const cookie = await cookieStore.get("nonce");
  await cookieStore.delete("nonce");
  return cookie?.value;
};
