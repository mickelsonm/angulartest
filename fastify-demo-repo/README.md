# Fastify Demo Repository

A TypeScript Fastify API demo showcasing REST endpoints with JSON schema validation, Swagger documentation, and comprehensive error handling.

## Features

- ⚡ **Fast**: Built with Fastify for high performance
- 🔷 **TypeScript**: Full TypeScript support with strict typing
- 📝 **JSON Schema Validation**: Request/response validation using JSON schemas
- 📚 **Swagger Documentation**: Auto-generated API documentation
- 🔄 **REST API**: Complete CRUD operations for Users and Posts
- 📊 **Pagination**: Built-in pagination support
- 🎯 **Error Handling**: Comprehensive error handling with proper HTTP status codes
- 🧪 **Testing Ready**: Jest configuration included
- 🔍 **Code Quality**: ESLint configuration for code consistency

## API Endpoints

### Users
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts (with pagination and filtering)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Health Check
- `GET /health` - Health check endpoint

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fastify-demo-repo.git
cd fastify-demo-repo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### API Documentation

Once the server is running, you can access the Swagger documentation at:
`http://localhost:3000/docs`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## Project Structure

```
src/
├── routes/          # API route handlers
│   ├── users.ts     # User CRUD operations
│   └── posts.ts     # Post CRUD operations
├── schemas/         # JSON schemas for validation
│   ├── user.ts      # User validation schemas
│   └── post.ts      # Post validation schemas
├── types/           # TypeScript type definitions
│   └── index.ts     # Shared interfaces and types
└── index.ts         # Main application entry point
```

## JSON Schema Validation

This project uses Fastify's built-in JSON schema validation for:

- **Request validation**: Body, query parameters, and URL parameters
- **Response validation**: Ensuring consistent API responses
- **Swagger generation**: Automatic API documentation from schemas

Example schema:
```typescript
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
```

## TypeScript Support

Full TypeScript support with:
- Strict type checking
- Interface definitions for all data structures
- Type-safe request/response handling
- Comprehensive type definitions for Fastify

## Environment Variables

The application supports the following environment variables:

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment (development/production)

## Error Handling

Consistent error response format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

Success response format:
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Paginated response format:
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## Sample API Calls

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

### Get Users with Pagination
```bash
curl "http://localhost:3000/api/users?page=1&limit=5"
```

### Create a Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "authorId": 1,
    "published": true
  }'
```

### Filter Posts by Author
```bash
curl "http://localhost:3000/api/posts?authorId=1&published=true"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details.