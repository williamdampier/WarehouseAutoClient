import { useEffect, useState } from 'react'
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import Grid from '../../components/Grid/Grid';
import type { Option } from '../../app/types';


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

const headers = ["Номер", "Ресурс", "Единица измерения", "Количество"];

const allRows = [
    { Number: "1", Resource: "Water", Unit: "L", Quantity: "10" },
    { Number: "2", Resource: "Oil", Unit: "L", Quantity: "5" },
    { Number: "3", Resource: "Gas", Unit: "kg", Quantity: "20" }
]



const BalancePage = () => {
    const [selectedResources, setSelectedResources] = useState<Option[]>([])
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([])
    const [appliedFilters, setAppliedFilters] = useState<{ resOptions: Option[]; unitOptions: Option[] }>({
        resOptions: [],
        unitOptions: [],
    })


    // Заготовка для фильтрации, сейчас просто возвращает все данные
    const filteredRows = allRows.filter(row => {

        // Фильтр по выбранным ресурсам
        if (appliedFilters.resOptions.length > 0) {
            const selectedRes = appliedFilters.resOptions.map(opt => opt.label);
            if (!selectedRes.includes(row.Resource)) return false;
        }

        // Фильтр по выбранным единицам измерения
        if (appliedFilters.unitOptions.length > 0) {
            const selectedUnitsLabels = appliedFilters.unitOptions.map(opt => opt.label);
            if (!selectedUnitsLabels.includes(row.Unit)) return false;
        }

        return true;
    });

    const handleApply = () => {
        setAppliedFilters({ resOptions: selectedResources, unitOptions: selectedUnits })
        // TODO: добавить фильтрацию filteredRows по appliedFilters
    }



    useEffect(() => { }, [appliedFilters])

    return (
        <div className="page">
            <h1>Баланс</h1>
            <div className="filters">
                <div className="filter-group">
                    <label>Ресурс</label>
                    <MultiSelect
                        options={resources}
                        selected={selectedResources}
                        onChange={setSelectedResources}
                        placeholder="Выберите опции"
                    />
                </div>

                <div className="filter-group">
                    <label>Единица измерения</label>
                    <MultiSelect
                        options={units}
                        selected={selectedUnits}
                        onChange={setSelectedUnits}
                        placeholder="Выберите категории"
                    />
                </div>

                <div className="apply-button-container">
                    <button onClick={handleApply}>Применить</button>
                </div>
            </div>
            <Grid headers={headers} rows={filteredRows} />
        </div>
    )
}

export default BalancePage;
