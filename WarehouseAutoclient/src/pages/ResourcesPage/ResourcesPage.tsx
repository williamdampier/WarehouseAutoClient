import { useEffect, useState } from "react";
import Grid, { type Header } from "../../components/Grid/Grid";
import type { Resource } from "../../app/types";


const headers: Header[] = [
    { label: "Название ресурса", accessor: "Name" },
    { label: "Статус", accessor: "StatusLabel" },
];

const ResourcesPage = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dictionaries/resources?status=1`);
            if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
            const data: Resource[] = await res.json();
            setResources(data);
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
        fetchResources();
    }, []);

    const rows = resources.map((r) => ({
        id: r.Id ?? r.Name,
        Name: r.Name,
        StatusLabel: r.Status === 1 ? "Активен" : "Неактивен",
    }));

    return (
        <div className="page">
            <h1>Ресурсы</h1>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

            {!loading && !error && <Grid headers={headers} rows={rows} />}
        </div>
    );
};

export default ResourcesPage;
