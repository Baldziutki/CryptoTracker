import fastify from 'fastify';
import dotenv from 'dotenv';

export const build = () => {

    dotenv.config();

    const dbUrl: string | undefined = process.env["DB_URL"];

    if (!dbUrl) {
        throw new Error('DB_URL not specified in environment variables');
    }

    const server = fastify({
        logger: true
    });

    server.register(require('@fastify/mongodb'), {
        forceClose: true,
        url: dbUrl
      })
    

    return server;
};