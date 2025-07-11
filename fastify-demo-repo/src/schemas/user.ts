export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'number', minimum: 0, maximum: 150 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'name', 'email', 'createdAt', 'updatedAt']
};

export const createUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    age: { type: 'number', minimum: 0, maximum: 150 }
  },
  required: ['name', 'email'],
  additionalProperties: false
};

export const updateUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    age: { type: 'number', minimum: 0, maximum: 150 }
  },
  additionalProperties: false
};

export const userParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^\\d+$' }
  },
  required: ['id']
};

export const getUsersQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'string', pattern: '^\\d+$', default: '1' },
    limit: { type: 'string', pattern: '^\\d+$', default: '10' }
  }
};

export const apiResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {},
    error: { type: 'string' }
  },
  required: ['success']
};

export const paginatedResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: { type: 'array' },
    pagination: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        limit: { type: 'number' },
        total: { type: 'number' },
        totalPages: { type: 'number' }
      },
      required: ['page', 'limit', 'total', 'totalPages']
    }
  },
  required: ['success', 'data', 'pagination']
};

// Route schemas for Swagger documentation
export const getUsersRouteSchema = {
  tags: ['users'],
  summary: 'Get all users',
  description: 'Retrieve a paginated list of users',
  querystring: getUsersQuerySchema,
  response: {
    200: {
      ...paginatedResponseSchema,
      properties: {
        ...paginatedResponseSchema.properties,
        data: {
          type: 'array',
          items: userSchema
        }
      }
    }
  }
};

export const getUserByIdRouteSchema = {
  tags: ['users'],
  summary: 'Get user by ID',
  description: 'Retrieve a specific user by their ID',
  params: userParamsSchema,
  response: {
    200: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        data: userSchema
      }
    },
    404: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        success: { type: 'boolean', enum: [false] },
        error: { type: 'string' }
      }
    }
  }
};

export const createUserRouteSchema = {
  tags: ['users'],
  summary: 'Create a new user',
  description: 'Create a new user with the provided information',
  body: createUserSchema,
  response: {
    201: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        data: userSchema
      }
    },
    400: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        success: { type: 'boolean', enum: [false] },
        error: { type: 'string' }
      }
    }
  }
};

export const updateUserRouteSchema = {
  tags: ['users'],
  summary: 'Update user',
  description: 'Update an existing user with new information',
  params: userParamsSchema,
  body: updateUserSchema,
  response: {
    200: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        data: userSchema
      }
    },
    404: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        success: { type: 'boolean', enum: [false] },
        error: { type: 'string' }
      }
    }
  }
};

export const deleteUserRouteSchema = {
  tags: ['users'],
  summary: 'Delete user',
  description: 'Delete a user by their ID',
  params: userParamsSchema,
  response: {
    200: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        success: { type: 'boolean', enum: [true] }
      }
    },
    404: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        success: { type: 'boolean', enum: [false] },
        error: { type: 'string' }
      }
    }
  }
};