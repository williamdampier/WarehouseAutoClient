import { useEffect, useState, useCallback } from "react"
import type { Balance, BalanceRequest, Option } from "../../app/types"
import { getBalances } from "../../app/api/Warehouse/balancesApi"
import { MultiSelect } from "../../components/MultiSelect/MultiSelect"
import Grid, { type Header } from "../../components/Grid/Grid"
import { useFetchUnits } from "../../app/hooks/useFetchUnits"
import { useFetchResources } from "../../app/hooks/useFetchResources"

const headers: Header[] = [
    { label: "Ресурс", accessor: "resource" },
    { label: "Единица Измерения", accessor: "unit" },
    { label: "Количество", accessor: "quantity" }
];

const BalancePage = () => {
    const [balances, setBalances] = useState<Balance[]>([]);
    const {
        units,
        loading: unitsLoading,
        error: unitsError,
        refetch: refetchUnits
    } = useFetchUnits();
    const {
        resources,
        loading: resourcesLoading,
        error: resourcesError,
        refetch: refetchResources
    } = useFetchResources();

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedResources, setSelectedResources] = useState<Option[]>([])
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([])

    const [resourceOptions, setResourceOptions] = useState<Option[]>([]);
    const [unitOptions, setUnitOptions] = useState<Option[]>([]);





    // Fetch balances from API with current filters
    const fetchBalances = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const request: BalanceRequest = {
                resourceFilterIds: selectedResources.map((r) => r.value),
                unitFilterIds: selectedUnits.map((u) => u.value),
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

    useEffect(() => {
        const unitOptions: Option[] = units.map((u) => { return { value: u.id || "", label: u.name } })
        setUnitOptions(unitOptions)
    }, [units]);

    useEffect(() => {
        const resourceOptions: Option[] = resources.map((r) => { return { value: r.id || "", label: r.name } })
        setResourceOptions(resourceOptions)
    }, [resources])

    // Map API data to grid rows, including resource/unit labels from options
    const rows = balances.map((bal, index) => {
        const resourceLabel = resources.find((r) => r.id === bal.resourceId)?.name ?? bal.resourceId
        const unitLabel = units.find((u) => u.id === bal.unitId)?.name ?? bal.unitId
        return {
            id: `${bal.resourceId}_${bal.unitId}_${index}`, // unique id
            resource: resourceLabel,
            unit: unitLabel,
            quantity: bal.quantity.toString(),
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

            </div>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

            {!loading && !error && <Grid headers={headers} rows={rows} />}
        </div>
    )
}

export default BalancePage
