import { RouteShorthandOptions } from 'fastify';
import { User, authResponse } from './authType.js';

export const userOpts: RouteShorthandOptions = {
    schema: {
        body: User,
        response: {
            200: User,
        },
    },
};

export const authOpt: RouteShorthandOptions = {
    schema: {
        response: {
            200: authResponse,
        },
    }
};