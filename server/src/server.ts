import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config.js';
import { initializeDatabase } from './db/schema.js';
import { todoRoutes } from './routes/todos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Serve static files in production
if (config.nodeEnv === 'production') {
  // In production Docker, client dist is at /app/client/dist
  // __dirname is /app/server/dist/server/src, so we need to go up to /app then to client/dist
  const clientPath = join(__dirname, '../../../../client/dist');

  await fastify.register(fastifyStatic, {
    root: clientPath,
    prefix: '/',
  });

  // SPA fallback - serve index.html for all non-API routes
  fastify.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api')) {
      reply.code(404).send({ error: 'Not Found' });
    } else {
      return reply.sendFile('index.html');
    }
  });
}

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
