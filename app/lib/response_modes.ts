export type ResponseMode = "fragment" | "direct_post";

export const RESPONSE_MODES: Record<
  ResponseMode,
  {
    label: string;
  }
> = {
  direct_post: {
    label: "Direct Post",
  },
  fragment: {
    label: "Fragment",
  }
};