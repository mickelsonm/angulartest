import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery
} from '../types';
import {
  getUsersRouteSchema,
  getUserByIdRouteSchema,
  createUserRouteSchema,
  updateUserRouteSchema,
  deleteUserRouteSchema
} from '../schemas/user';

// In-memory storage for demo purposes
let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextUserId = 3;

interface GetUsersQuery extends PaginationQuery {}

interface UserParams {
  id: string;
}

const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  // GET /api/users - Get all users with pagination
  fastify.get<{
    Querystring: GetUsersQuery;
    Reply: PaginatedResponse<User>;
  }>('/', {
    schema: getUsersRouteSchema
  }, async (request: FastifyRequest<{ Querystring: GetUsersQuery }>, reply: FastifyReply): Promise<void> => {
    const { page = 1, limit = 10 } = request.query;
    
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedUsers = users.slice(startIndex, endIndex);
    const total = users.length;
    const totalPages = Math.ceil(total / limitNum);

    const response: PaginatedResponse<User> = {
      success: true,
      data: paginatedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    };

    reply.code(200).send(response);
  });

  // GET /api/users/:id - Get user by ID
  fastify.get<{
    Params: UserParams;
    Reply: ApiResponse<User>;
  }>('/:id', {
    schema: getUserByIdRouteSchema
  }, async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> => {
    const userId = parseInt(request.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
      const response: ApiResponse<User> = {
        success: false,
        error: 'User not found'
      };
      reply.code(404).send(response);
      return;
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user
    };

    reply.code(200).send(response);
  });

  // POST /api/users - Create new user
  fastify.post<{
    Body: CreateUserRequest;
    Reply: ApiResponse<User>;
  }>('/', {
    schema: createUserRouteSchema
  }, async (request: FastifyRequest<{ Body: CreateUserRequest }>, reply: FastifyReply): Promise<void> => {
    const { name, email, age } = request.body;

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      const response: ApiResponse<User> = {
        success: false,
        error: 'User with this email already exists'
      };
      reply.code(400).send(response);
      return;
    }

    const newUser: User = {
      id: nextUserId++,
      name,
      email,
      age,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    const response: ApiResponse<User> = {
      success: true,
      data: newUser
    };

    reply.code(201).send(response);
  });

  // PUT /api/users/:id - Update user
  fastify.put<{
    Params: UserParams;
    Body: UpdateUserRequest;
    Reply: ApiResponse<User>;
  }>('/:id', {
    schema: updateUserRouteSchema
  }, async (request: FastifyRequest<{ Params: UserParams; Body: UpdateUserRequest }>, reply: FastifyReply): Promise<void> => {
    const userId = parseInt(request.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      const response: ApiResponse<User> = {
        success: false,
        error: 'User not found'
      };
      reply.code(404).send(response);
      return;
    }

    const { name, email, age } = request.body;

    // Check if email already exists for another user
    if (email) {
      const existingUser = users.find(u => u.email === email && u.id !== userId);
      if (existingUser) {
        const response: ApiResponse<User> = {
          success: false,
          error: 'Email already exists for another user'
        };
        reply.code(400).send(response);
        return;
      }
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(age !== undefined && { age }),
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser
    };

    reply.code(200).send(response);
  });

  // DELETE /api/users/:id - Delete user
  fastify.delete<{
    Params: UserParams;
    Reply: ApiResponse<null>;
  }>('/:id', {
    schema: deleteUserRouteSchema
  }, async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> => {
    const userId = parseInt(request.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      reply.code(404).send(response);
      return;
    }

    users.splice(userIndex, 1);

    const response: ApiResponse<null> = {
      success: true
    };

    reply.code(200).send(response);
  });
};

export { userRoutes };