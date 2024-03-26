import { FastifyInstance, FastifyServerOptions } from "fastify";
import { fearAndGreedData, globalMarketData, trendingCoins } from "./coinGeckoData.js";
import { TrendingCoinsType, TrendingCoins, SearchCoinsType, SearchCoins, GlobalMarketDataType, GlobalMarketData, FearAndGreedIndexType, FearAndGreedIndex } from "./coinGeckoDataType.js";

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

    fastify.get<{ Params: { coinName: string, currency: string }, Reply: SearchCoinsType }>(
        '/searchCoin/:coinName/:currency', {
        schema: {
            response: {
                201: SearchCoins
            }

        }
    }, async (request, reply) => {
        const { coinName, currency } = request.params;
        const response = await fetch(`https://www.coingecko.com/en/search_v2?query=${coinName}&vs_currency=${currency}`);
        if (response.ok) {
            const data = await response.json();
            const coins = data.coins;
            return reply.code(201).send(coins)
        } else {
            throw new Error('Failed to fetch data');
        }
    });

    fastify.get<{ Reply: GlobalMarketDataType }>(
        '/getGlobalMarketData', {
        schema: {
            response: {
                201: GlobalMarketData
            }
        }
    }, async (_request, reply) => {
        return reply.code(201).send(globalMarketData);
    });

    fastify.get<{ Reply: FearAndGreedIndexType }>(
        '/getFearAndGreed', {
        schema: {
            response: {
                201: FearAndGreedIndex
            }
        }
    }, async (_request, reply) => {
        return reply.code(201).send(fearAndGreedData);
    });

}