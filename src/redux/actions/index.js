export const API_USER_FOUND = "API_USER_FOUND"

export function apiUserFound(user) {
  return {
    type: API_USER_FOUND,
    user
  }
}

export const API_USER_EXPIRED = "API_USER_EXPIRED"

export function apiUserExpired() {
  return {
    type: API_USER_EXPIRED
  }
}

export const LOADING_API_USER = "LOADING_API_USER"

export function loadingApiUser() {
  return {
    type: LOADING_API_USER
  }
}

export const API_USER_LOGGED_OUT = "API_USER_LOGGED_OUT"

export function apiUserLoggedOut() {
  return {
    type: API_USER_LOGGED_OUT
  }
}