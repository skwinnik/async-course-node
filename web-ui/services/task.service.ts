import axios, { AxiosInstance, AxiosResponse } from "axios";
import { LoggedInDto } from "@/types/auth/loggedIn.dto";
import { LoginDto } from "@/types/auth/login.dto";
import getConfig from "next/config";

class AuthService {
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
  login(dto: LoginDto): Promise<AxiosResponse<LoggedInDto, any>> {
    return this.http.post("/b/auth/login", dto);
  }

  me() {
    return this.http.get("/b/auth/me");
  }

  setToken(token: string) {
    this.http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export const authService = new AuthService();
