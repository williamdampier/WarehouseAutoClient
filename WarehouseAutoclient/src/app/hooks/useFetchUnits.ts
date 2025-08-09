import { useEffect, useState } from "react";
import type { Unit } from "../types";
import { getUnits } from "../api/Dictionaries/unitsApi";

// Hook for fetching units
export function useFetchUnits(initialArchived: boolean = false) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [archived, setArchived] = useState(initialArchived);

    const fetchUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUnits(archived);
            setUnits(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getUnits(archived);
                setUnits(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [archived]);

    return {
        units,
        loading,
        error,
        refetch: fetchUnits,
        archived,
        setArchived,
    }
}