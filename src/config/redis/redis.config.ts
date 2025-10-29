import { config } from "../generalconfig";

import Redis from 'ioredis'

let redis = new Redis(config.REDIS);

redis.on("error", function (err: any) {
    throw err;
});

redis.on("connect", function () {
    redis.flushall();
    // flush the redis
    console.log("Redis connected");
});
export { redis };
