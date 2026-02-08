export interface Task {
  id: number;
  name: string;
  description: string;
  statusId: number;
  dueDate?: string;
}

export interface Status {
  id: number;
  name: string;
}
