export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_BACKEND_URL is not set");
}

type FetchOptions = RequestInit & {
    headers?: Record<string, string>;
};

export async function fetchClient(endpoint: string, options: FetchOptions = {}) {
    const { headers, ...rest } = options;

    // Default headers
    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Cookies are automatically sent with credentials: 'include'
    // No need to manually add Authorization header

    const config: RequestInit = {
        ...rest,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
        credentials: 'include', // Include cookies in all requests
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            let errorMessage = "Something went wrong";
            try {
                // Clone response to allow reading body twice if needed
                const errorData = await response.clone().json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // If not JSON, try text
                errorMessage = await response.text() || errorMessage;
            }

            // Handle 401 Unauthorized globally
            if (response.status === 401) {
                // Call logout endpoint to clear cookies
                try {
                    await fetch(`${API_BASE_URL}/logout`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                } catch (e) {
                    // Ignore logout errors
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
