import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { Person } from '@stacks/profile';
import { configure } from 'radiks';
import { User, getConfig } from 'radiks';


const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });

configure({
  apiServer: 'http://localhost:1260',
  userSession,
});

// const publicKey = getPublicKeyFromPrivate(userSession.appPrivateKey);
// const address = publicKeyToAddress(publicKey);
// export const gaiaUrl = "https://gaia.blockstack.org/hub/" + address;

export function authenticate() {
  showConnect({
    appDetails: {
      name: 'Decentralized Document processor',
      icon: window.location.origin + '/blockchain.svg',
    },
    redirectTo: '/',
    finished: () => {
      console.log(userSession.loadUserData());
      // console.log(gaiaUrl)
      window.location.reload();
    },
    userSession: userSession,
    
  });
  
}

const handleSignIn = () => {
  const { userSession } = getConfig();
  if (userSession.isSignInPending()) {
    userSession.handlePendingSignIn();
    User.createWithCurrentUser();
  }
}

export function getUserData() {
  return userSession.loadUserData();
}

export function getPerson() {
  return new Person(getUserData().profile);
}
