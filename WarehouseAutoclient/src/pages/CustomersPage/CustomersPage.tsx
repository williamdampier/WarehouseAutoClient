import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchCustomers } from "../../app/hooks/useFetchCustomers";

const headers: Header[] = [
    { label: "Имя клиента", accessor: "Name" },
    { label: "Адрес", accessor: "Address" },
    { label: "Статус", accessor: "StatusLabel" },
];

const CustomersPage = () => {
    const { customers, loading, error } = useFetchCustomers();

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