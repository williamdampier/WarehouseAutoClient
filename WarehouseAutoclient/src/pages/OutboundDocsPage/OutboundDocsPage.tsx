import { useCallback, useEffect, useState } from "react";
import type { Customer, Option, OutboundDocument, OutboundResource, Resource, Unit } from "../../app/types";
import { getOutboundDocuments } from "../../app/api/Warehouse/outboundDocumentsApi";
import { MultiSelect } from "../../components/MultiSelect/MultiSelect";
import { GridExtended } from "../../components/Grid/GridExtended";
import { useFetchResources } from "../../app/hooks/useFetchResources";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";
import { useFetchCustomers } from "../../app/hooks/useFetchCustomers";
import type { HeaderExtended } from "../../components/Grid/GridExtended";
import { StatusButton } from "../../components/StatusButton/StatusButton";


const docsMock = [{
    "outboundDocumentId": "01987db2-872a-723a-a29c-6f0ab41924bf",
    "documentNumber": "outbound2",
    "customerId": "66f5a092-6877-4f33-a080-498cbbf1940e",
    "dateShipped": "2025-08-06T04:43:51.403Z",
    "status": 1,
    "outboundResources": [
        {
            "outboundResourceId": "77b5bb25-7d8c-44a9-b652-d6f280b687a9",
            "resourceId": "af1d4b2c-0d06-4686-987c-2a00ffa8c39d",
            "unitId": "e6f99443-c91e-4748-a4a8-fe448cfba0a7",
            "quantity": 2
        },
        {
            "outboundResourceId": "80a02750-44e5-4321-aece-8c497d16c6e9",
            "resourceId": "af1d4b2c-0d06-4686-987c-2a00ffa8c39d",
            "unitId": "e6f99443-c91e-4748-a4a8-fe448cfba0a7",
            "quantity": 2
        },
        {
            "outboundResourceId": "d9d29f4c-028e-4743-a3f1-50d5c78110d0",
            "resourceId": "af1d4b2c-0d06-4686-987c-2a00ffa8c39d",
            "unitId": "e6f99443-c91e-4748-a4a8-fe448cfba0a7",
            "quantity": 2
        },
        {
            "outboundResourceId": "ef26cbac-8c0f-475b-b77c-b1445928dc2e",
            "resourceId": "af1d4b2c-0d06-4686-987c-2a00ffa8c39d",
            "unitId": "e6f99443-c91e-4748-a4a8-fe448cfba0a7",
            "quantity": 2
        }
    ]
}]
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

    // Headers for Grid component
    const headers: HeaderExtended<OutboundDocument>[] = [
        { label: "Номер", accessor: "documentNumber" },
        { label: "Дата", accessor: "dateShipped" },
        { label: "Клиент", accessor: "customerId" },
        {
            label: "Статус",
            accessor: "status",
            render: (value, row) => (
                <StatusButton status={value as number} onClick={() => updateStatus(row)} />
            ),
        },
    ];



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

    function updateStatus(doc: OutboundDocument) {
        console.log("Updating status for:", doc.documentNumber);
    }


    // Filters state
    const [selectedCustomers, setSelectedCustomers] = useState<Option[]>([]);
    const [selectedResources, setSelectedResources] = useState<Option[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [resourceOptions, setResourceOptions] = useState<Option[]>([]);
    const [unitOptions, setUnitOptions] = useState<Option[]>([]);
    const [customersOptions, setCustomersOptions] = useState<Option[]>([]);

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

    // Prepare rows for Grid
    const enrichedDocuments: OutboundDocument[] = documents.map((doc) => ({
        ...doc,
        customerName: customersOptions.find((c) => c.value === doc.customerId)?.label ?? doc.customerId,
        resources: (doc.outboundResources ?? []).map((r) => ({
            ...r,
            resourceName: resourceOptions.find((o) => o.value === r.resourceId)?.label ?? r.resourceId,
            unitName: unitOptions.find((o) => o.value === r.unitId)?.label ?? r.unitId,
        })),
    }));


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
            {unitsError && <p style={{ color: "red" }}>Ошибка загрузки единиц: {unitsError.message}</p>}
            {resourcesError && <p style={{ color: "red" }}>Ошибка загрузки ресурса {resourcesError.message}</p>}
            {customersError && <p style={{ color: "red" }}>Ошибка загрузки клиентов: {customersError.message}</p>}


            {(!loading && !error && !unitsError && !resourcesError) &&
                <GridExtended<OutboundDocument, OutboundResource>
                    rows={enrichedDocuments}
                    headers={[
                        { label: "Номер", accessor: "documentNumber" },
                        { label: "Дата", accessor: "dateShipped" },
                        {
                            label: "Клиент",
                            accessor: "customerId",
                            render: (value) => <>{customers.find((c) => c.id === value)?.name ?? value}</>,
                        },
                        {
                            label: "Статус",
                            accessor: "status",
                            render: (value, row) => (
                                <StatusButton status={value as number} onClick={() => updateStatus(row)} />
                            ),
                        },
                    ]}
                    embeddedAccessor="outboundResources"
                    embeddedHeaders={[
                        {
                            label: "Ресурс",
                            accessor: "resourceId",
                            render: (value) => resources.find((r) => r.id === value)?.name ?? value,
                        },
                        {
                            label: "Единица измерения",
                            accessor: "unitId",
                            render: (value) => units.find((u) => u.id === value)?.name ?? value,
                        },
                        {
                            label: "Количество",
                            accessor: "quantity",
                        },
                    ]}
                />}
        </div>
    );
};

export default OutboundDocsPage;
