export default {
  region: 'eu-central-1',
  IdentityPoolId: 'machination-backend-cognito-dev',
  UserPoolId: '$USER_POOL_ID',
  ClientId: '$CLIENT_ID',
  AUTH_ENDPOINT: 'https://${ID_ENDPOINT}.execute-api.eu-central-1.amazonaws.com/dev/auth',
  API_HOST: 'http://localhost:3700',
  WS_HOST: 'ws://localhost:3001',
};
