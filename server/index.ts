import { build } from './server.js'

const server = await build();

try {
  server.listen({ port: 3000 });
  console.log('Server started successfully');
} catch (err) {
  server.log.error(err);
  process.exit(1);
}