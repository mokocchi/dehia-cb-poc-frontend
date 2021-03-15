import { TOKEN_AUTH_URL, API_BASE_URL } from "../config";
import { expired, expiresAt } from "./utils";
import tokenManager from "./tokenManager";

export default class APIClient {
    setAuth(auth) {
        this.auth = auth;
    }

    async login() {
        return fetch(TOKEN_AUTH_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                //TODO: add ID
                "token": true
            })
        }).then(
            async response => {
                return response.json().then(
                    data => {
                        if (data.error_code) {
                            console.log(data);
                        } else {
                            const auth = {
                                token: data.accessToken,
                                expiresAt: expiresAt(data.expires_in)
                            }
                            this.setAuth(auth);
                            return auth;
                        }
                    }
                )
            }
        ).catch(error => {
            console.log(error);
        })
    }


    validAuth(auth) {
        return auth && auth.token && !expired(auth.expiresAt);
    }

    loginFromStoredTokenId() {
        tokenManager.login();
    }

    async authorizedRequest(uri, parameters = {}, json = true) {
        if (!this.validAuth(this.auth)) {
            this.loginFromStoredTokenId();
        }
        parameters.headers = {
            "Authorization": "Bearer " + this.auth.token
        }
        if (json) {
            parameters.headers["Content-Type"] = "application/json"
        }
        try {
            const response = await fetch(API_BASE_URL + uri, parameters);
            return await response.json();
        } catch (error) {
            return {
                user_message: "Ocurrió un error", error_code: 0
            }
        }
    }

    async unauthorizedRequest(uri, parameters = {}) {
        const response = await fetch(API_BASE_URL + '/public' + uri, parameters);
        return await response.json();
    }

    async authorizedGetRequest(uri) {
        return this.authorizedRequest(uri);
    }

    async authorizedPostRequest(uri, object, stringify = true) {
        return this.getToken().then(token => {
            return this.authorizedRequest(token, uri, {
                body: stringify ? JSON.stringify(object) : object,
                method: 'POST'
            }, stringify)
        })
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
        const token = this.getToken();
        return this.authorizedRequest(token, uri, { method: 'DELETE' });
    }

    getCollectStatus() {
        return this.authorizedGetRequest('/collect-status');
    }
}