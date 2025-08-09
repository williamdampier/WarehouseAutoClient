import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchCustomers } from "../../app/hooks/useFetchCustomers";

const headers: Header[] = [
    { label: "Имя клиента", accessor: "Name" },
    { label: "Адрес", accessor: "Address" }
];

const CustomersPage = () => {
    const { customers, loading, error } = useFetchCustomers();

    const rows = customers.map((c) => ({
        id: c.id ?? c.name,
        Name: c.name,
        Address: c.address
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