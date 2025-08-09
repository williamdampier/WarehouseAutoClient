import { useEffect, useState } from "react";
import Grid, { type Header } from "../../components/Grid/Grid";
import type { Unit } from "../../app/types";


const headers: Header[] = [
    { label: "Название", accessor: "Name" },
    { label: "Статус", accessor: "StatusLabel" },
    // Если понадобится кнопка — можно добавить здесь, например:
    // { label: "Действия", accessor: "actions" },
];

const UnitsPage = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dictionaries/units?status=1`);
            if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
            const data: Unit[] = await res.json();
            setUnits(data);
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
        fetchUnits();
    }, []);

    // Добавляем id (обязательное поле) и удобный статус для отображения
    const rows = units.map((u) => ({
        id: u.Id ?? u.Name, // на всякий случай Id или fallback на Name
        Name: u.Name,
        StatusLabel: u.Status === 1 ? "Активен" : "Неактивен",
    }));

    return (
        <div className="page">
            <h1>Единицы измерения</h1>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

            {!loading && !error && <Grid headers={headers} rows={rows} />}
        </div>
    );
};

export default UnitsPage;
