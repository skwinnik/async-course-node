import axios, { AxiosInstance, AxiosResponse } from "axios";
import getConfig from "next/config";
import { TransactionDto } from "@/types/accounting/transaction.dto";

class AccountingService {
  private http: AxiosInstance;
  constructor() {
    const { publicRuntimeConfig } = getConfig();
    this.http = axios.create({
      headers: {
        accept: "application/json",
        contentType: "application/json"
      },
      baseURL: publicRuntimeConfig.baseUrl,
    });
  }

  async getTransactions(userId: string): Promise<TransactionDto[]> {
    const res = await this.http.get<TransactionDto[]>(
      `/b/transactions/all/${userId}`
    );
    if (res.status !== 200)
      throw new Error("Error fetching transactions", {
        cause: res,
      });

    return res.data;
  }
  withToken(token: string) {
    this.http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return this;
  }
}

export const accountingService = new AccountingService();
