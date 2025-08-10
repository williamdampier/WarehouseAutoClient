import { useCallback, useEffect, useState } from "react";
import type { FieldConfig, Option, InboundDocument, InboundResource } from "../../app/types";
import { createInboundDocument, deleteInboundDocument, getInboundDocuments, updateInboundDocument } from "../../app/api/Warehouse/inboundDocumentsApi";
import { MultiSelect } from "../../components/MultiSelect/MultiSelect";
import { GridExtended } from "../../components/Grid/GridExtended";
import { useFetchResources } from "../../app/hooks/useFetchResources";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";
import type { HeaderExtended } from "../../components/Grid/GridExtended";
import Toast from "../../components/Toast/Toast";
import ActionPopup from "../../components/ActionPopup/ActionPopup";
import ResourceEditorTable from "../../components/ActionPopup/ResourceEditorTable";

const REFETCH_TIMEOUT = import.meta.env.VITE_REFETCH_TIMEOUT || 300; //default wait 300ms before refetching

const formatDate = (iso: string) => {
    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const InboundDocsPage = () => {
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

    // Headers for Grid component
    const headers: HeaderExtended<InboundDocument>[] = [
        { label: "Номер", accessor: "documentNumber" },
        {
            label: "Дата",
            accessor: "dateReceived",
            render: (value) =>
                typeof value === "string" ? <>{formatDate(value)}</> : <>—</>
        },
    ];


    const [popupMode, setPopupMode] = useState<"edit" | "create" | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const [documents, setDocuments] = useState<InboundDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters state
    const [selectedDocument, setSelectedDocument] = useState<InboundDocument | null>(null);
    const [selectedResources, setSelectedResources] = useState<Option[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Option[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [resourceOptions, setResourceOptions] = useState<Option[]>([]);
    const [unitOptions, setUnitOptions] = useState<Option[]>([]);


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
            };
            const data = await getInboundDocuments(params);
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

    const refetch = useCallback(
        async (delayMs: number = REFETCH_TIMEOUT) => {
            if (delayMs > 0) {
                await new Promise(res => setTimeout(res, delayMs));
            }
            refetchUnits();
            refetchResources();
            fetchDocuments();
        },
        [refetchUnits, refetchResources, fetchDocuments]
    );


    // Prepare rows for Grid
    const enrichedDocuments: InboundDocument[] = documents.map((doc) => ({
        ...doc,
        resources: (doc.resources ?? []).map((r) => ({
            ...r,
            resourceName: resourceOptions.find((o) => o.value === r.resourceId)?.label ?? r.resourceId,
            unitName: unitOptions.find((o) => o.value === r.unitId)?.label ?? r.unitId,
        })),
    }));

    useEffect(() => {
        const unitOptions: Option[] = units.map((u) => { return { value: u.id || "", label: u.name } })
        setUnitOptions(unitOptions)
    }, [units]);

    useEffect(() => {
        const resourceOptions: Option[] = resources.map((r) => { return { value: r.id || "", label: r.name } })
        setResourceOptions(resourceOptions)
    }, [resources])

    const handleRowClick = async (selectedDoc: InboundDocument) => {
        console.log("Selected document:", selectedDoc);
        setSelectedDocument(selectedDoc);
        setPopupMode("edit")
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedDocument(null);
    }


    const inboundDocumentFields: FieldConfig<InboundDocument>[] = [
        { key: "documentNumber", label: "Номер документа", type: "text" },
        {
            key: "dateReceived",
            label: "Дата поступления",
            type: "date",
        }
    ];


    const handleCreate = async (newDocument: InboundDocument) => {
        try {
            await createInboundDocument(newDocument);
            showToast("Отгрузка создана успешно", "success");
        } catch (error) {
            console.error("Create Inbound Document failed:", error);
            showToast(error instanceof Error ? error.message : "Не удалось создать отгрузку", "error");
        } finally {
            setSelectedDocument(null);
            setPopupMode(null);
            refetch();
        }
    };

    const handleSave = async (updatedDocument: InboundDocument) => {
        try {
            if (updatedDocument.id) {
                const cleanedResources = updatedDocument.resources?.filter(
                    (r) => r.resourceId && r.unitId && r.quantity > 0
                );

                const cleanedDocument = {
                    ...updatedDocument,
                    resources: cleanedResources,
                };
                await updateInboundDocument(updatedDocument.id, cleanedDocument);
                showToast("Отгрузка обновлена успешно", "success");
            } else {
                console.error("Inbound Document id is missing.");
                showToast("Отсутствует идентификатор отгрузки.", "error");
            }
        } catch (error) {
            console.error("Update Inbound Document failed:", error);
            showToast(error instanceof Error ? error.message : "Не удалось обновить отгрузку", "error");
        } finally {
            setSelectedDocument(null);
            setPopupMode(null);
            refetch();
        }
    };

    const handleDelete = async (document: InboundDocument) => {
        try {
            if (document.id) {
                // Call API to delete document
                await deleteInboundDocument(document.id);
                showToast("Отгрузка удалена успешно", "success");
            } else {
                console.error("Inbound Document id is missing.");
                showToast("Отсутствует идентификатор отгрузки.", "error");
            }
        } catch (error) {
            console.error("Delete Inbound Document failed:", error);
            showToast(error instanceof Error ? error.message : "Не удалось удалить отгрузку", "error");
        } finally {
            setSelectedDocument(null);
            setPopupMode(null);
            refetch();
        }
    };


    return (
        <div className="page">
            <h1>Отгрузки</h1>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="buttons-container">
                <button
                    className="apply-button"
                    onClick={() => setPopupMode("create")}
                >
                    Добавить
                </button>
            </div>
            <div className="filters">
                <div className="filter-group">
                    <label>Период с</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <label>по</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
            {unitsError && <p style={{ color: "red" }}>Ошибка загрузки единиц: {unitsError.message}</p>}
            {resourcesError && <p style={{ color: "red" }}>Ошибка загрузки ресурса {resourcesError.message}</p>}


            {(!loading && !error && !unitsError && !resourcesError) &&
                <GridExtended<InboundDocument, InboundResource>
                    rows={enrichedDocuments}
                    onRowClick={handleRowClick}
                    headers={headers}
                    embeddedAccessor="resources"
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
            {
                popupMode === "edit" && selectedDocument && (
                    <ActionPopup<InboundDocument>
                        title={`Редактировать: ${selectedDocument.documentNumber}`}
                        fields={inboundDocumentFields}
                        data={selectedDocument}
                        showArchive={false}
                        onClose={handleClosePopup}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        unitOptions={units}
                        resourceOptions={resources}
                        customContent={(formData, handleChange) => (
                            <ResourceEditorTable
                                resources={formData.resources || []}
                                onChange={(updated) => handleChange("resources", updated)}
                                unitOptions={units}
                                resourceOptions={resources}
                            />
                        )}
                    />
                )
            }

            {
                popupMode === "create" && (
                    <ActionPopup<InboundDocument>
                        title={`Создать: Новый документ`}
                        fields={inboundDocumentFields}
                        showArchive={false}
                        onClose={handleClosePopup}
                        onSave={handleCreate}
                        unitOptions={units}
                        resourceOptions={resources}
                        customContent={(formData, handleChange) => (
                            <ResourceEditorTable
                                resources={formData.resources || []}
                                onChange={(updated) => handleChange("resources", updated)}
                                unitOptions={units}
                                resourceOptions={resources}
                            />
                        )}
                    />
                )
            }
        </div>
    );
};

export default InboundDocsPage;
