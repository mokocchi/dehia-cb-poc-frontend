import { apiUserFound, apiUserExpired, loadingApiUser } from '../redux/actions';
import { expired, verifyJWTSignature } from './utils';
import APIClient from './APIClient';

export default class tokenManager {

    static store = null;

    static initialize(store) {
        this.store = store;
        this.client = new APIClient();
    }

    static loadApiUser() {
        this.store.dispatch(loadingApiUser());
        const tokenString = sessionStorage.getItem('dehia.auth');
        const storedAuth = tokenString ? JSON.parse(tokenString) : null;
        if (storedAuth && storedAuth.token) {
            this.reauthIfNeeded(storedAuth).then(
                auth => {
                    if (auth) {
                        this.storeUserIfValidJWT(auth)
                    } else {
                        console.log("Couldn't fetch login data")
                        this.expireUser()
                    }
                }
            ).catch(_ => this.expireUser())
        } else {
            console.log("Token not found")
            this.expireUser()
        }
    }

    static storeUserIfValidJWT(auth) {
        const token = auth.token;
        const jwtContents = verifyJWTSignature(token);
        if (jwtContents) {
            const storedAuth = { token, expiresAt: jwtContents.exp * 1000 }
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
                .then(response => {
                    console.log(response);
                    if (response.data) {
                        this.storeUserIfValidJWT(response.data);
                    } else {
                        if (response.error_code) {
                            console.log(response.user_message);
                        } else {
                            console.log("Unknown error");
                        }
                        this.expireUser();
                    }
                }).catch(error => {
                    if (error.response.error_code) {
                        console.log(error.response.user_message);
                    } else {
                        console.log("Unknown error");
                    }
                    this.expireUser();
                });
        } else {
            return token;
        }
    }

    static expireUser() {
        if (window.location.pathname !== "/callback") {
            sessionStorage.setItem('returnPath', window.location.pathname + window.location.search);
            sessionStorage.removeItem('dehia.auth');
        }
        this.store.dispatch(apiUserExpired());
    }

    static storeApiUser(auth) {
        sessionStorage.setItem('dehia.auth', JSON.stringify(auth));
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

    static createResourceSwitch() {
        return this.client.postResourceSwitch();
    }

    static removeResourceSwitch() {
        return this.client.deleteResourceSwitch();
    }

    static getResultsStatus() {
        return this.client.getResultsStatus();
    }

    static getResults() {
        return this.client.getResults();
    }

    static enableCircuitBreaker() {
        return this.client.postCircuitBreakerSwitch();
    }

    static disableCircuitBreaker() {
        return this.client.deleteCircuitBreakerSwitch();
    }

    static getCircuitBreakerStatus() {
        return this.client.getCircuitBreakerStatus();
    }
}
