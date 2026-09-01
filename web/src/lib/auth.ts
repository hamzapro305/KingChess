import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                let response: Response;
                try {
                    response = await fetch(`${backendUrl}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        cache: "no-store",
                    });
                } catch {
                    return null;
                }

                if (!response.ok) {
                    return null;
                }

                const data = (await response.json()) as { access_token?: string };
                if (!data.access_token) {
                    return null;
                }

                return {
                    id: credentials.email,
                    email: credentials.email,
                    accessToken: data.access_token,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.sub ?? "";
            session.accessToken = token.accessToken;
            return session;
        },
    },
};