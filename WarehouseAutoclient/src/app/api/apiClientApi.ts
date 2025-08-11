const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(
    category: "dictionaries" | "warehouse" | "",
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    // Добавляем префикс к URL, если указан category
    const url = `${BASE_URL}${category ? `/${category}` : ""}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "API request failed");
    }

    return response.json() as Promise<T>;
}