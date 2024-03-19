import { FastifyInstance, FastifyServerOptions } from "fastify";
import { coinAmount } from "./fetchCoinAmount.js";

export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {

    fastify.get<{Reply: Number}>(
        '/getCoinAmount', {
            schema:{
                response:{
                    201: Number,
                }
            }
        }, async (_request, reply) => {
            return reply.code(201).send(coinAmount);
        });
    
}