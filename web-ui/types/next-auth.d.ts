import NextAuth from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string;
      role: string;
      access_token: string;
    };
  }

  interface User {
    id: string;
    name: string;
    role: string;

    //JWT token passed from the server
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    name: string;
    role: string;
    //JWT token passed from the server
    access_token: string;
  }
}