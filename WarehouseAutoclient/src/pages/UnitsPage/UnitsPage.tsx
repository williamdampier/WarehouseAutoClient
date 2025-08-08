
import { useEffect, useState } from 'react'
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import Grid from '../../components/Grid/Grid';


type Option = { value: string; label: string }

const options1: Option[] = [
    { value: 'opt1', label: 'Опция 1' },
    { value: 'opt2', label: 'Опция 2' },
    { value: 'opt3', label: 'Опция 3' },
]

const options2: Option[] = [
    { value: 'cat1', label: 'Категория 1' },
    { value: 'cat2', label: 'Категория 2' },
    { value: 'cat3', label: 'Категория 3' },
]

const headers = ['Колонка 1', 'Колонка 2', 'Колонка 3']

const allRows = [
    ['Ячейка 1', 'Ячейка 2', 'Ячейка 3'],
    ['Ячейка 4', 'Ячейка 5', 'Ячейка 6'],
    ['Ячейка 7', 'Ячейка 8', 'Ячейка 9'],
]

const UnitsPage = () => {
    const [selectedOptions1, setSelectedOptions1] = useState<Option[]>([])
    const [selectedOptions2, setSelectedOptions2] = useState<Option[]>([])
    const [appliedFilters, setAppliedFilters] = useState<{ opt1: Option[]; opt2: Option[] }>({
        opt1: [],
        opt2: [],
    })


    // Заготовка для фильтрации, сейчас просто возвращает все данные
    const filteredRows = allRows // <- сюда можно вставить фильтр по appliedFilters

    const handleApply = () => {
        setAppliedFilters({ opt1: selectedOptions1, opt2: selectedOptions2 })
        // TODO: добавить фильтрацию filteredRows по appliedFilters
    }

    useEffect(() => { }, [appliedFilters])

    return (
        <div className="page">
            <h1>Единицы измерения</h1>
            <div className="filters">
                <div className="filter-group">
                    <label>Мультиселект 1</label>
                    <MultiSelect
                        options={options1}
                        selected={selectedOptions1}
                        onChange={setSelectedOptions1}
                        placeholder="Выберите опции"
                    />
                </div>

                <div className="filter-group">
                    <label>Мультиселект 2</label>
                    <MultiSelect
                        options={options2}
                        selected={selectedOptions2}
                        onChange={setSelectedOptions2}
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

export default UnitsPage;
