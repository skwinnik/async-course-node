import NextAuth, { NextAuthOptions } from "next-auth";
import { authService } from "@/services/auth.service";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginDto } from "@/types/auth/login.dto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials.password)
          return null;

        const response = await authService.login(
          new LoginDto(credentials.username, credentials.password)
        );

        if (response.status !== 201) return null;

        // If no error and we have user data, return it
        if (response.status === 201 && response.data) {
          return response.data;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          id: user.id,
          name: user.name,
          role: user.role,
          access_token: user.access_token,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        role: token.role,
        access_token: token.access_token,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
