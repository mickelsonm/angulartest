import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery
} from '../types';
import {
  getPostsRouteSchema,
  getPostByIdRouteSchema,
  createPostRouteSchema,
  updatePostRouteSchema,
  deletePostRouteSchema
} from '../schemas/post';

// In-memory storage for demo purposes
let posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Fastify',
    content: 'Fastify is a fast and low overhead web framework for Node.js.',
    authorId: 1,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'TypeScript Best Practices',
    content: 'Learn how to write better TypeScript code with these best practices.',
    authorId: 2,
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextPostId = 3;

interface GetPostsQuery extends PaginationQuery {
  authorId?: string;
  published?: string;
}

interface PostParams {
  id: string;
}

const postRoutes: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  // GET /api/posts - Get all posts with pagination and filtering
  fastify.get<{
    Querystring: GetPostsQuery;
    Reply: PaginatedResponse<Post>;
  }>('/', {
    schema: getPostsRouteSchema
  }, async (request: FastifyRequest<{ Querystring: GetPostsQuery }>, reply: FastifyReply): Promise<void> => {
    const { page = 1, limit = 10, authorId, published } = request.query;
    
    let filteredPosts = [...posts];

    // Filter by authorId if provided
    if (authorId) {
      const authorIdNum = parseInt(authorId);
      filteredPosts = filteredPosts.filter(post => post.authorId === authorIdNum);
    }

    // Filter by published status if provided
    if (published !== undefined) {
      const isPublished = published === 'true';
      filteredPosts = filteredPosts.filter(post => post.published === isPublished);
    }
    
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limitNum);

    const response: PaginatedResponse<Post> = {
      success: true,
      data: paginatedPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    };

    reply.code(200).send(response);
  });

  // GET /api/posts/:id - Get post by ID
  fastify.get<{
    Params: PostParams;
    Reply: ApiResponse<Post>;
  }>('/:id', {
    schema: getPostByIdRouteSchema
  }, async (request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply): Promise<void> => {
    const postId = parseInt(request.params.id);
    const post = posts.find(p => p.id === postId);

    if (!post) {
      const response: ApiResponse<Post> = {
        success: false,
        error: 'Post not found'
      };
      reply.code(404).send(response);
      return;
    }

    const response: ApiResponse<Post> = {
      success: true,
      data: post
    };

    reply.code(200).send(response);
  });

  // POST /api/posts - Create new post
  fastify.post<{
    Body: CreatePostRequest;
    Reply: ApiResponse<Post>;
  }>('/', {
    schema: createPostRouteSchema
  }, async (request: FastifyRequest<{ Body: CreatePostRequest }>, reply: FastifyReply): Promise<void> => {
    const { title, content, authorId, published = false } = request.body;

    const newPost: Post = {
      id: nextPostId++,
      title,
      content,
      authorId,
      published,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(newPost);

    const response: ApiResponse<Post> = {
      success: true,
      data: newPost
    };

    reply.code(201).send(response);
  });

  // PUT /api/posts/:id - Update post
  fastify.put<{
    Params: PostParams;
    Body: UpdatePostRequest;
    Reply: ApiResponse<Post>;
  }>('/:id', {
    schema: updatePostRouteSchema
  }, async (request: FastifyRequest<{ Params: PostParams; Body: UpdatePostRequest }>, reply: FastifyReply): Promise<void> => {
    const postId = parseInt(request.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      const response: ApiResponse<Post> = {
        success: false,
        error: 'Post not found'
      };
      reply.code(404).send(response);
      return;
    }

    const { title, content, published } = request.body;

    const updatedPost: Post = {
      ...posts[postIndex],
      ...(title && { title }),
      ...(content && { content }),
      ...(published !== undefined && { published }),
      updatedAt: new Date().toISOString()
    };

    posts[postIndex] = updatedPost;

    const response: ApiResponse<Post> = {
      success: true,
      data: updatedPost
    };

    reply.code(200).send(response);
  });

  // DELETE /api/posts/:id - Delete post
  fastify.delete<{
    Params: PostParams;
    Reply: ApiResponse<null>;
  }>('/:id', {
    schema: deletePostRouteSchema
  }, async (request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply): Promise<void> => {
    const postId = parseInt(request.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Post not found'
      };
      reply.code(404).send(response);
      return;
    }

    posts.splice(postIndex, 1);

    const response: ApiResponse<null> = {
      success: true
    };

    reply.code(200).send(response);
  });
};

export { postRoutes };