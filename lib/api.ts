export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_BACKEND_URL is not set");
}

type FetchOptions = RequestInit & {
    headers?: Record<string, string>;
};

async function doFetch(url: string, config: RequestInit): Promise<Response> {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    return fetch(fullUrl, config);
}

export async function fetchClient(endpoint: string, options: FetchOptions = {}) {
    const { headers, ...rest } = options;

    // Default headers
    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Cookies are automatically sent with credentials: 'include'
    const config: RequestInit = {
        ...rest,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
        credentials: 'include',
    };

    try {
        let response = await doFetch(endpoint, config);

        // On 401, try to refresh token and retry once
        if (response.status === 401) {
            const refreshRes = await doFetch("/refresh-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (refreshRes.ok) {
                response = await doFetch(endpoint, config);
            }
        }

        if (!response.ok) {
            let errorMessage = "Something went wrong";
            try {
                const errorData = await response.clone().json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = (await response.text()) || errorMessage;
            }

            if (response.status === 401) {
                try {
                    await doFetch("/logout", {
                        method: "POST",
                        credentials: "include",
                    });
                } catch (e) {
                    // ignore
                }
                if (typeof window !== "undefined") {
                    window.location.href = "/sign-in";
                }
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}