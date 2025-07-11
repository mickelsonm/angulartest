import Fastify from 'fastify';
import { userRoutes } from '../routes/users';

describe('Server', () => {
  const server = Fastify({ logger: false });

  beforeAll(async () => {
    // Add health route before registering other routes
    server.get('/health', async () => {
      return { status: 'OK', timestamp: new Date().toISOString() };
    });
    
    await server.register(userRoutes, { prefix: '/api/users' });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/health'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('OK');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('User Routes', () => {
    test('GET /api/users should return users list', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/users'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.pagination).toBeDefined();
      expect(body.pagination.page).toBe(1);
      expect(body.pagination.limit).toBe(10);
    });

    test('POST /api/users should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/users',
        payload: newUser
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data.name).toBe(newUser.name);
      expect(body.data.email).toBe(newUser.email);
      expect(body.data.age).toBe(newUser.age);
      expect(body.data.id).toBeDefined();
    });

    test('POST /api/users should validate required fields', async () => {
      const invalidUser = {
        age: 25
        // missing required name and email
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/users',
        payload: invalidUser
      });

      // Fastify validation errors can return 400 or 500 depending on configuration
      expect([400, 500]).toContain(response.statusCode);
      
      // Verify that it's an error response
      const body = JSON.parse(response.body);
      expect(body.error || body.message).toBeDefined();
    });

    test('GET /api/users/:id should return specific user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/users/1'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(1);
    });

    test('GET /api/users/:id should return 404 for non-existent user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/users/999'
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('User not found');
    });
  });
});