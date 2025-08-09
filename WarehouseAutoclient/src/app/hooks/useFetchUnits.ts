import { useState, useCallback, useEffect } from "react";
import type { Unit } from "../types";
import { getUnits } from "../api/Dictionaries/unitsApi";

const REFETCH_TIMEOUT = import.meta.env.VITE_REFETCH_TIMEOUT || 300; //default wait 300ms before refetching

export function useFetchUnits(initialArchived: boolean = false) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [archived, setArchived] = useState(initialArchived);

    const fetchUnits = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUnits(archived);
            setUnits(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [archived]);

    useEffect(() => {
        fetchUnits();
    }, [fetchUnits]);

    const refetch = useCallback(
        async (delayMs: number = REFETCH_TIMEOUT) => {
            if (delayMs > 0) {
                await new Promise(res => setTimeout(res, delayMs));
            }
            await fetchUnits();
        },
        [fetchUnits]
    );


    return {
        units,
        loading,
        error,
        archived,
        setArchived,
        refetch
    };
}
