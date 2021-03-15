import { apiUserFound, apiUserExpired, loadingApiUser } from '../redux/actions';
import { expired, expiresAt, verifyJWTSignature } from './utils';
import APIClient from './APIClient';

export default class tokenManager {

    static store = null;

    static initialize(store) {
        this.store = store;
        this.client = new APIClient();
    }

    static loadApiUser() {
        this.store.dispatch(loadingApiUser());
        const tokenString = localStorage.getItem('dehia.auth');
        const storedAuth = tokenString ? JSON.parse(tokenString) : null;
        if (storedAuth && storedAuth.token) {
            this.reauthIfNeeded(storedAuth).then(
                auth => this.storeUserIfValidJWT(auth)
            ).catch(_ => this.expireUser())
        } else {
            console.log("Token not found")
            this.expireUser()
        }
    }

    static storeUserIfValidJWT(auth) {
        const token = auth.token;
        console.log("verifying JWT")
        const jwtContents = verifyJWTSignature(token);
        if (jwtContents) {
            const storedAuth = { token, expiresAt: expiresAt(jwtContents.exp) }
            this.client.setAuth(storedAuth);
            this.storeApiUser(storedAuth);
            this.store.dispatch(apiUserFound({
                name: jwtContents.name,
            }))
            return true;
        } else {
            console.log("JWT not valid");
            this.expireUser();
            return false;
        }
    }

    static async reauthIfNeeded(token) {
        if (expired(token.expiresAt)) {
            this.login()
                .then(data => {
                    if (data.error_code) {
                        console.log("invalid ID")
                    } else {
                        this.storeUserIfValidJWT(data);
                    }
                });
        } else {
            return token;
        }
    }

    static expireUser() {
        if (window.location.pathname !== "/callback") {
            sessionStorage.setItem('returnPath', window.location.pathname + window.location.search);
            localStorage.removeItem('dehia.auth');
        }
        this.store.dispatch(apiUserExpired());
    }

    static storeApiUser(auth) {
        localStorage.setItem('dehia.auth', JSON.stringify(auth));
        this.client.setAuth(auth);
    }

    static async login() {
        return await this.client.login()
    }

    static async authorizedGetRequest(uri) {
        return await this.client.authorizedGetRequest(uri);
    }

    static getCollectStatus() {
        return this.client.getCollectStatus();
    }

    //TODO: getResultsStatus
    //TODO: postResourceSwitch
    //TODO: getResults
}
