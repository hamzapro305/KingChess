"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { register } from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        if (isRegistering) {
            try {
                await register({ email, password });
                setIsRegistering(false);
                setError("Account created. Sign in to continue.");
            } catch (registrationError) {
                setError(
                    registrationError instanceof Error
                        ? registrationError.message
                        : "Registration failed",
                );
            } finally {
                setIsLoading(false);
            }
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/",
        });

        if (!result?.ok) {
            setError("Invalid email or password");
            setIsLoading(false);
            return;
        }

        window.location.assign(result.url ?? "/");
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
            >
                <div className="mb-8">
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
                        ChessNode
                    </p>
                    <h1 className="text-3xl font-bold text-white">
                        {isRegistering ? "Create your account" : "Sign in to play"}
                    </h1>
                </div>

                <div className="space-y-5">
                    <label className="block text-sm font-medium text-slate-300">
                        Email
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Password
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        />
                    </label>
                </div>

                {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-7 w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading
                        ? isRegistering
                            ? "Creating account..."
                            : "Signing in..."
                        : isRegistering
                            ? "Create account"
                            : "Sign in"}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setIsRegistering((current) => !current);
                        setError("");
                    }}
                    className="mt-4 w-full text-sm text-slate-400 transition hover:text-white"
                >
                    {isRegistering
                        ? "Already have an account? Sign in"
                        : "Need an account? Register"}
                </button>
            </form>
        </main>
    );
}