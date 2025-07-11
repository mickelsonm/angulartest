import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// Import routes
import { userRoutes } from './routes/users';
import { postRoutes } from './routes/posts';

const server: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development'
  }
});

const start = async (): Promise<void> => {
  try {
    // Register CORS
    await server.register(cors, {
      origin: true
    });

    // Register Swagger
    await server.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'Fastify Demo API',
          description: 'A demo REST API built with Fastify and TypeScript',
          version: '1.0.0'
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Development server'
          }
        ],
        tags: [
          { name: 'users', description: 'User operations' },
          { name: 'posts', description: 'Post operations' }
        ]
      }
    });

    // Register Swagger UI
    await server.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        }
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true
    });

    // Health check route
    server.get('/health', async (request, reply) => {
      return { status: 'OK', timestamp: new Date().toISOString() };
    });

    // Register routes
    await server.register(userRoutes, { prefix: '/api/users' });
    await server.register(postRoutes, { prefix: '/api/posts' });

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const HOST = process.env.HOST || '0.0.0.0';

    await server.listen({ port: PORT, host: HOST });
    
    console.log(`Server listening on http://${HOST}:${PORT}`);
    console.log(`Swagger documentation available at http://${HOST}:${PORT}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();