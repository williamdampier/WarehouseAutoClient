
import { useEffect, useState } from 'react'
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import Grid from '../../components/Grid/Grid';
import type { Option } from '../../app/types';

const getStatusButton = (status: string, id: string) => {
    const colors: Record<string, string> = {
        "Signed": "green",
        "Unsigned": "gray"
    };

    return (
        <button
            onClick={() => alert(`Clicked ${id}`)}
            style={{
                backgroundColor: colors[status] || "gray",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px"
            }}
        >
            {status}
        </button>
    );
};
const customers = [
    { value: "c1", label: "ООО Ромашка" },
    { value: "c2", label: "ЗАО ТехноИмпекс" },
    { value: "c3", label: "ИП Иванов И.И." },
    { value: "c4", label: "АО МегаСклад" },
    { value: "c5", label: "ООО ГрузКом" },
];

const resources: Option[] = [
    { value: 'opt1', label: 'Опция 1' },
    { value: 'opt2', label: 'Опция 2' },
    { value: 'opt3', label: 'Опция 3' },
]

const units: Option[] = [
    { value: 'cat1', label: 'Категория 1' },
    { value: 'cat2', label: 'Категория 2' },
    { value: 'cat3', label: 'Категория 3' },
]

const headers = ['Номер', 'Дата', 'Клиент', 'Статус', 'Ресурс', 'Единица измерения', 'Количество']

const allRows = [
    {
        Номер: "123",
        Дата: "2025-08-01",
        Клиент: "ООО Ромашка",
        Статус: getStatusButton("Signed", "123"),
        Ресурс: "Опция 1",
        'Единица измерения': "Категория 1",
        Количество: "10"
    },
    {
        Номер: "456",
        Дата: "2025-08-03",
        Клиент: "ЗАО Василёк",
        Статус: getStatusButton("Unsigned", "456"),
        Ресурс: "Опция 2",
        'Единица измерения': "Категория 2",
        Количество: "5"
    },
    {
        Номер: "789",
        Дата: "2025-08-05",
        Клиент: "ИП Иванов",
        Статус: getStatusButton("Signed", "789"),
        Ресурс: "Опция 3",
        'Единица измерения': "Категория 3",
        Количество: "20"
    },
];

const OutboundDocsPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedNumbers, setSelectedNumbers] = useState<Option[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<Option[]>([]);
    const [selectedResources, setSelectedResources] = useState<Option[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([]);
    const [appliedFilters, setAppliedFilters] = useState<{
        numOptions: Option[],
        customersOptions: Option[],
        resOptions: Option[],
        unitOptions: Option[]
    }>({
        numOptions: [],
        customersOptions: [],
        resOptions: [],
        unitOptions: [],
    });


    const handleAdd = () => {
        console.log("Добавить новый документ");
        // Можно добавить открытие модального окна или переход на страницу создания
    };

    const handleApply = () => {
        setAppliedFilters({
            customersOptions: selectedCustomers,
            numOptions: selectedNumbers,
            resOptions: selectedResources,
            unitOptions: selectedUnits,
        });
    };

    const filteredRows = allRows.filter(row => {
        // Фильтр по дате
        if (startDate && row['Дата'] < startDate) return false;
        if (endDate && row['Дата'] > endDate) return false;

        // Фильтр по выбранным номерам (если есть выбор)
        if (appliedFilters.numOptions.length > 0) {
            const selectedNums = appliedFilters.numOptions.map(opt => opt.label);
            if (!selectedNums.includes(row['Номер'])) return false;
        }

        // Фильтр по выбранным ресурсам
        if (appliedFilters.resOptions.length > 0) {
            const selectedRes = appliedFilters.resOptions.map(opt => opt.label);
            if (!selectedRes.includes(row['Ресурс'])) return false;
        }

        // Фильтр по выбранным единицам измерения
        if (appliedFilters.unitOptions.length > 0) {
            const selectedUnitsLabels = appliedFilters.unitOptions.map(opt => opt.label);
            if (!selectedUnitsLabels.includes(row['Единица измерения'])) return false;
        }

        return true;
    });

    useEffect(() => { }, [appliedFilters])

    return (
        <div className="page">
            <h1>Отгрузки</h1>
            <div className="filters">
                <div className="filter-group">
                    <label>Период</label>
                    <input
                        type="date"
                        className="date-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className="date-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Номер отгрузки</label>
                    <MultiSelect
                        options={resources}
                        selected={selectedNumbers}
                        onChange={setSelectedNumbers}
                        placeholder="Выберите номера"
                    />
                </div>
                <div className="filter-group">
                    <label>Клиент</label>
                    <MultiSelect
                        options={customers}
                        selected={selectedCustomers}
                        onChange={setSelectedCustomers}
                        placeholder="Выберите ресурсы"
                    />
                </div>

                <div className="filter-group">
                    <label>Ресурсы</label>
                    <MultiSelect
                        options={resources}
                        selected={selectedResources}
                        onChange={setSelectedResources}
                        placeholder="Выберите ресурсы"
                    />
                </div>
                <div className="filter-group">
                    <label>Единицы измерения</label>
                    <MultiSelect
                        options={units}
                        selected={selectedUnits}
                        onChange={setSelectedUnits}
                        placeholder="Выберите единицы"
                    />
                </div>

                <div className="buttons-container">
                    <button className="apply-button" onClick={handleApply}>Применить</button>
                    <button className="add-button" onClick={handleAdd}>Добавить</button>
                </div>
            </div>
            <Grid
                headers={headers}
                rows={filteredRows}
                buttonColumn={{
                    key: "sign",
                    label: "Статус",
                    onClick: (user) => alert(`Edit ${user.name}`),
                }}
            />
        </div>
    )
}

export default OutboundDocsPage;