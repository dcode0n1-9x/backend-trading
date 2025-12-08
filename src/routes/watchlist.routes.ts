import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { getWatchListUser } from "../modules/watchlist/WatchList/getAllWatchlist";
import { createWatchList } from "../modules/watchlist/WatchList/createWatchlist";
import { watchlistValidator } from "../utils/validator";
import { deleteWatchList } from "../modules/watchlist/WatchList/deleteWatchList";
import { updateWatchList } from "../modules/watchlist/WatchList/updateWatchList";

export const watchlistRouter = new Elysia({
    name: "watchlist",
    prefix: "/watchlist",
    detail: {
        tags: ["Watchlist"],
        description: "APIs related to user watchlist"
    }
})
    .use(authMiddleware)
    .use(watchlistValidator)
    .get(
        "/",
        async ({ user }) => {
            return await getWatchListUser({
                prisma,
                userId: user.id,
            })

        }, {
        detail: {
            summary: "Get All Watchlist",
            description: "This is the end-point to fetch all the watchlist of the user"
        }
    })
    .post("/", async ({ body, user }) => {
        return await createWatchList({
            prisma,
            data: body,
            userId: user.id,
        })
    }, {
        body: "watchlist.create",
        detail: {
            summary: "Create the Watchlist",
            description: "This is to create a watchlist tab for the user"
        }
    })
    .delete("/:watchlistId", async ({ params }) => {
        const { watchlistId } = params;
        return await deleteWatchList({
            prisma,
            data: { watchlistId },
        });
    }, {
        params: "watchlist.delete",
        detail: {
            summary: "Delete the Watchlist",
            description: "This is the end-point for deleting up the watchlist"
        }
    })
    .put("/:watchlistId", async ({ params, body, user }) => {
        const { watchlistId } = params;
        return await updateWatchList({
            prisma,
            data: {
                name: body.name,
                watchlistId,
            },
            userId: user.id,
        });
    }, {
        params: "watchlist.id",
        body: "watchlist.update",
        detail: {
            summary: "Update the Watchlist",
            description: "This is to update the name of the watchlist"
        }
    });


