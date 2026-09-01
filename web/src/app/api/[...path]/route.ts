import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";

const hopByHopHeaders = [
    "connection",
    "content-length",
    "host",
    "keep-alive",
    "transfer-encoding",
    "upgrade",
];

export const dynamic = "force-dynamic";

async function proxy(request: NextRequest, context: { params: { path: string[] } }) {
    const isPrivateRoute =
        context.params.path[0] === "users" ||
        (context.params.path[0] === "auth" && context.params.path[1] === "private");

    if (isPrivateRoute) {
        const session = await getServerSession(authOptions);
        if (!session?.accessToken) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        request.headers.set("Authorization", `Bearer ${session.accessToken}`);
    }

    const target = new URL(context.params.path.join("/"), `${backendUrl.replace(/\/$/, "")}/`);
    target.search = request.nextUrl.search;

    const headers = new Headers(request.headers);
    for (const header of hopByHopHeaders) {
        headers.delete(header);
    }

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const response = await fetch(target, {
        method: request.method,
        headers,
        body: hasBody ? await request.arrayBuffer() : undefined,
        redirect: "manual",
        cache: "no-store",
    });

    const responseHeaders = new Headers(response.headers);
    for (const header of hopByHopHeaders) {
        responseHeaders.delete(header);
    }

    return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    });
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;