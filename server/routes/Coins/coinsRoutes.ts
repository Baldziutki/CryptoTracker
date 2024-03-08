import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { CoinAddType, CoinDeleteType } from './coinsType.js';
import { coinAddOpts, coinDeleteOpts } from './coinsOpts.js';



export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));


    fastify.patch<{ Body: CoinAddType, Reply: string }>(
        '/addCoin', coinAddOpts,
        async (request, reply) => {
            try {
                const { coinId, coinName, coinAmount, coinAddDate } = request.body;
                const userEmail = (request.user as { email: string }).email;

                const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

                if (user) {
                    const userCoins = user['coins'];

                    const coinExistIndex = userCoins.findIndex((element: { coindId: string }) => element.coindId === coinId);

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

                    const coinExistIndex = userCoins.findIndex((element: { coindId: string }) => element.coindId === coinId);

                    if (coinExistIndex !== -1) {
                        userCoins[coinExistIndex].coinAmount -= coinAmount;

                        if (userCoins[coinExistIndex].coinAmount <= 0) {
                            const updatedCoins = userCoins.filter((element: { coindId: string }) => element.coindId !== coinId);
                            await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { coins: updatedCoins } });
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
    )



}