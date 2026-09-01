import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";

export async function POST(request: NextRequest) {
    const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: await request.arrayBuffer(),
        cache: "no-store",
    });

    return new NextResponse(response.body, {
        status: response.status,
        headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
}