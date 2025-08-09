import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";

const headers: Header[] = [
    { label: "Название", accessor: "Name" },
    { label: "Статус", accessor: "StatusLabel" },
    // Если понадобится кнопка — можно добавить здесь, например:
    // { label: "Действия", accessor: "actions" },
];

const UnitsPage = () => {
    const { units, loading, error } = useFetchUnits();

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
