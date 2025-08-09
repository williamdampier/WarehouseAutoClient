import { useCallback, useEffect, useState } from "react";
import type { Customer, Option, OutboundDocument, OutboundResource, Resource, Unit } from "../../app/types";
import type { Header } from "../../components/Grid/Grid";
import { getOutboundDocuments } from "../../app/api/Warehouse/outboundDocumentsApi";
import { MultiSelect } from "../../components/MultiSelect/MultiSelect";
import Grid from "../../components/Grid/Grid";
import { useFetchResources } from "../../app/hooks/useFetchResources";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";
import { useFetchCustomers } from "../../app/hooks/useFetchCustomers";

// Helper to render status button with colors
const getStatusButton = (statusNum: number) => {
    const statusMap: Record<number, { label: string; color: string }> = {
        0: { label: "Unsigned", color: "gray" },
        1: { label: "Signed", color: "green" },
        2: { label: "Pending", color: "orange" }, // example additional status
    };
    const { label, color } = statusMap[statusNum] ?? { label: "Unknown", color: "gray" };
    return (
        <button
            style={{
                backgroundColor: color,
                color: "white",
                border: "none",
                padding: "3px 8px",
                borderRadius: "4px",
                cursor: "default",
            }}
            disabled
        >
            {label}
        </button>
    );
};

// Headers for Grid component
const headers: Header[] = [
    { label: "Номер", accessor: "DocumentNumber" },
    { label: "Дата отгрузки", accessor: "DateShipped" },
    { label: "Клиент", accessor: "CustomerName" },
    { label: "Статус", accessor: "StatusButton" },
    { label: "Ресурсы", accessor: "Resources" },
    { label: "Единицы измерения", accessor: "Units" },
    { label: "Количество", accessor: "Quantity" },
];


const OutboundDocsPage = () => {
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

    const {
        customers,
        loading: customersLoading,
        error: customersError,
        refetch: refetchCustomers
    } = useFetchCustomers();


    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };
    const refetch = useCallback(() => {
        refetchUnits();
        refetchResources();
    }, [refetchUnits, refetchResources]);

    const [documents, setDocuments] = useState<OutboundDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);




    // Filters state
    const [selectedCustomers, setSelectedCustomers] = useState<Option[]>([]);
    const [selectedResources, setSelectedResources] = useState<Option[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Convert Resource and Unit arrays to Option[] for MultiSelect
    const resourceOptions: Option[] = resources.map((r: Resource) => ({
        value: r.id ?? r.name, // fallback to Name if Id missing
        label: r.name,
    }));
    const unitOptions: Option[] = units.map((u: Unit) => ({
        value: u.id ?? u.name,
        label: u.name,
    }));

    const customersOptions: Option[] = customers.map((u: Customer) => ({
        value: u.id ?? u.name,
        label: u.name,
    }));

    // Fetch documents from API
    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                resourceIds: selectedResources.map((r) => r.value),
                unitIds: selectedUnits.map((u) => u.value),
                // For customers filter, you may need to map customer values to IDs if different
            };
            const data = await getOutboundDocuments(params);
            setDocuments(data);
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
            else setError("Неизвестная ошибка");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, selectedResources, selectedUnits]);

    // Refresh data when filters change
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Filter by selected customers client-side if needed
    const filteredDocs = selectedCustomers.length > 0
        ? documents.filter((doc) => {
            // Here you need to match doc.CustomerId to selected customers by value (assuming value = customer Id)
            const selectedCustomerIds = selectedCustomers.map((c) => c.value);
            return selectedCustomerIds.includes(doc.customerId);
        })
        : documents;

    // Prepare rows for Grid
    const rows = filteredDocs.map((doc) => {
        const resourceNames = doc.resources
            .map((r: OutboundResource) => {
                const opt = resourceOptions.find((o) => o.value === r.resourceId);
                return opt ? opt.label : r.resourceId;
            })
            .join(", ");

        const unitNames = doc.resources
            .map((r: OutboundResource) => {
                const opt = unitOptions.find((o) => o.value === r.unitId);
                return opt ? opt.label : r.unitId;
            })
            .join(", ");

        const totalQuantity = doc.resources.reduce((sum: number, r: OutboundResource) => sum + r.quantity, 0);

        // Find customer name from dummy list or fallback
        const customer = customersOptions.find((c) => c.value === doc.customerId);

        return {
            id: doc.id ?? doc.documentNumber,
            DocumentNumber: doc.documentNumber,
            DateShipped: doc.dateShipped.slice(0, 10),
            CustomerName: customer?.label ?? doc.customerId,
            StatusButton: getStatusButton(doc.status),
            Resources: resourceNames,
            Units: unitNames,
            Quantity: totalQuantity.toString(),
        };
    });

    return (
        <div className="page">
            <h1>Отгрузки</h1>

            <div className="filters">
                <div className="filter-group">
                    <label>Период с</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <label>по</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="filter-group">
                    <label>Клиенты</label>
                    <MultiSelect
                        options={customersOptions}
                        selected={selectedCustomers}
                        onChange={setSelectedCustomers}
                        placeholder="Выберите клиентов"
                    />
                </div>

                <div className="filter-group">
                    <label>Ресурсы</label>
                    <MultiSelect
                        options={resourceOptions}
                        selected={selectedResources}
                        onChange={setSelectedResources}
                        placeholder="Выберите ресурсы"
                    />
                </div>

                <div className="filter-group">
                    <label>Единицы измерения</label>
                    <MultiSelect
                        options={unitOptions}
                        selected={selectedUnits}
                        onChange={setSelectedUnits}
                        placeholder="Выберите единицы"
                    />
                </div>
            </div>

            {(loading || resourcesLoading || unitsLoading || customersLoading) && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
            {unitsError && <p style={{ color: "red" }}>Ошибка загрузки единиц: {unitsError}</p>}
            {resourcesError && <p style={{ color: "red" }}>Ошибка загрузки ресурса {unitsError}</p>}
            {customersError && <p style={{ color: "red" }}>Ошибка загрузки клиентов: {customersError}</p>}


            {(!loading && !error && !unitsError && !resourcesError) && <Grid headers={headers} rows={rows} />}
        </div>
    );
};

export default OutboundDocsPage;
