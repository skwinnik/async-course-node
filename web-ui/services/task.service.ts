import axios, { AxiosInstance, AxiosResponse } from "axios";
import getConfig from "next/config";
import { TaskDto } from "@/types/task/task.dto";

class TaskService {
  private http: AxiosInstance;
  constructor() {
    const { publicRuntimeConfig } = getConfig();
    this.http = axios.create({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      baseURL: publicRuntimeConfig.baseUrl,
    });
  }

  async getAll(userId: string): Promise<TaskDto[]> {
    const res = await this.http.get<TaskDto[]>(`/b/tasks/all/${userId}`);
    if (res.status !== 200)
      throw new Error("Error fetching tasks", {
        cause: res,
      });

    return res.data;
  }

  async complete(taskId: number): Promise<void> {
    const res = await this.http.post("/b/tasks/complete", { id: taskId });
    if (res.status !== 201)
      throw new Error("Error completing task", {
        cause: res,
      });
  }

  withToken(token: string) {
    this.http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return this;
  }
}

export const taskService = new TaskService();
