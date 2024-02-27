import fastify from 'fastify';
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { FastifyRequest, FastifyReply } from 'fastify';

export const build = () => {

    dotenv.config();

    const dbUrl: string | undefined = process.env["DB_URL"];

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

    server.register(require('@fastify/mongodb'), {
        forceClose: true,
        url: dbUrl
    });


    return server;
};