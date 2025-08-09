import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";

const headers: Header[] = [
    { label: "Название", accessor: "Name" }
];

const UnitsPage = () => {
    const { units, loading, error } = useFetchUnits();

    const rows = units.map((u) => ({
        id: u.id,
        Name: u.name
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
