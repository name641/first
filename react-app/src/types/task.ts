export type Task = {
  id: number;
  title: string;
  description: string;
  deadline?: string | null;
  status?: "todo" | "doing" | "done";
};

export type User = {
  id: number;
  name: string;
};
