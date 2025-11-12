// import { BasketInclude } from './../../../../generated/prisma/index.d';
// import type { PrismaClient, Segment } from "../../../../generated/prisma";
// import { HttpResponse } from "../../../utils/response/success";


// interface RegisterData {
//     basketId: string;
//     instrumentId: string;

// }

// interface IRegisterProp {
//     prisma: PrismaClient;
//     data: RegisterData;
// }

// export async function addToBasketItem({ prisma, data }: IRegisterProp) {
//     try {
//         const createBasketItem = await prisma.basketItem.create({
//             data: {
//                 basketId: data.basketId,
//                 instrumentId: data.instrumentId,
//             }
//         });
//         if (!createBasketItem) {
//             return new HttpResponse(500, "WATCHLIST_GROUP_CREATION_FAILED").toResponse();
//         }
//         return new HttpResponse(200, "WATCHLIST_GROUP_CREATED_SUCCESSFULLY", { watchlistGroupId: createWatchGroup.id }).toResponse();
//     } catch (error) {
//         return new HttpResponse(500, "WATCHLIST_GROUP_CREATION_FAILED").toResponse();
//     }
// }
