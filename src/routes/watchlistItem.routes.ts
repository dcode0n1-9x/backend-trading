import { watchlistItemValidator } from "../utils/validator";
import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { createWatchListItem } from "../modules/watchlist/WatchItem/createWatchListItem";
import { deleteWatchList } from "../modules/watchlist/WatchList/deleteWatchList";
import { deleteWatchlistItem } from "../modules/watchlist/WatchItem/deleteWatchItem";
import { updateWatchlistItem } from "../modules/watchlist/WatchItem/updateWatchItem";
import { HttpResponse } from "../utils/response/success";


export const watchlistItemRouter = new Elysia({
    name: "watchlist-item",
    prefix: "/watchlist-item",
    detail: {
        tags: ["Watchlist"],
        description: "APIs related to user watchlist items"
    }
})
    .use(authMiddleware)
    .use(watchlistItemValidator)
    .post("/:watchlistGroupId", async ({ params, body }) => {
        try {
            return await createWatchListItem({
                prisma,
                data: {
                    groupId: params.watchlistGroupId,
                    instrumentId: body.instrumentId,
                },
            });
        }catch (err) {
            console.error(err);
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        params: "watchlist-groupId",
        body: "watchlist-item.create",
        detail: {
            summary: "Create Watchlist Item",
            description: "Creates a new watchlist item under the specified watchlist group."
        }
    })
    .delete("/:watchlistItemId", async ({ params }) => {
        return await deleteWatchlistItem({
            prisma,
            data: {
                watchlistItemId: params.watchlistItemId
            }
        })
    }, {
        params: "watchlist-item.id",
        detail: {
            summary: "Delete Watchlist Item",
            description: "Deletes the specified watchlist item from the user's watchlist."
        }
    })
    .put("/watchlistItemId", async ({ params, body }) => {
        return await updateWatchlistItem({
            prisma,
            data: {
                watchlistItemId: params.watchlistItemId,
                sortOrder: body.sortOrder
            }
        })
    }, {
        params: "watchlist-item.id",
        body: "watchlist-item.update",
        detail: {
            summary: "Update Watchlist Item",
            description: "Updates the details of the specified watchlist item, such as its sort order."
        }
    })
