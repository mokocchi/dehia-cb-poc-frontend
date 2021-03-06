import { TOKEN_AUTH_URL, API_BASE_URL } from "../config";
import { expired, expiresAt } from "./utils";
import axios from 'axios';
import tokenManager from "./tokenManager";

export default class APIClient {
    setAuth(auth) {
        this.auth = auth;
    }

    async login() {
        return axios.post(TOKEN_AUTH_URL, {
                //TODO: add ID
                token: true
        }).then(
            response => {
                if (response.error_code) {
                    console.log(response);
                } else {
                    if (response.data) {
                        const auth = {
                            token: response.data.accessToken,
                            expiresAt: expiresAt(response.data.expires_in)
                        }
                        this.setAuth(auth);
                        return auth;
                    }
                    else {
                        console.log("Auth error")
                        return null
                    }
                }
            }
        ).catch(error => {
            throw error;
        })
    }


    validAuth(auth) {
        return auth && auth.token && !expired(auth.expiresAt);
    }

    async authorizedRequest(uri, parameters = {}, json = true) {
        if (!this.validAuth(this.auth)) {
            console.log("Time's up, please log in again...")
            alert("Time is up! Please log in again");
            tokenManager.expireUser();
        }
        parameters.headers = {
            "Authorization": "Bearer " + this.auth.token,
            "Content-Type": json ? "application/json" : ""
        }
        try {
            return await axios({ url: API_BASE_URL + uri, method: parameters.method, data: parameters.body || {}, headers: parameters.headers });
        } catch (error) {
            if (error.response.data) {
                return error.response.data
            } else {
                return {
                    user_message: "There was an error", error_code: 0
                }
            }
        }
    }

    async authorizedGetRequest(uri) {
        return this.authorizedRequest(uri);
    }

    async authorizedPostRequest(uri, object = {}, stringify = true) {
        if (!this.validAuth(this.auth)) {
            this.loginFromStoredTokenId();
        }
        return this.authorizedRequest(uri, {
            body: stringify ? JSON.stringify(object) : object,
            method: 'POST'
        }, stringify)
    }

    authorizedPutRequest(uri, object, stringify = true) {
        const token = this.getToken();
        return this.authorizedRequest(token, uri, {
            body: stringify ? JSON.stringify(object) : object,
            method: 'PUT'
        })
    }

    authorizedPatchRequest(uri, object, stringify = true) {
        const token = this.getToken();
        return this.authorizedRequest(token, uri, {
            body: stringify ? JSON.stringify(object) : object,
            method: 'PATCH'
        })
    }

    authorizedDeleteRequest(uri) {
        if (!this.validAuth(this.auth)) {
            this.loginFromStoredTokenId();
        }
        return this.authorizedRequest(uri, { method: 'DELETE' });
    }

    getCollectStatus() {
        return this.authorizedGetRequest('/collect-status');
    }

    postResourceSwitch() {
        return this.authorizedPostRequest('/switch')
    }

    deleteResourceSwitch() {
        return this.authorizedDeleteRequest('/switch')
    }

    getResultsStatus() {
        return this.authorizedGetRequest('/results-status');
    }

    getResults() {
        return this.authorizedGetRequest('/results');
    }

    postCircuitBreakerSwitch() {
        return this.authorizedPostRequest('/circuit-breaker-switch');
    }

    deleteCircuitBreakerSwitch() {
        return this.authorizedDeleteRequest('/circuit-breaker-switch')
    }

    getCircuitBreakerStatus() {
        return this.authorizedGetRequest('/circuit-breaker-switch')
    }
}