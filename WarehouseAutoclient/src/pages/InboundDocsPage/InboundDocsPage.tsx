import { useEffect, useState } from "react";
import Grid, { type Header } from "../../components/Grid/Grid";
import type { Option, InboundDocument, Resource, Unit } from "../../app/types";
import { MultiSelect } from "../../components/MultiSelect/MultiSelect";
import { getInboundDocuments } from "../../app/api/Warehouse/inboundDocumentsApi";
import { useFetchResources } from "../../app/hooks/useFetchResources";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";

const headers: Header[] = [
    { label: "Номер", accessor: "DocumentNumber" },
    { label: "Дата", accessor: "DateReceived" },
    { label: "Ресурсы", accessor: "Resources" },
    { label: "Единицы измерения", accessor: "Units" },
    { label: "Количество", accessor: "Quantity" },
];

const InboundDocsPage = () => {
    const [documents, setDocuments] = useState<InboundDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { resources, loading: resourcesLoading, error: resourcesError } = useFetchResources();
    const { units, loading: unitsLoading, error: unitsError } = useFetchUnits();

    // Convert Resource and Unit arrays to Option[] for MultiSelect
    const resourceOptions: Option[] = resources.map((r: Resource) => ({
        value: r.Id ?? r.Name, // fallback to Name if Id missing
        label: r.Name,
    }));
    const unitOptions: Option[] = units.map((u: Unit) => ({
        value: u.Id ?? u.Name,
        label: u.Name,
    }));

    // Filter states:
    const [selectedResources, setSelectedResources] = useState<Option[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInboundDocuments({});
            setDocuments(data);
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
            else setError("Неизвестная ошибка");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Filtering client-side by selected filters
    const filteredDocs = documents.filter((doc) => {
        // Date filter
        if (startDate && doc.DateReceived < startDate) return false;
        if (endDate && doc.DateReceived > endDate) return false;

        // Filter by resources if selected
        if (selectedResources.length > 0) {
            // Check if doc.Resources includes any selected resource value
            const resourceIds = selectedResources.map((r) => r.value);
            const hasResource = doc.Resources.some((res) =>
                resourceIds.includes(res.ResourceId)
            );
            if (!hasResource) return false;
        }

        // Filter by units if selected
        if (selectedUnits.length > 0) {
            const unitIds = selectedUnits.map((u) => u.value);
            const hasUnit = doc.Resources.some((res) =>
                unitIds.includes(res.UnitId)
            );
            if (!hasUnit) return false;
        }

        return true;
    });

    // Map filtered docs to rows for Grid
    const rows = filteredDocs.map((doc) => {
        const resourceNames = doc.Resources
            .map((r) => {
                // Map ResourceId to label for display
                const option = resourceOptions.find((o) => o.value === r.ResourceId);
                return option ? option.label : r.ResourceId;
            })
            .join(", ");

        const unitNames = doc.Resources
            .map((r) => {
                const option = unitOptions.find((o) => o.value === r.UnitId);
                return option ? option.label : r.UnitId;
            })
            .join(", ");

        const totalQuantity = doc.Resources.reduce((sum, r) => sum + r.Quantity, 0);

        return {
            id: doc.Id ?? doc.DocumentNumber,
            DocumentNumber: doc.DocumentNumber,
            DateReceived: doc.DateReceived.slice(0, 10),
            Resources: resourceNames,
            Units: unitNames,
            Quantity: totalQuantity.toString(),
        };
    });

    return (
        <div className="page">
            <h1>Поступления</h1>

            <div className="filters">
                <div className="filter-group">
                    <label>Период с</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label>по</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
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

            {(loading || resourcesLoading || unitsLoading) && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
            {unitsError && <p style={{ color: "red" }}>Ошибка загрузки единиц: {unitsError}</p>}
            {resourcesError && <p style={{ color: "red" }}>Ошибка загрузки ресурса {unitsError}</p>}

            {(!loading && !error && !unitsError && !resourcesError) && <Grid headers={headers} rows={rows} />}
        </div>
    );
};

export default InboundDocsPage;
