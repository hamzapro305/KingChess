export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    access_token: string;
};

export type RegisterResponse = {
    message: string;
};

export type PrivateResponse = {
    message: string;
    success: boolean;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`/api/${path.replace(/^\//, "")}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers,
        },
    });

    const body = (await response.json().catch(() => null)) as
        | T
        | { message?: string }
        | null;

    if (!response.ok) {
        const errorBody =
            typeof body === "object" && body !== null ? body : null;
        const message =
            errorBody && "message" in errorBody && typeof errorBody.message === "string"
                ? errorBody.message
                : "The request could not be completed";
        throw new Error(message);
    }

    return body as T;
}

export function login(credentials: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}

export function register(credentials: LoginRequest): Promise<RegisterResponse> {
    return request<RegisterResponse>("register", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}

export function getPrivateRoute(): Promise<PrivateResponse> {
    return request<PrivateResponse>("auth/private");
}

export function getUsers(): Promise<unknown[]> {
    return request<unknown[]>("users/getAll");
}