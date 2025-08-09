import { useEffect, useState } from "react";
import type { Customer } from "../types";
import { getCustomers } from "../api/Disctionaries/customersApi";


// Hook for fetching customers
export function useFetchCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getCustomers()
            .then((data) => setCustomers(data))
            .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
            .finally(() => setLoading(false));
    }, []);

    return { customers, loading, error };
}