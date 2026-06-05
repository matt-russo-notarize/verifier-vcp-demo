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

const NONCE_KEY = "nonce";
const nonceListeners = new Set<() => void>();
const notifyNonce = () => nonceListeners.forEach((listener) => listener());

export const subscribeNonce = (listener: () => void): (() => void) => {
  nonceListeners.add(listener);
  return () => nonceListeners.delete(listener);
};

export const nonceSnapshot = (): string | undefined =>
  localStorage.getItem(NONCE_KEY) ?? undefined;

export const nonceServerSnapshot = (): undefined => undefined;

export const ensureNonce = (): void => {
  if (!localStorage.getItem(NONCE_KEY)) {
    localStorage.setItem(NONCE_KEY, crypto.randomUUID());
    notifyNonce();
  }
};

export const rotateNonce = (): string | undefined => {
  const previous = localStorage.getItem(NONCE_KEY) ?? undefined;
  localStorage.setItem(NONCE_KEY, crypto.randomUUID());
  notifyNonce();
  return previous;
};
