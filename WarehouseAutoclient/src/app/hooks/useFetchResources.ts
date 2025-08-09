import { useEffect, useState } from "react";
import type { Resource } from "../types";
import { getResources } from "../api/Dictionaries/resourcesApi";

// Hook for fetching resources
export function useFetchResources() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getResources()
            .then((data) => setResources(data))
            .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
            .finally(() => setLoading(false));
    }, []);

    return { resources, loading, error };
}