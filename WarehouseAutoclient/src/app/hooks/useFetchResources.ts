import { useCallback, useEffect, useState } from "react";
import type { Resource } from "../types";
import { getResources } from "../api/Dictionaries/resourcesApi";

const REFETCH_TIMEOUT = import.meta.env.VITE_REFETCH_TIMEOUT || 300; //default wait 300ms before refetching

// Hook for fetching resources
export function useFetchResources(initialArchived: boolean = false) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [archived, setArchived] = useState(initialArchived);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getResources(archived);
            setResources(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [archived]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const refetch = useCallback(
        async (delayMs: number = REFETCH_TIMEOUT) => {
            if (delayMs > 0) {
                await new Promise(res => setTimeout(res, delayMs));
            }
            await fetchResources();
        },
        [fetchResources]
    );

    return {
        resources,
        loading,
        error,
        archived,
        setArchived,
        refetch
    };
}