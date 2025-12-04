import { Generated, ColumnType, Selectable } from 'kysely';

export interface TodosTable {
  id: Generated<number>;
  title: string;
  description: string | null;
  username: string;
  is_completed: number; // TiDB/MySQL uses TINYINT for boolean (0 or 1)
  created_at: ColumnType<Date, Date | undefined, Date>;
  updated_at: ColumnType<Date, Date | undefined, Date>;
}

export type Todo = Selectable<TodosTable>;

export interface DB {
  todos: TodosTable;
}