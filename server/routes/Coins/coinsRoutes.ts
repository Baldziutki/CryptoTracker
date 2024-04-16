import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { FavoriteCoinType, TransactionType, TransactionDeleteType, FavoriteCoinsType, UserTransactionsType, TransactionDelete, Transaction,FavoriteCoin, UserTransactions, FavoriteUserCoins, AddTransaction, AddTransactionType } from './coinsType.js';

export default async function (fastify: FastifyInstance, _options: FastifyServerOptions) {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));


    fastify.get<{ Reply: UserTransactionsType | string }>(
        '/getTransactions', {
        schema: {
            response: {
                201: UserTransactions
            }
        }
    },
        async (request, reply) => {

            const userEmail = (request.user as { email: string }).email;

            const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

            if (!user) {
                return reply.code(404).send("User not found!");
            };

            return reply.code(201).send(user?.['transactions']);

        }
    );


    fastify.patch<{ Body: AddTransactionType, Reply: string }>(
        '/addTransaction', {
        schema: {
            body: AddTransaction,
        }
    },
        async (request, reply) => {
            try {
                const { coinId, coinName, coinAmount, coinAddDate, coinAddDateValue } = request.body;
                const userEmail = (request.user as { email: string }).email;

                const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });

                const generateTransactionId = () => {
                    const timestamp = Date.now().toString(); 
                    const randomNumber = Math.floor(Math.random() * 10000).toString(); 
                    return timestamp + '-' + randomNumber; 
                  }

                if (user) {
                    const userCoins = user['transactions'];

                    const newCoin = {
                        transactionId: generateTransactionId(), 
                        coinId,
                        coinName,
                        coinAmount,
                        coinAddDate,
                        coinAddDateValue
                    };

                    userCoins.push(newCoin);

                    await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { transactions: userCoins } });

                    reply.code(200).send('Coin added successfully');

                } else {
                    reply.code(404).send('User not found');
                }
            } catch (error) {
                console.log(error);
            }
        }
    );

    fastify.delete<{ Body: TransactionDeleteType, Reply: String }>(
        '/deleteTransaction', {
        schema: {
            body: TransactionDelete,
        }
    },
        async (request, reply) => {
            try {
                const { transactionId } = request.body; 
    
                const userEmail = (request.user as { email: string }).email; 
    
                const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail }); 
    
                if (user) {
                    const userTransactions: TransactionType[] = user['transactions']; 
    
                    const updatedTransactions = userTransactions.filter(transaction => transaction.transactionId !== transactionId); 
    
                    await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { transactions: updatedTransactions } }); 
    
                    reply.code(200).send('Transaction deleted successfully'); 
                } else {
                    reply.code(404).send('User not found');
                }
            } catch (error) {
                console.log(error);
                reply.code(500).send('Internal Server Error');
            }
        }
    );

    fastify.patch<{ Body: TransactionType, Reply: string }>(
        '/editTransaction', {
        schema: {
            body: Transaction,
        }
    },
        async (request, reply) => {
            try {
                const { transactionId, coinId, coinName, coinAmount, coinAddDate, coinAddDateValue } = request.body;
    
                const userEmail = (request.user as { email: string }).email;
    
                const user = await fastify.mongo.db?.collection('users').findOne({ email: userEmail });
    
                if (user) {
                    const userTransactions: TransactionType[] = user['transactions'];
    
                    const transactionIndex = userTransactions.findIndex(transaction => transaction.transactionId === transactionId);
    
                    if (transactionIndex !== -1) {
                        
                        userTransactions[transactionIndex] = {
                            transactionId,
                            coinId,
                            coinName,
                            coinAmount,
                            coinAddDate,
                            coinAddDateValue
                        };
    
                        
                        await fastify.mongo.db?.collection('users').updateOne({ email: userEmail }, { $set: { transactions: userTransactions } });
    
                        reply.code(200).send('Transaction updated successfully');
                    } else {
                        reply.code(404).send('Transaction not found');
                    }
                } else {
                    reply.code(404).send('User not found');
                }
            } catch (error) {
                console.log(error);
                reply.code(500).send('Internal Server Error');
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