import AppStore from "../stores/AppStore";
import { defaultUser, IUser } from "../models/User";
import AppApi from "./AppApi";
import {
  signInWithPopup,
  OAuthProvider,
  signOut,
  signInWithRedirect,
  UserCredential,
  onAuthStateChanged,
  User as FirebaseUser,
  browserSessionPersistence,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { MAIL_EMAIL, WELCOME_SUBJECT, WELCOME_MESSAGE } from "../functions/mailMessages";

const GRAPH_API_ENDPOINTS = {
  ME: "https://graph.microsoft.com/beta/me", // get profile data https://graph.microsoft.com/beta/$metadata
};

export default class AuthApi {
  private provider = new OAuthProvider("microsoft.com");

  constructor(private api: AppApi, private store: AppStore) {
    this.provider.setCustomParameters({
      login_hint: "user@ecb.org.na",
      tenant: "7183259b-b22f-45f2-a259-cd6ab7231b66", // ecb
    });

    this.provider.addScope("mail.read");
    this.provider.addScope("calendars.read");
    this.handleAuthStateChange();
  }

  private handleAuthStateChange() {
    onAuthStateChanged(auth, async (user) => {
      this.store.auth.setLoading(true); // start loading.
      if (!user) {
        this.logOut();
        this.store.auth.setLoading(false); // start loading.
        return;
      }

      try {
        this.handleUserBasicInfo(user);
        // this.handleUserCredential(cred); // Get user info from graph api.
      } catch (error) {
        // window.alert("an error occured.")
        this.logOut();
      }
    });
  }

  async logInWithPopup() {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const cred = await signInWithPopup(auth, this.provider);
      await this.handleUserCredential(cred);
    } catch (error) {
      // window.alert("an error occured.")
    }
  }

  async logInWithRedirect() {
    await setPersistence(auth, browserSessionPersistence);
    signInWithRedirect(auth, this.provider);
  }

  private async handleUserCredential(result: UserCredential) {
    // User is signed in.
    // Get the OAuth access token and ID Token
    const credential = OAuthProvider.credentialFromResult(result);
    if (!credential) {
      this.logOut(); // no user credentials, logOut user.
      return;
    }

    // accessToken & idToken
    const { accessToken = "" } = credential;

    // handle authenticated user
    const user = result.user;

    // get user info
    const userInfo = await this.getUserInfo(accessToken);
    const additionalUserInfo = {
      email: userInfo.mail || userInfo.userPrincipalName,
      jobTitle: userInfo.jobTitle || "",
    };

    // handle user basic info
    await this.handleUserBasicInfo(user, additionalUserInfo);
  }

  private async handleUserBasicInfo(
    user: FirebaseUser,
    additionalUserInfo: any = {}
  ) {
    // console.log("Handle user basic info.");

    // get doc
    try {
      const $doc = await getDoc(doc(db, "users", user.uid));

      // update db if user is not exist || has not logged in before.
      if (!$doc.exists()) {
        // user basic info
        const me: IUser = {
          ...defaultUser,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          createdAt: user.metadata.creationTime || null,
          lastLoginAt: user.metadata.lastSignInTime || null,
          ...additionalUserInfo,
        };

        this.api.user.create(me); // TODO: optimize
        this.store.auth.logIn(me); // update current user store
        //welcome me
        await this.api.mail.sendMail(
          ['engdesign@lotsinsights.com'!],
          MAIL_EMAIL,
          WELCOME_SUBJECT,
          WELCOME_MESSAGE
        );
      } else {
        // user basic info
        const me: IUser = {
          ...defaultUser,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          createdAt: user.metadata.creationTime || null,
          lastLoginAt: user.metadata.lastSignInTime || null,
          ...$doc.data(),
          ...additionalUserInfo,
        };
        this.api.user.create(me); // TODO: optimize
        this.store.auth.logIn(me); // update current user store
      }

      this.store.auth.setLoading(false); // start loading.
    } catch (error) {
      window.alert("The database has reached the daily limit or the device is offline") //firebase error, Quota exceeded
      // console.log(error);zz

    }
  }

  private async getUserInfo(accessToken: string) {
    try {
      const userInfo = await this.callGraphApi(
        GRAPH_API_ENDPOINTS.ME,
        accessToken
      );
      return userInfo;
    } catch (error) {
      window.alert("Cannot get user information.")
    }
  }

  private async callGraphApi(endpoint: string, token: string) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);
    const options = {
      method: "GET",
      headers: headers,
    };

    const response = await fetch(endpoint, options);
    const userInfo = await response.json();

    try {
      return userInfo;
    } catch (error) {
      window.alert("Cannot get user information.")
    }
  }

  //sign in with email and password firebase
  async signIn(email: string, password: string) {
    setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    }).catch((error) => {
      return null;
    });

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      return null;
    });

    if (userCredential) return userCredential.user;
    return userCredential;
  }

  // logout
  async logOut() {
    try {
      await signOut(auth);
    } catch (error) {
      window.alert("sign-out failed..")
    }

    // Remove user from store.
    this.store.auth.logOut();
  }
}
