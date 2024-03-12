import { RouteShorthandOptions } from 'fastify';
import { CoinAdd, CoinDelete, FavoriteCoin, UserCoins } from './coinsType.js';

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
};

export const userCoinsOpts: RouteShorthandOptions = {
    schema: {
        response: {
            200: UserCoins
        }
    }
};

export const deleteFavoriteCoinsOpts: RouteShorthandOptions = {
    schema: {
        body: FavoriteCoin,
        response: {
            200: FavoriteCoin
        }
    }
};

export const addFavoriteCoinsOpts: RouteShorthandOptions = {
    schema: {
        body: FavoriteCoin,
        response: {
            200: FavoriteCoin
        }
    }
};

export const favoriteCoinsOpts: RouteShorthandOptions = {
    schema: {
        response: {
            200: FavoriteCoin
        }
    }
};

