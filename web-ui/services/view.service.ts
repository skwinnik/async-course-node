import { TransactionDto } from "@/types/accounting/transaction.dto";
import { TaskDto } from "@/types/task/task.dto";
import { MeView } from "@/types/view/me.view";
import { IPageRequest } from "@/types/view/page.request";
import { IPageResponse } from "@/types/view/page.response";
import axios, { AxiosInstance } from "axios";
import getConfig from "next/config";

class ViewService {
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

  async getMeView(userId: number | string): Promise<MeView> {
    const res = await this.http.get<MeView>(`/b/view/me/${userId}`);
    if (res.status !== 200)
      throw new Error("Error loading view", {
        cause: res,
      });

    return res.data;
  }

  async getTasks(request: { userId: number | string } & IPageRequest) {
    const res = await this.http.post<IPageResponse<TaskDto>>(
      `/b/view/task/all`,
      request
    );

    if (res.status !== 201)
      throw new Error("Error loading tasks", {
        cause: res,
      });

    return res.data;
  }

  async getTransactions(request: { userId: number | string } & IPageRequest) {
    const res = await this.http.post<IPageResponse<TransactionDto>>(
      `/b/view/transaction/all`,
      request
    );
    if (res.status !== 201)
      throw new Error("Error loading transactions", {
        cause: res,
      });

    return res.data;
  }

  withToken(token: string) {
    this.http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return this;
  }
}

export const viewService = new ViewService();
