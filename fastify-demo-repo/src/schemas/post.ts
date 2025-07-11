import { apiResponseSchema, paginatedResponseSchema } from './user';

export const postSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    content: { type: 'string' },
    authorId: { type: 'number' },
    published: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'title', 'content', 'authorId', 'published', 'createdAt', 'updatedAt']
};

export const createPostSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    content: { type: 'string', minLength: 1 },
    authorId: { type: 'number', minimum: 1 },
    published: { type: 'boolean', default: false }
  },
  required: ['title', 'content', 'authorId'],
  additionalProperties: false
};

export const updatePostSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    content: { type: 'string', minLength: 1 },
    published: { type: 'boolean' }
  },
  additionalProperties: false
};

export const postParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^\\d+$' }
  },
  required: ['id']
};

export const getPostsQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'string', pattern: '^\\d+$', default: '1' },
    limit: { type: 'string', pattern: '^\\d+$', default: '10' },
    authorId: { type: 'string', pattern: '^\\d+$' },
    published: { type: 'string', enum: ['true', 'false'] }
  }
};

// Route schemas for Swagger documentation
export const getPostsRouteSchema = {
  tags: ['posts'],
  summary: 'Get all posts',
  description: 'Retrieve a paginated list of posts with optional filtering',
  querystring: getPostsQuerySchema,
  response: {
    200: {
      ...paginatedResponseSchema,
      properties: {
        ...paginatedResponseSchema.properties,
        data: {
          type: 'array',
          items: postSchema
        }
      }
    }
  }
};

export const getPostByIdRouteSchema = {
  tags: ['posts'],
  summary: 'Get post by ID',
  description: 'Retrieve a specific post by its ID',
  params: postParamsSchema,
  response: {
    200: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        data: postSchema
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

export const createPostRouteSchema = {
  tags: ['posts'],
  summary: 'Create a new post',
  description: 'Create a new post with the provided information',
  body: createPostSchema,
  response: {
    201: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        data: postSchema
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

export const updatePostRouteSchema = {
  tags: ['posts'],
  summary: 'Update post',
  description: 'Update an existing post with new information',
  params: postParamsSchema,
  body: updatePostSchema,
  response: {
    200: {
      ...apiResponseSchema,
      properties: {
        ...apiResponseSchema.properties,
        data: postSchema
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

export const deletePostRouteSchema = {
  tags: ['posts'],
  summary: 'Delete post',
  description: 'Delete a post by its ID',
  params: postParamsSchema,
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