import db from './db';
import { type Todo } from './schema';

export interface CreateTodoInput {
  title: string;
  description?: string;
  username: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
}

// Convert TiDB's TINYINT to boolean
function mapTodoFromDb(todo: Todo) {
  return {
    ...todo,
    is_completed: Boolean(todo.is_completed),
  };
}

export async function getAllTodos(filter?: { is_completed?: boolean }) {
  let query = db.selectFrom('todos').selectAll().orderBy('created_at', 'desc');

  if (filter?.is_completed !== undefined) {
    query = query.where('is_completed', '=', filter.is_completed ? 1 : 0);
  }

  const todos = await query.execute();
  return todos.map(mapTodoFromDb);
}

export async function getTodoById(id: number) {
  const todo = await db
    .selectFrom('todos')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  return todo ? mapTodoFromDb(todo) : null;
}

export async function createTodo(input: CreateTodoInput) {
  const result = await db
    .insertInto('todos')
    .values({
      title: input.title,
      description: input.description ?? null,
      username: input.username,
      is_completed: 0,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .executeTakeFirstOrThrow();

  return getTodoById(Number(result.insertId));
}

export async function updateTodo(id: number, input: UpdateTodoInput) {
  const updates: Partial<Todo> = {
    updated_at: new Date(),
  };

  if (input.title !== undefined) {
    updates.title = input.title;
  }
  if (input.description !== undefined) {
    updates.description = input.description;
  }
  if (input.is_completed !== undefined) {
    updates.is_completed = input.is_completed ? 1 : 0;
  }

  await db
    .updateTable('todos')
    .set(updates)
    .where('id', '=', id)
    .executeTakeFirstOrThrow();

  return getTodoById(id);
}

export async function deleteTodo(id: number) {
  await db
    .deleteFrom('todos')
    .where('id', '=', id)
    .executeTakeFirstOrThrow();

  return true;
}
