

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
        tags: ["Watchlist"],
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
        params: "watchlist-group.id",
        body: "watchlist-group.create",
        detail : {
            summary : "Create Watchlist Group",
            description: "Creates a new watchlist group under the specified watchlist."
        }
    })
    .delete("/:watchlistGroupId", async ({ params }) => {
        return await deleteWatchGroup({
            prisma,
            data: {
                watchlistGroupId: params.watchlistGroupId,
            },
        });
    }, {
        params: "watchlist-group.delete",
        detail : {
            summary : "Delete Watchlist Group",
            description: "Deletes the specified watchlist group from the user's watchlist."
        }
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
        params: "watchlist-group.watchlistGroupId",
        body: "watchlist-group.update",
        detail : {
            summary : "Update Watchlist Group",
            description: "Updates the details of the specified watchlist group, such as its name, color, and sort order."
        }
    });