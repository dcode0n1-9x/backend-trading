

import { createWatchListGroup } from "../modules/watchlist/WatchGroup/createWatchlistGroup";
import { deleteWatchGroup } from "../modules/watchlist/WatchGroup/deleteWatchGroup";
import { updateWatchGroup } from "../modules/watchlist/WatchGroup/updateWatchGroup";
import { watchlistGroupValidator } from "../utils/validator";
import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";


export const watchlistGroupRouter = new Elysia({
    name: "watchlist-group",
    prefix: "/watchlist-group",
    detail: {
        tags: ["Watchlist Group"],
        description: "APIs related to user watchlist groups"
    }
})
    .use(authMiddleware)
    .use(watchlistGroupValidator)
    .post("/:watchlistId", async ({ params, body }) => {
        return await createWatchListGroup({
            prisma,
            data: {
                name: body.name,
                watchlistId: params.watchlistId,
            },
        });
    }, {
        params: "watchlist.id",
        body: "watchlist.createWatchlistGroup",
    })
    .delete("/:watchlistGroupId", async ({ params }) => {
        return await deleteWatchGroup({
            prisma,
            data: {
                watchlistGroupId: params.watchlistGroupId,
            },
        });
    }, {
        params: "watchlist.deleteWatchlistGroup"
    })
    .put("/:watchlistGroupId", async ({ params, body }) => {
        return await updateWatchGroup({
            prisma,
            data: {
                name: body.name,
                color: body.color,
                watchListGroupId: params.watchlistGroupId,
                sortOrder: body.sortOrder
            },
        });
    }, {
        params: "watchlist.watchlistGroupId",
        body: "watchlist.updateWatchlistGroup",
    });