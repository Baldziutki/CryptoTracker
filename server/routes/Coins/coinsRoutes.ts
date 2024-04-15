import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { FavoriteCoinType, CoinType, CoinDeleteType, FavoriteCoinsType, UserCoinsType, Coin, CoinDelete, FavoriteCoin, UserCoins, FavoriteUserCoins } from './coinsType.js';

export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));


    fastify.get<{ Reply: UserCoinsType | string }>(
        '/getCoins', {
        schema: {
            response: {
                201: UserCoins
            }
        }
    },
        async (request, reply) => {

            const userEmail = (request.user as { email: string }).email;

            const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

            if (!user) {
                return reply.code(404).send("User not found!");
            };

            return reply.code(201).send(user?.['coins']);

        }
    );


    fastify.patch<{ Body: CoinType, Reply: string }>(
        '/addCoin', {
        schema: {
            body: Coin,
        }
    },
        async (request, reply) => {
            try {
                const { coinId, coinName, coinAmount, coinAddDate, coinAddDateValue } = request.body;
                const userEmail = (request.user as { email: string }).email;

                const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

                if (user) {
                    const userCoins = user['coins'];

                    const newCoin = {
                        coinId,
                        coinName,
                        coinAmount,
                        coinAddDate,
                        coinAddDateValue
                    };

                    userCoins.push(newCoin);

                    await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { coins: userCoins } });

                    reply.code(200).send('Coin added successfully');

                } else {
                    reply.code(404).send('User not found');
                }
            } catch (error) {
                console.log(error);
            }
        }
    );

    fastify.delete<{ Body: CoinDeleteType, Reply: String }>(
        '/deleteCoin', {
        schema: {
            body: CoinDelete,
        }
    },
        async (request, reply) => {
            try {
                const { coinId, coinAmount } = request.body;

                const userEmail = (request.user as { email: string }).email;

                const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

                if (user) {

                    const userCoins = user['coins'];

                    const coinExistIndex = userCoins.findIndex((element: { coinId: string }) => element.coinId === coinId);

                    if (coinExistIndex !== -1) {
                        userCoins[coinExistIndex].coinAmount -= coinAmount;

                        if (userCoins[coinExistIndex].coinAmount <= 0) {
                            userCoins.splice(coinExistIndex, 1);
                            await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { coins: userCoins } });
                        } else {
                            await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { coins: userCoins } });
                        }

                        reply.code(200).send('Coin amount updated successfully');
                    } else {
                        reply.code(200).send('Coin not found');
                    }

                } else {
                    reply.code(404).send('User not found');
                }

            } catch (error) {
                console.log(error);
            }
        }
    );

    fastify.get<{ Reply: FavoriteCoinsType | string }>(
        '/getFavoriteCoins', {
        schema: {
            response: {
                201: FavoriteUserCoins
            }
        }
    },
        async (request, reply) => {
            const userEmail = (request.user as { email: string }).email;

            const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

            if (!user) {
                return reply.code(404).send("User not found!");
            };
            return reply.code(201).send(user?.['favoriteCoins']);

        }
    )

    fastify.patch<{ Body: FavoriteCoinType, Reply: string }>(
        '/addFavoriteCoin', {
        schema: {
            body: FavoriteCoin,
        }
    },
        async (request, reply) => {

            const { coinId, coinName } = request.body;

            const userEmail = (request.user as { email: string }).email;

            const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

            if (user) {
                const userFavoriteCoins = user['favoriteCoins'];
                const newFavoriteCoin = {
                    coinId,
                    coinName,
                };
                userFavoriteCoins.push(newFavoriteCoin);

                await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { favoriteCoins: userFavoriteCoins } });

                reply.code(200).send('New coin added successfully to favorite list!');

            } else {
                reply.code(404).send('User not found');
            }
        }
    );

    fastify.delete<{ Body: FavoriteCoinType, Reply: string }>(
        '/deleteFavoriteCoin', {
        schema: {
            body: FavoriteCoin,
        }
    },
        async (request, reply) => {
            const { coinId } = request.body;

            const userEmail = (request.user as { email: string }).email;

            const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

            if (user) {
                const userFavoriteCoins = user['favoriteCoins'];

                const coinExistIndex = userFavoriteCoins.findIndex((element: { coinId: string }) => element.coinId === coinId);
                if (coinExistIndex !== -1) {
                    userFavoriteCoins.splice(coinExistIndex, 1);
                    await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { favoriteCoins: userFavoriteCoins } });
                    reply.code(200).send('Coin successfully deleted from favorites!');
                } else {
                    reply.code(200).send('Coin not found');
                }

            } else {
                reply.code(404).send('User not found');
            }
        }
    )


}