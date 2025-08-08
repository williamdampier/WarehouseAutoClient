import Grid from '../../components/Grid/Grid';


const customers = [
    {
        name: "ООО Ромашка",
        address: "г. Москва, ул. Ленина, д. 10",
    },
    {
        name: "ЗАО ТехноИмпекс",
        address: "г. Санкт-Петербург, пр. Невский, д. 25",
    },
    {
        name: "ИП Иванов И.И.",
        address: "г. Новосибирск, ул. Красный проспект, д. 5",
    },
    {
        name: "АО МегаСклад",
        address: "г. Екатеринбург, ул. Малышева, д. 100",
    },
    {
        name: "ООО ГрузКом",
        address: "г. Казань, ул. Баумана, д. 8",
    },
];
const headers = [
    { label: "Наименование", accessor: "name" },
    { label: "Адрес", accessor: "address" },
];



const CustomersPage = () => {

    const handleAdd = () => {
        console.log("Добавить нового клиента");
    }

    const handleArchive = () => {
        console.log("Архивировать выбранных клиентов");
    }


    return (
        <div className="page">
            <h1>Клиенты</h1>
            <div className="filters">



                <div className="buttons-container">
                    <button className="add-button" onClick={handleAdd}>Добавить</button>
                    <button className="archive-button" onClick={handleArchive}>Применить</button>
                </div>
            </div>
            <Grid headers={headers} rows={customers} />
        </div>
    )
}

export default CustomersPage;
