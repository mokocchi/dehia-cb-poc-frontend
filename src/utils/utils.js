import jwt from 'jsonwebtoken';
import { JWT_PUBLIC_KEY } from '../config';

export function expired(expiresAt) {
    return Date.now() > expiresAt;
}

export function expiresAt(expiresIn) {
    return Date.now() + expiresIn;
}

export const waitFor = (conditionFunction, timeout = 400) => {
    const poll = resolve => {
        if (conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), timeout);
    }
    return new Promise(poll);
}

export const verifyJWTSignature = (JWT) => {
    if(JWT) {
        try {
            const jwtData = jwt.decode(JWT);
            return {
                name: jwtData.name, exp: jwtData.exp
            }        
        } catch (error) {
            return null;
        }
    } else {
        return null;
    }
}