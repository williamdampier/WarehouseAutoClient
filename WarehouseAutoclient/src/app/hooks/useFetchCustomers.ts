import { useCallback, useEffect, useState } from "react";
import type { Customer } from "../types";
import { getCustomers } from "../api/Dictionaries/customersApi";

const REFETCH_TIMEOUT = import.meta.env.VITE_REFETCH_TIMEOUT || 300; //default wait 300ms before refetching


// Hook for fetching customers
export function useFetchCustomers(initialArchived: boolean = false) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [archived, setArchived] = useState(initialArchived);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCustomers(archived);
            setCustomers(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [archived]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const refetch = useCallback(
        async (delayMs: number = REFETCH_TIMEOUT) => {
            if (delayMs > 0) {
                await new Promise(res => setTimeout(res, delayMs));
            }
            await fetchCustomers();
        },
        [fetchCustomers]
    );


    return {
        customers,
        loading,
        error,
        archived,
        setArchived,
        refetch
    };
}