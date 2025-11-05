import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { getWatchListUser } from "../modules/watchlist/WatchList/getWatchlistAndMakeDefault";
import { createWatchList } from "../modules/watchlist/WatchList/createWatchlist";
import { watchlistGroupValidator, watchlistValidator } from "../utils/validator";
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

        }
    )
    .post("/", async ({ body, user }) => {
        return await createWatchList({
            prisma,
            data: body,
            userId: user.id,
        })
    }, {
        body: "watchlist.createWatchlist",
    })
    .delete("/:watchlistId", async ({ params }) => {
        const { watchlistId } = params;
        return await deleteWatchList({
            prisma,
            data: { watchlistId },
        });
    }, {
        params: "watchlist.deleteWatchlist"
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
        params : "watchlist.id",
        body: "watchlist.updateWatchlist",
    });
    

