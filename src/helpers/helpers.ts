import { prisma } from "../db"

export const checkInstrument = async (instrumentId: string): Promise<boolean> => {
    const result = await prisma.$queryRaw<[{ exists: boolean }]>`
        SELECT EXISTS(
            SELECT 1 FROM "Instrument" WHERE id = ${instrumentId}
        ) as exists
    `;
    return result[0].exists;
}

export const checkWatchlistGroup = async (groupId: string): Promise<boolean> => {
    const result = await prisma.$queryRaw<[{ exists: boolean }]>`
        SELECT EXISTS(
            SELECT 1 FROM "WatchlistGroup" WHERE id = ${groupId}
        ) as exists
    `;
    return result[0].exists;
}