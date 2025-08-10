import { useCallback, useEffect, useState } from "react";
import type { FieldConfig, Option, OutboundDocument, OutboundResource } from "../../app/types";
import { createOutboundDocument, deleteOutboundDocument, getOutboundDocuments, revokeOutboundDocumentSignature, signOutboundDocument, updateOutboundDocument } from "../../app/api/Warehouse/outboundDocumentsApi";
import { MultiSelect } from "../../components/MultiSelect/MultiSelect";
import { GridExtended } from "../../components/Grid/GridExtended";
import { useFetchResources } from "../../app/hooks/useFetchResources";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";
import { useFetchCustomers } from "../../app/hooks/useFetchCustomers";
import type { HeaderExtended } from "../../components/Grid/GridExtended";
import { StatusButton } from "../../components/StatusButton/StatusButton";
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
        {
            label: "Дата",
            accessor: "dateShipped",
            render: (value) =>
                typeof value === "string" ? <>{formatDate(value)}</> : <>—</>
        },
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
    ];


    const [popupMode, setPopupMode] = useState<"edit" | "create" | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const [documents, setDocuments] = useState<OutboundDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters state
    const [selectedDocument, setSelectedDocument] = useState<OutboundDocument | null>(null);
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
                customerIds: selectedCustomers.map((c) => c.value)
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
    }, [startDate, endDate, selectedResources, selectedUnits, selectedCustomers]);

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
            refetchCustomers();
            fetchDocuments();
        },
        [refetchUnits, refetchResources, refetchCustomers, fetchDocuments]
    );


    // Prepare rows for Grid
    const enrichedDocuments: OutboundDocument[] = documents.map((doc) => ({
        ...doc,
        customerName: customersOptions.find((c) => c.value === doc.customerId)?.label ?? doc.customerId,
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

    useEffect(() => {
        const customerOptions: Option[] = customers.map((c) => { return { value: c.id || "", label: c.name } })
        setCustomersOptions(customerOptions)
    }, [customers])

    const handleRowClick = async (selectedDoc: OutboundDocument) => {
        if (selectedDoc.status == 2) {
            showToast("Подпись должна быть отозвана перед редактированием", "error")
            return
        }
        console.log("Selected document:", selectedDoc);
        setSelectedDocument(selectedDoc);
        setPopupMode("edit")
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedDocument(null);
    }


    const outboundDocumentFields: FieldConfig<OutboundDocument>[] = [
        { key: "documentNumber", label: "Номер документа", type: "text" },
        {
            key: "customerId",
            label: "Клиент",
            type: "select",
            options: customersOptions,
        },
        {
            key: "dateShipped",
            label: "Дата отгрузки",
            type: "date",
        }
    ];


    const handleCreate = async (newDocument: OutboundDocument) => {
        try {
            await createOutboundDocument(newDocument);
            showToast("Отгрузка создана успешно", "success");
        } catch (error) {
            console.error("Create Outbound Document failed:", error);
            showToast(error instanceof Error ? error.message : "Не удалось создать отгрузку", "error");
        } finally {
            setSelectedDocument(null);
            setPopupMode(null);
            refetch();
        }
    };

    const handleSave = async (updatedDocument: OutboundDocument) => {
        try {
            console.log("Saving Outbound Document:", updatedDocument);
            console.log("JSON Payload:", JSON.stringify(updatedDocument, null, 2));
            if (updatedDocument.id) {
                const cleanedResources = updatedDocument.resources?.filter(
                    (r) => r.resourceId && r.unitId && r.quantity > 0
                );

                const cleanedDocument = {
                    ...updatedDocument,
                    resources: cleanedResources,
                };
                await updateOutboundDocument(updatedDocument.id, cleanedDocument);
                showToast("Отгрузка обновлена успешно", "success");
            } else {
                console.error("Outbound Document id is missing.");
                showToast("Отсутствует идентификатор отгрузки.", "error");
            }
        } catch (error) {
            console.error("Update Outbound Document failed:", error);
            showToast(error instanceof Error ? error.message : "Не удалось обновить отгрузку", "error");
        } finally {
            setSelectedDocument(null);
            setPopupMode(null);
            refetch();
        }
    };

    const handleDelete = async (document: OutboundDocument) => {
        try {
            if (document.id) {
                // Call API to delete document
                await deleteOutboundDocument(document.id);
                showToast("Отгрузка удалена успешно", "success");
            } else {
                console.error("Outbound Document id is missing.");
                showToast("Отсутствует идентификатор отгрузки.", "error");
            }
        } catch (error) {
            console.error("Delete Outbound Document failed:", error);
            showToast(error instanceof Error ? error.message : "Не удалось удалить отгрузку", "error");
        } finally {
            setSelectedDocument(null);
            setPopupMode(null);
            refetch();
        }
    };

    const updateStatus = async (doc: OutboundDocument) => {
        try {
            if (doc.id) {
                if (doc.status === 1) {
                    await signOutboundDocument(doc.id);
                    showToast("Отгрузка успешно подписана", "success");
                } else if (doc.status === 2) {
                    await revokeOutboundDocumentSignature(doc.id);
                    showToast("Подпись отгрузки успешно отозвана", "success");
                } else {
                    showToast("Неверный статус подписи отгрузки.", "error");
                }
            } else {
                console.error("Outbound Document id is missing.");
                showToast("Отсутствует идентификатор отгрузки.", "error");
            }
        } catch (error) {
            console.error("Sign/Unign Outbound Document failed:", error);
            showToast(error instanceof Error ? error.message : "Не удалось обновить подпись отгрузки", "error");
        } finally {
            setSelectedDocument(null);
            setPopupMode(null);
            refetch();
        }
    }


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
                    <ActionPopup<OutboundDocument>
                        title={`Редактировать: ${selectedDocument.documentNumber}`}
                        fields={outboundDocumentFields}
                        data={selectedDocument}
                        showArchive={false}
                        onClose={handleClosePopup}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        unitOptions={units}
                        resourceOptions={resources}
                        customersOptions={customers}
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
                    <ActionPopup<OutboundDocument>
                        title={`Создать: Новый документ`}
                        fields={outboundDocumentFields}
                        showArchive={false}
                        onClose={handleClosePopup}
                        onSave={handleCreate}
                        unitOptions={units}
                        resourceOptions={resources}
                        customersOptions={customers}
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

export default OutboundDocsPage;
