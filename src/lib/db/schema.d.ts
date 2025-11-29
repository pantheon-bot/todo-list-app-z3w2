export interface TodosTable {
  id: number;
  title: string;
  description: string | null;
  is_completed: number; // TiDB/MySQL uses TINYINT for boolean (0 or 1)
  created_at: Date;
  updated_at: Date;
}

export interface DB {
  todos: TodosTable;
}