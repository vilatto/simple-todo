import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.js';
import { initializeDatabase } from './db/schema.js';
import { todoRoutes } from './routes/todos.js';

const fastify = Fastify({
  logger: config.nodeEnv === 'development',
});

await fastify.register(cors, {
  origin: config.corsOrigin,
});

initializeDatabase();

fastify.register(todoRoutes, { prefix: '/api' });

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
