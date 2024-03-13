import { build } from './server.js'

const server = await build();

try {
  server.listen({ port: 3001 });
  console.log('Server started successfully');
} catch (err) {
  server.log.error(err);
  process.exit(1);
}