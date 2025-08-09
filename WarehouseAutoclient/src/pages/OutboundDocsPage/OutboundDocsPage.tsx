import { useCallback, useEffect, useState } from "react";
import type { Option, OutboundDocument, OutboundResource } from "../../app/types";
import type { Header } from "../../components/Grid/Grid";
import { getOutboundDocuments } from "../../app/api/Warehouse/outboundDocumentsApi";
import { MultiSelect } from "../../components/MultiSelect/MultiSelect";
import Grid from "../../components/Grid/Grid";

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

// Dummy options for resources, units, customers - replace with real API calls or dictionary
const resourceOptions: Option[] = [
    { value: "res1", label: "Ресурс 1" },
    { value: "res2", label: "Ресурс 2" },
    { value: "res3", label: "Ресурс 3" },
];
const unitOptions: Option[] = [
    { value: "unit1", label: "Ед. измерения 1" },
    { value: "unit2", label: "Ед. измерения 2" },
    { value: "unit3", label: "Ед. измерения 3" },
];
const customerOptions: Option[] = [
    { value: "cust1", label: "Клиент 1" },
    { value: "cust2", label: "Клиент 2" },
    { value: "cust3", label: "Клиент 3" },
];

const OutboundDocsPage = () => {
    const [documents, setDocuments] = useState<OutboundDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters state
    const [selectedCustomers, setSelectedCustomers] = useState<Option[]>([]);
    const [selectedResources, setSelectedResources] = useState<Option[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

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
            return selectedCustomerIds.includes(doc.CustomerId);
        })
        : documents;

    // Prepare rows for Grid
    const rows = filteredDocs.map((doc) => {
        const resourceNames = doc.Resources
            .map((r: OutboundResource) => {
                const opt = resourceOptions.find((o) => o.value === r.ResourceId);
                return opt ? opt.label : r.ResourceId;
            })
            .join(", ");

        const unitNames = doc.Resources
            .map((r: OutboundResource) => {
                const opt = unitOptions.find((o) => o.value === r.UnitId);
                return opt ? opt.label : r.UnitId;
            })
            .join(", ");

        const totalQuantity = doc.Resources.reduce((sum: number, r: OutboundResource) => sum + r.Quantity, 0);

        // Find customer name from dummy list or fallback
        const customer = customerOptions.find((c) => c.value === doc.CustomerId);

        return {
            id: doc.Id ?? doc.DocumentNumber,
            DocumentNumber: doc.DocumentNumber,
            DateShipped: doc.DateShipped.slice(0, 10),
            CustomerName: customer?.label ?? doc.CustomerId,
            StatusButton: getStatusButton(doc.Status),
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
                        options={customerOptions}
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

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

            {!loading && !error && <Grid headers={headers} rows={rows} />}
        </div>
    );
};

export default OutboundDocsPage;
