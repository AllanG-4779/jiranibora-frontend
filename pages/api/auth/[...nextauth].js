import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import jwtDecode from "jwt-decode";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "JB project",

      type: "credentials",
      credentials: {
        memberId: {
          label: "memberId",
          type: "text",
        },
        password: { type: "password", label: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          memberId: credentials.memberId,
          password: credentials.password,
        };
        console.log(credentials);
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/auth/login`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!(res.status === 200)) {
          throw new Error("Something went wrong");
        }

        // // decode the token

        // console.log(user1)
        // const user = {
        //   name: user1.name,
        //   role: res.data.role,
        //   access_token: res.data.access_token,
        // };

        if (res.data) {
          console.log(res.data);
          return res.data;
        }
        return null;
      },
    }),
  ],

  secret: process.env.NEXT_PUBLIC_SECRET,
  session: {
    maxAge: 60 * 60,
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },

  jwt: {
    maxAge: 60 * 60,

  },
  pages: { signIn: "/admin/login" },
});
