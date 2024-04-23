import dotenv from 'dotenv';
import { build } from './server.js'

dotenv.config();

const dbName: string | undefined = process.env["DB_NAME"];

const server = await build(dbName);

try {
  server.listen({ port: 3001 });
  console.log('Server started successfully');
} catch (err) {
  server.log.error(err);
  process.exit(1);
}