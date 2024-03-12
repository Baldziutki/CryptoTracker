import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { FavoriteCoinType, CoinAddType, CoinDeleteType, FavoriteCoinsType, UserCoinsType } from './coinsType.js';
import { addFavoriteCoinsOpts, coinAddOpts, coinDeleteOpts, deleteFavoriteCoinsOpts, favoriteCoinsOpts, userCoinsOpts } from './coinsOpts.js';



export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));


    fastify.get<{ Reply: UserCoinsType | string }>(
        '/getCoins', userCoinsOpts,
        async (request, reply) => {

            const userEmail = (request.user as { email: string }).email;

            const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

            if (!user) {
                return reply.code(404).send("User not found!");
            };

            return reply.code(201).send(user?.['coins']);

        }
    );


    fastify.patch<{ Body: CoinAddType, Reply: string }>(
        '/addCoin', coinAddOpts,
        async (request, reply) => {
            try {
                const { coinId, coinName, coinAmount, coinAddDate } = request.body;
                const userEmail = (request.user as { email: string }).email;

                const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

                if (user) {
                    const userCoins = user['coins'];

                    const coinExistIndex = userCoins.findIndex((element: { coinId: string }) => element.coinId === coinId);

                    if (coinExistIndex !== -1) {
                        userCoins[coinExistIndex].coinAmount += coinAmount;

                        await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { coins: userCoins } });

                        reply.code(200).send('Coin amount updated successfully');
                    } else {
                        const newCoin = {
                            coinId,
                            coinName,
                            coinAmount,
                            coinAddDate,
                        };

                        userCoins.push(newCoin);

                        await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { coins: userCoins } });

                        reply.code(200).send('New coin added successfully');
                    }
                } else {
                    reply.code(404).send('User not found');
                }
            } catch (error) {
                console.log(error);
            }
        }
    );

    fastify.delete<{ Body: CoinDeleteType, Reply: String }>(
        '/deleteCoin', coinDeleteOpts,
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
                            userCoins.splice(coinExistIndex,1);
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

    fastify.get<{Reply: FavoriteCoinsType | string}>(
        '/getFavoriteCoins', favoriteCoinsOpts,
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
        '/addFavoriteCoin', addFavoriteCoinsOpts,
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
        '/deleteFavoriteCoin', deleteFavoriteCoinsOpts,
        async (request, reply) => {
            const { coinId } = request.body;

            const userEmail = (request.user as { email: string }).email;

            const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

            if (user) {
                const userFavoriteCoins = user['favoriteCoins'];

                const coinExistIndex = userFavoriteCoins.findIndex((element: { coinId: string }) => element.coinId === coinId);
                if (coinExistIndex !== -1) {
                    userFavoriteCoins.splice(coinExistIndex,1);
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