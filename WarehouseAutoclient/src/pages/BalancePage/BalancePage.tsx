import { useEffect, useState, useCallback } from "react"
import type { Balance, BalanceRequest, Option } from "../../app/types"
import { getBalances } from "../../app/api/Warehouse/balancesApi"
import { MultiSelect } from "../../components/MultiSelect/MultiSelect"
import Grid from "../../components/Grid/Grid"


// Dummy options — ideally fetched from API/dictionaries
const resourceOptions: Option[] = [
    { value: 'opt1', label: 'Опция 1' },
    { value: 'opt2', label: 'Опция 2' },
    { value: 'opt3', label: 'Опция 3' },
]

const unitOptions: Option[] = [
    { value: 'cat1', label: 'Категория 1' },
    { value: 'cat2', label: 'Категория 2' },
    { value: 'cat3', label: 'Категория 3' },
]

const headers = [
    { label: 'Номер', accessor: 'Number' },
    { label: 'Ресурс', accessor: 'Resource' },
    { label: 'Единица измерения', accessor: 'Unit' },
    { label: 'Количество', accessor: 'Quantity' },
]

const BalancePage = () => {
    const [balances, setBalances] = useState<Balance[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [selectedResources, setSelectedResources] = useState<Option[]>([])
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([])

    // Fetch balances from API with current filters
    const fetchBalances = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // Build request with selected filter IDs (value = id)
            const request: BalanceRequest = {
                ResourceFilterIds: selectedResources.map((r) => r.value),
                UnitFilterIds: selectedUnits.map((u) => u.value),
            }
            const data = await getBalances(request)
            setBalances(data)
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message)
            else setError('Неизвестная ошибка')
        } finally {
            setLoading(false)
        }
    }, [selectedResources, selectedUnits])

    // Initial fetch on mount
    useEffect(() => {
        fetchBalances()
    }, [fetchBalances])

    // Map API data to grid rows, including resource/unit labels from options
    const rows = balances.map((bal, index) => {
        const resourceLabel = resourceOptions.find((r) => r.value === bal.ResourceId)?.label ?? bal.ResourceId
        const unitLabel = unitOptions.find((u) => u.value === bal.UnitId)?.label ?? bal.UnitId
        return {
            id: `${bal.ResourceId}_${bal.UnitId}_${index}`, // unique id
            Number: index + 1,
            Resource: resourceLabel,
            Unit: unitLabel,
            Quantity: bal.Quantity.toString(),
        }
    })

    return (
        <div className="page">
            <h1>Баланс</h1>

            <div className="filters">
                <div className="filter-group">
                    <label>Ресурс</label>
                    <MultiSelect
                        options={resourceOptions}
                        selected={selectedResources}
                        onChange={setSelectedResources}
                        placeholder="Выберите опции"
                    />
                </div>

                <div className="filter-group">
                    <label>Единица измерения</label>
                    <MultiSelect
                        options={unitOptions}
                        selected={selectedUnits}
                        onChange={setSelectedUnits}
                        placeholder="Выберите категории"
                    />
                </div>

                <div className="apply-button-container">
                    <button onClick={fetchBalances}>Применить</button>
                </div>
            </div>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

            {!loading && !error && <Grid headers={headers} rows={rows} />}
        </div>
    )
}

export default BalancePage
