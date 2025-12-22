export interface Todo {
  id: number;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;

  // Future extensibility (nullable fields)
  dueDate?: string;
  priority?: 1 | 2 | 3;
  notes?: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface CreateTodoDto {
  description: string;
  dueDate?: string;
  priority?: 1 | 2 | 3;
  tags?: string[];
}

export interface UpdateTodoDto {
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 1 | 2 | 3;
  notes?: string;
  tags?: string[];
}
