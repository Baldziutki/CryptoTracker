import { after, before, describe, it } from "node:test";
import dotenv from 'dotenv';
import assert from "node:assert";
import { build } from "../server.js";
import fastify from "fastify";

dotenv.config();
const dbName: string | undefined = process.env["DB_TEST_NAME"];

let fastifyInstance: fastify.FastifyInstance;
let token: string | undefined;
describe('Integration tests', () => {

    before(async () => {
        try {
            fastifyInstance = await build(dbName);
            await fastifyInstance.ready();
            if (dbName) {
                const collection = fastifyInstance.mongo.client.db(dbName).collection('users');
                if (collection) {
                    await collection.drop();
                }
            }
            fastifyInstance.mongo.db?.collection('users').createIndex({
                email: 1,
            }, {
                unique: true,
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    after(async () => {
        await fastifyInstance.close()
    });

    it('201 on register user', async () => {
        const response = await fastifyInstance.inject({
            method: 'POST',
            url: '/register',
            payload: { email: 'testing@email.com', password: 'test123' },
        });
        assert.strictEqual(response.statusCode, 201);
    });

    it('409 on register existing user user', async () => {
        const response = await fastifyInstance.inject({
            method: 'POST',
            url: '/register',
            payload: { email: 'testing@email.com', password: 'test123' },
        });
        assert.strictEqual(response.statusCode, 409);
    });

    it('200 on login with correct credentials', async () => {
        const response = await fastifyInstance.inject({
            method: 'POST',
            url: '/login',
            payload: { email: 'testing@email.com', password: 'test123' },
        });
        if (response) {
            token = response.cookies[0]?.value;
        }
        console.log(token);
        assert.strictEqual(response.statusCode, 200);

    });

    it('201 when getting transactions with valid authentication', async () => {
        const response = await fastifyInstance.inject({
            method: 'GET',
            url: '/getTransactions',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        assert.strictEqual(response.statusCode, 201);
    });

    it('401 when getting transactions without authentication', async () => {
        const response = await fastifyInstance.inject({
            method: 'GET',
            url: '/getTransactions',
        });
        assert.strictEqual(response.statusCode, 401);
    });

    it('200 when adding a new transaction with valid data and authentication', async () => {
        const response = await fastifyInstance.inject({
            method: 'PATCH',
            url: '/addTransaction',
            headers: { 'Authorization': `Bearer ${token}` },
            payload: {
                coinId: 'BTC',
                coinName: 'Bitcoin',
                coinAmount: 1.5,
                coinAddDate: '2024-04-25',
                coinAddDateValue: 1234567890,
            },
        });
        assert.strictEqual(response.statusCode, 200);
    });

    it('401 when adding a transaction without authentication', async () => {
        const response = await fastifyInstance.inject({
            method: 'PATCH',
            url: '/addTransaction',
            payload: {
                coinId: 'BTC',
                coinName: 'Bitcoin',
                coinAmount: 1.5,
                coinAddDate: '2024-04-25',
                coinAddDateValue: 1234567890,
            },
        });
        assert.strictEqual(response.statusCode, 401);
    });

    it('422 when adding a transaction with invalid data', async () => {
        const response = await fastifyInstance.inject({
            method: 'PATCH',
            url: '/addTransaction',
            headers: { 'Authorization': `Bearer ${token}` },
            payload: {
                coinId: 'BTC',
                coinName: 'Bitcoin',
                coinAmount: 1.5,
            },
        });
        assert.strictEqual(response.statusCode, 400);
    });

})