export type AuthorizationMethod = "query" | "pushed";

export const AUTHORIZATION_METHODS: Record<
  AuthorizationMethod,
  {
    label: string;
  }
> = {
  query: {
    label: "Query String",
  },
  pushed: {
    label: "Pushed",
  },
};
