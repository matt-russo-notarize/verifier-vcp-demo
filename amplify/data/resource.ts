import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  VpTokens: a
    .model({
      token: a.string(),
      expiresAt: a.timestamp()
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
