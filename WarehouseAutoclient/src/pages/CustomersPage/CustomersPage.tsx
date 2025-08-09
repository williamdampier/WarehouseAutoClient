import { useEffect, useState } from "react";
import Grid, { type Header } from "../../components/Grid/Grid";
import type { Customer } from "../../app/types";

const headers: Header[] = [
    { label: "Имя клиента", accessor: "Name" },
    { label: "Адрес", accessor: "Address" },
    { label: "Статус", accessor: "StatusLabel" },
];

const CustomersPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dictionaries/customers?status=1`);
            if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
            const data: Customer[] = await res.json();
            setCustomers(data);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Неизвестная ошибка");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const rows = customers.map((c) => ({
        id: c.Id ?? c.Name,
        Name: c.Name,
        Address: c.Address,
        StatusLabel: c.Status === 1 ? "Активен" : "Неактивен",
    }));

    return (
        <div className="page">
            <h1>Клиенты</h1>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

            {!loading && !error && <Grid headers={headers} rows={rows} />}
        </div>
    );
};

export default CustomersPage;