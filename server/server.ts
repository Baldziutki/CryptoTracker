import fastify from 'fastify';
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import fastifyMongodb from '@fastify/mongodb';
import { FastifyRequest, FastifyReply } from 'fastify';
import authRoutes from './routes/Auth/authRoutes.js';
import coinsRoutes from './routes/Coins/coinsRoutes.js';
declare module 'fastify' {
    interface FastifyInstance {
        verifyJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
  }

export const build = async () => {
    dotenv.config();

    const dbUrl: string | undefined = process.env["DB_URL"];
    const dbName: string | undefined = process.env["DB_NAME"];

    if (!dbUrl) {
        throw new Error('DB_URL not specified in environment variables');
    }

    const server = fastify({
        logger: true
    });

    server.register(cors, {
        origin: async (origin) => {
            if (origin === undefined) {
                return true;
            }
            console.log(origin);
            const hostname = new URL(origin).hostname
            if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                throw new Error('Origin not allowed');
            };
            return true;
        },
        credentials: true
    });

    server.register(fastifyAuth);
    server.register(fastifyCookie);

    server.register(fastifyJwt, {
        secret: 'foobar',
        cookie: {
            cookieName: 'token',
            signed: false,
        },
    });

    server.decorate('verifyJWT', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.send(error);
        }
    });

    server.register(fastifyMongodb, {
        forceClose: true,
        url: dbUrl,
        database: dbName
    });

    await server.after();
    server.mongo.db?.collection('users').createIndex({
        email: 1,
    }, {
        unique: true,
    });

    server.register(authRoutes);
    server.register(coinsRoutes);

    return server;
};