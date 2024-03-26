import { FastifyInstance, FastifyServerOptions } from "fastify";
import { trendingCoins } from "./coinGeckoData.js";
import { TrendingCoinsType, TrendingCoins } from "./coinGeckoDataType.js";

export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {

    fastify.get<{ Reply: TrendingCoinsType }>(
        '/getTrending', {
        schema: {
            response: {
                201: TrendingCoins
            }
        }
    }, async (_request, reply) => {
        return reply.code(201).send(trendingCoins);
    });


}