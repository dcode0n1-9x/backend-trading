import { watchlistItemValidator } from "../utils/validator";
import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { createWatchListItem } from "../modules/watchlist/WatchItem/createWatchListItem";


export const watchlistItemRouter = new Elysia({
    name: "watchlist-item",
    prefix: "/watchlist-item",
    detail: {
        tags: ["Watchlist Item"],
        description: "APIs related to user watchlist items"
    }
})
    .use(authMiddleware)
    .use(watchlistItemValidator)
    .post("/:watchlistGroupId", async ({ params, body }) => {
        return await createWatchListItem({
            prisma,
            data: {
                groupId: params.watchlistGroupId,
                instrumentId: body.instrumentId,
            },
        });
    }, {
        params: "watchlist-groupId",
        body: "watchlist-item.createWatchlistItem",
    })
