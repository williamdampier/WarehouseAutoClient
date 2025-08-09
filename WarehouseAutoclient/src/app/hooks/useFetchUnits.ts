import { useEffect, useState } from "react";
import type { Unit } from "../types";
import { getUnits } from "../api/Dictionaries/unitsApi";

// Hook for fetching units
export function useFetchUnits() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getUnits()
            .then((data) => setUnits(data))
            .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
            .finally(() => setLoading(false));
    }, []);

    return { units, loading, error };
}