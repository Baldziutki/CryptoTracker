"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const build = () => {
    dotenv_1.default.config();
    const dbUrl = process.env["DB_URL"];
    if (!dbUrl) {
        throw new Error('DB_URL not specified in environment variables');
    }
    const server = (0, fastify_1.default)({
        logger: true
    });
    server.register(require('@fastify/mongodb'), {
        forceClose: true,
        url: dbUrl
    });
    return server;
};
exports.build = build;
