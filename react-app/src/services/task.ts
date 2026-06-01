//Api通信（axios）と外部処理
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export type ReorderPayload = {
  id: number;
  status: string;
  order: number;
};

export const reorderTask = (
  payload: ReorderPayload[],
  token: string
) => {
  return axios.put(
    `${API_URL}/tasks/reorder`,
    payload,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );
};

export const getTaskById = (
  id: string,
  token: string
) => {
  return axios.get(
    `${API_URL}/tasks/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateTask = (
  id: string,
  data: {
    title: string;
    description: string;
    deadline: string | null;
    status: "todo" | "doing" | "done";
  },
  token: string
) => {
  return axios.put(
    `${API_URL}/tasks/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteTask = (
  id: string,
  token: string
) => {
  return axios.delete(
    `${API_URL}/tasks/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createTask = (
  data: {
    title: string;
    description: string;
    deadline: string | null;
    status: "todo" | "doing" | "done";
  },
  token: string
) => {
  return axios.post(`${API_URL}/tasks`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};