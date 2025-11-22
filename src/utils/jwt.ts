import { SignJWT, type JWTPayload } from "jose"
import { createSecretKey } from "crypto"
import env from "../../env.ts"

export interface JwtPayload {
    id: string,
    email: string,
    username: string,
}

export const generateToken = (payload: JwtPayload) => {
    const secret = env.JWT_SECRET // secret pass 
    const secretKey = createSecretKey(secret, 'utf-8') // create secret key 

    // return a string
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' }) //hash method
        .setIssuedAt()  // set timer
        .setExpirationTime(env.JWT_EXPIRES_IN || '7d') // time to cancel JWT
        .sign(secretKey) // sign
}