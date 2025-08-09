import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchResources } from "../../app/hooks/useFetchResources";


const headers: Header[] = [
    { label: "Название ресурса", accessor: "Name" },
    { label: "Статус", accessor: "StatusLabel" },
];

const ResourcesPage = () => {
    const { resources, loading, error } = useFetchResources();

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
