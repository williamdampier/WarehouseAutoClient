import Grid from '../../components/Grid/Grid';


const resources = [
    {
        name: "ООО Ромашка",
    },
    {
        name: "ЗАО ТехноИмпекс",
    },
    {
        name: "ИП Иванов И.И.",
    },
    {
        name: "АО МегаСклад",
    },
    {
        name: "ООО ГрузКом",
    },
];
const headers = ["Наименование"];


const ResourcesPage = () => {
    const handleAdd = () => {
        console.log("Добавить нового клиента");
    }

    const handleArchive = () => {
        console.log("Архивировать выбранных клиентов");
    }

    return (
        <div className="page">
            <h1>Ресурсы</h1>
            <div className="filters">
                <div className="buttons-container">
                    <button className="add-button" onClick={handleAdd}>Добавить</button>
                    <button className="archive-button" onClick={handleArchive}>Применить</button>
                </div>
            </div>
            <Grid headers={headers} rows={resources} />
        </div>
    )
}

export default ResourcesPage;
