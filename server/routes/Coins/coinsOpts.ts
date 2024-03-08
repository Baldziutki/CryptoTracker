import { RouteShorthandOptions } from 'fastify';
import { CoinAdd, CoinDelete } from './coinsType.js';

export const coinAddOpts: RouteShorthandOptions = {
    schema: {
        body: CoinAdd,
        response: {
            200: CoinAdd
        }
    }
};


export const coinDeleteOpts: RouteShorthandOptions = {
    schema: {
        body: CoinDelete,
        response: {
            200: CoinDelete
        }
    }
}