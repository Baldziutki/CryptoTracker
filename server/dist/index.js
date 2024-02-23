"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const server = (0, server_1.build)();
try {
    server.listen({ port: 3000 });
    console.log('Server started successfully');
}
catch (err) {
    server.log.error(err);
    process.exit(1);
}
