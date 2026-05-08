import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  data,
});

const { cfnResources } = backend.data.resources;
cfnResources.amplifyDynamoDbTables["VpTokens"].timeToLiveAttribute = {
  enabled: true,
  attributeName: "expiresAt",
};