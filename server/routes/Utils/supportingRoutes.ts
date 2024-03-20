import { FastifyInstance, FastifyServerOptions } from "fastify";
import { coinAmount } from "./fetchCoinAmount.js";
import { exchangesAmount } from "./fetchExchangesAmount.js";

export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {

    fastify.get<{ Reply: Number }>(
        '/getCoinAmount', {
        schema: {
            response: {
                201: {
                    type: 'number'
                }
            }
        }
    }, async (_request, reply) => {
        return reply.code(201).send(coinAmount);
    });

    fastify.get<{ Reply: Number }>(
        '/getExchangesAmount', {
        schema: {
            response: {
                201: {
                    type: 'number'
                }
            }
        }
    }, async (_request, reply) => {
        return reply.code(201).send(exchangesAmount);
    });

}