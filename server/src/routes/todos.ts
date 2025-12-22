import type { FastifyInstance } from 'fastify';
import { createTodoSchema, updateTodoSchema } from '../middleware/validation.js';
import * as todoQueries from '../db/queries.js';

export async function todoRoutes(fastify: FastifyInstance) {
  fastify.get('/todos', async (request, reply) => {
    const todos = todoQueries.getAllTodos();
    return todos;
  });

  fastify.get('/todos/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const todo = todoQueries.getTodoById(parseInt(id, 10));

    if (!todo) {
      reply.code(404);
      return { error: 'Todo not found' };
    }

    return todo;
  });

  fastify.post('/todos', async (request, reply) => {
    try {
      const validatedData = createTodoSchema.parse(request.body);
      const newTodo = todoQueries.createTodo(validatedData);
      reply.code(201);
      return newTodo;
    } catch (error: any) {
      reply.code(400);
      return { error: error.message || 'Validation failed' };
    }
  });

  fastify.patch('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const validatedData = updateTodoSchema.parse(request.body);
      const updatedTodo = todoQueries.updateTodo(parseInt(id, 10), validatedData);

      if (!updatedTodo) {
        reply.code(404);
        return { error: 'Todo not found' };
      }

      return updatedTodo;
    } catch (error: any) {
      reply.code(400);
      return { error: error.message || 'Validation failed' };
    }
  });

  fastify.delete('/todos/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = todoQueries.deleteTodo(parseInt(id, 10));

    if (!deleted) {
      reply.code(404);
      return { error: 'Todo not found' };
    }

    reply.code(204);
    return;
  });

  fastify.post('/todos/:id/complete', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updatedTodo = todoQueries.toggleTodoCompletion(parseInt(id, 10));

    if (!updatedTodo) {
      reply.code(404);
      return { error: 'Todo not found' };
    }

    return updatedTodo;
  });
}
