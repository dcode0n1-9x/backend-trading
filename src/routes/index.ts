import { alertRouter } from "./alert.routes.js";
import { basketRouter } from "./basket.routes.js";
import { basketItemRouter } from "./basketItem.routes.js";
import { commonRouter } from "./common.routes.js";
import { forgetPasswordRouter } from "./forgetPassword.routes.js";
import { holdingRouter } from "./holding.routes.js";
import { instrumentRouter } from "./instrument.routes.js";
import { authRouter } from "./login.routes.js";
import { orderRouter } from "./order.routes.js";
import { signUpRouter } from "./signup.routes.js";
import {  watchlistRouter } from "./watchlist.routes.js";
import { watchlistGroupRouter } from "./watchlistGroup.routes.js";
import { watchlistItemRouter } from "./watchlistItem.routes.js";



export const indexRouter = {
    signUpRouter,
    forgetPasswordRouter,
    authRouter, 
    commonRouter,
    watchlistRouter,
    watchlistGroupRouter,
    watchlistItemRouter,
    orderRouter,
    holdingRouter,
    alertRouter,
    basketRouter,
    basketItemRouter,
    instrumentRouter
}