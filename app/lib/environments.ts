export type Environment = "next" | "staging" | "fairfax";
export type ClientApplication = {
  clientId: string,
  clientSecret: string,
};

export const ENVIRONMENTS: Record<
  Environment,
  {
    label: string;
    hostname: string;
    clientApps: { merchant: ClientApplication; ap2: ClientApplication; wire: ClientApplication };
  }
> = {
  next: {
    label: "Next",
    hostname: "https://api.next.proof.com",
    clientApps: {
      merchant: {
        clientId: "caxdw5a7d",
        clientSecret: "5cd353a6-b880-49f3-b2c3-59aa800351b2"
      },
      ap2: {
        clientId: "cabd569jn",
        clientSecret: "f2d592a4-792d-425c-b4e6-a22706b39364"
      },
      wire: {
        clientId: "ca3ng8pbd",
        clientSecret: "23860ce8-a862-4ad9-87c2-95c81d5f2a9e"
      }
    },
  },
  staging: {
    label: "Staging",
    hostname: "https://api.staging.proof.com",
    clientApps: {
      merchant: {
        clientId: "cazd76bjn",
        clientSecret: ""
      },
      ap2: {
        clientId: "carn6kbzd",
        clientSecret: ""
      },
      wire: {
        clientId: "cagnkmwyn",
        clientSecret: ""
      }
    },
  },
  fairfax: {
    label: "Fairfax",
    hostname: "https://api.fairfax.proof.com",
    clientApps: {
      merchant: {
        clientId: "caqnb6rwn",
        clientSecret: ""
      },
      ap2: {
        clientId: "ca6nob9jd",
        clientSecret: ""
      },
      wire: {
        clientId: "camdrbpxd",
        clientSecret: ""
      }
    },
  },
};

export const AUTHORIZATION_ENDPOINT =
  "/verifiable-credentials/v1/presentation/authorize";
export const PUSHED_AUTHORIZATION_ENDPOINT =
  "/verifiable-credentials/v1/presentation/par";

export const REDIRECT_URI = "https://demo.next.proof.com/";
export const RESPONSE_URI = "https://demo.next.proof.com/api/verify";
