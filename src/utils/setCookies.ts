import {Cookie} from "elysia"

export function setAuthCookies(cookie: Record<string, Cookie<unknown>>, token:string){
    
    cookie.token.set({
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "development" ? false : true,
    }).value = token;
}