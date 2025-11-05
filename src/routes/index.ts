import { dashboardRouter } from "./dashboard.routes.js";
import { forgetPasswordRoutes } from "./forgetPassword.routes.js";
import { authRouter } from "./login.routes.js";
import { signUpRouter } from "./signup.routes.js";
import {  watchlistRouter } from "./watchlist.routes.js";
import { watchlistGroupRouter } from "./watchlistGroup.routes.js";
import { watchlistItemRouter } from "./watchlistItem.routes.js";



export const indexRouter = {
    signUpRouter,
    forgetPasswordRoutes,
    authRouter, 
    dashboardRouter,
    watchlistRouter,
    watchlistGroupRouter,
    watchlistItemRouter
}