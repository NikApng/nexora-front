export type TaskStatus = "todo" | "in-progress" | "done" | "review";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "critical";
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  labels?: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

