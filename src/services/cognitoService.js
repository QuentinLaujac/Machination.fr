import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import appConfig from '../config.api'; 

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});


const getTokens = (authResult) => {
  // According to the official docs, in order to authenticate via API GW
  // you don't use the access token but the token id instead.
  // https://docs.aws.amazon.com/en_en/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html
  const accessToken = authResult.getAccessToken().getJwtToken();
  const refreshToken = authResult.getRefreshToken().getToken();
  const tokenId = authResult.getIdToken().getJwtToken();

  return {
    accessToken,
    refreshToken,
    tokenId,
  };
};

const authenticate = (cognitoUser, authenticationDetails) => {
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // Authenticate a user section
        resolve({
          ...getTokens(result),
          ...{ userId: result.accessToken.payload.sub, username: result.idToken.payload.nickname },
        });
      },
      onFailure: (error) => {
        reject(error);
      },
    });
  });
};

const refresh = (cognitoUser, token) => {
  return new Promise((resolve, reject) => {
    cognitoUser.refreshSession(token, (err, session) => {
      if (err) {
        reject(err);
      } else {
        resolve(getTokens(session));
      }
    });
  });
};

/**
 * Service fournissant tous les accès d'authentification via amazon Cognito.
 * Lien vers la doc : https://docs.aws.amazon.com/fr_fr/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html
 */
const CognitoService = {
  authenticateUser: async (user, password) => {
    return new Promise((resolve, reject) => {
      // 1. Generate an AuthenticationDetails object
      const authenticationData = {
        Username: user,
        Password: password,
      };
      const authenticationDetails = new AmazonCognitoIdentity
        .AuthenticationDetails(authenticationData);

      // 2. Generate a CognitoUser object
      const userData = {
        Username: user,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      // 3. Invoke the authenticate method
      authenticate(cognitoUser, authenticationDetails)
        .then((authenticateUser) => resolve(authenticateUser)).catch((err) => {
          reject(err);
        });
    });
  },

  refreshToken: (user, token) => {
    // 1. Generate a CognitoUser object
    const userData = {
      Username: user,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    // 2. Generate a RefreshToken object
    const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: token });

    // 3. Invoke the refresh method
    return refresh(cognitoUser, refreshToken).Promise();
  },

  signup: (username, email, password) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: 'nickname',
          Value: username,
        }),
      ];
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  },

  confirmRegistration: (username, registryCode) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.confirmRegistration(registryCode, true, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  },

  resendConfirmationCode: (username) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  },

  changePassword: (username, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  },

  forgotPassword: (username, callBackCodeFunct) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.forgotPassword({
        onSuccess: (data) => resolve(data),
        onFailure: (err) => reject(err),
        inputVerificationCode: (data) => callBackCodeFunct(data),
      });
    });
  },

  forgotPasswordVerifyMail: (username, verificationCode, newPassword) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess() {
          return resolve();
        },
        onFailure(err) {
          return reject(err);
        },
      });
    });
  },

  signout: () => {
    return new Promise((resolve) => {
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.signOut();
      }
      return resolve();
    });
  },

  deleteUser: () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();

      cognitoUser.deleteUser((err, result) => {
        if (err) {
          return reject();
        }
        return resolve(result);
      });
    });
  },

  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            ...{
              userId: cognitoUser.username,
              username: cognitoUser.signInUserSession.idToken.payload.nickname,
              tokenId: cognitoUser.signInUserSession.idToken.jwtToken,
              refreshToken: cognitoUser.signInUserSession.refreshToken.token,
            },
            isSessionValid: session.isValid(),
          });
        });
      }
      return resolve(null);
    });
  },

};

export default CognitoService;
