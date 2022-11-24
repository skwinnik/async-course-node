export {};

declare global {
  namespace Express {
    interface User {
      id: number;
      user_name: string;
      role_name: string;
    }
  }
}
