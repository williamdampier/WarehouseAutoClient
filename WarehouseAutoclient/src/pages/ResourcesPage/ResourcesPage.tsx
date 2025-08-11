import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchResources } from "../../app/hooks/useFetchResources";
import type { FieldConfig, Resource } from "../../app/types";
import { useState } from "react";
import { archiveResource, createResource, deleteResource, updateResource } from "../../app/api/Dictionaries/resourcesApi";
import ActionPopup from "../../components/ActionPopup/ActionPopup";
import Toast from "../../components/Toast/Toast";


const headers: Header[] = [
    { label: "Название ресурса", accessor: "name" }
];

const resourceFields: FieldConfig<Resource>[] = [
    { key: "name", label: "Название", type: "text" }
];

const ResourcesPage = () => {
    const {
        resources,
        loading,
        error,
        archived,
        setArchived,
        refetch
    } = useFetchResources();

    const handleToggleArchive = () => {
        setArchived(!archived);
    };

    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [popupMode, setPopupMode] = useState<"edit" | "create" | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const handleRowClick = async (selectedResource: Resource) => {
        setSelectedResource(selectedResource);
        setPopupMode("edit")
    };


    const handleCreate = async (newResource: Resource) => {
        try {
            await createResource(newResource);
            showToast("Resource created successfully", "success");
        } catch (error) {
            console.error("Create Resource failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to create Resource", "error");
        }
        finally {
            setPopupMode(null)
            refetch();
        };
    }


    const handleSave = async (updatedResource: Resource) => {
        try {
            if (updatedResource.id) {
                await updateResource(updatedResource.id, updatedResource);
                showToast("Resource updated successfully", "success");
            } else {
                console.error("Resource id is missing.");
                showToast("Resource id is missing.", "error");
            }
        } catch (error) {
            console.error("Create Resource failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to create Resource", "error");
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleDelete = async (resourceToDelete: Resource) => {
        try {
            if (resourceToDelete.id) {
                await deleteResource(resourceToDelete.id);
                showToast("Resource deleted successfully", "success");
            } else {
                console.error("Resource id is missing.");
                showToast("Unit ID is missing", "error");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            showToast(
                error instanceof Error ? error.message :
                    "Failed to delete Resource", "error"
            );
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleArchive = async (resourceToArchive: Resource) => {
        try {
            if (resourceToArchive.id) {
                await archiveResource(resourceToArchive.id);
                showToast("Resource archived successfully", "success");
            } else {
                console.error("Resource id is missing.");
                showToast("Resource ID is missing", "error");
            }
        } catch (error) {
            console.error("Archive failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to archive Resource", "error");
        }
        finally {
            setPopupMode(null);
            refetch();
        }
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedResource(null);
    }


    return (
        <div className="page">
            <h1>Ресурсы</h1>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="buttons-container">
                {archived ? (
                    <button className="apply-button" onClick={handleToggleArchive}>
                        К рабочим
                    </button>
                ) : (
                    <>
                        <button
                            className="apply-button"
                            onClick={() => setPopupMode("create")}
                        >
                            Добавить
                        </button>
                        <button
                            className="archive-button"
                            onClick={handleToggleArchive}
                        >
                            К архиву
                        </button>
                    </>
                )}
            </div>
            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error.message}</p>}

            {
                !loading && !error &&
                <Grid
                    headers={headers}
                    rows={resources.filter((r): r is Resource & { id: string | number } => r.id !== undefined && r.id !== null)}
                    onRowClick={archived ? undefined : (resource) => handleRowClick(resource)}
                />
            }

            {
                popupMode === "edit" && selectedResource && (
                    <ActionPopup<Resource>
                        title={`Редактировать: ${selectedResource.name}`}
                        fields={resourceFields}
                        data={selectedResource}
                        showArchive={true}
                        onClose={handleClosePopup}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                    />
                )
            }

            {
                popupMode === "create" && (
                    <ActionPopup<Resource>
                        title={`Создать: Новый ресурс`}
                        fields={resourceFields}
                        showArchive={false}
                        onClose={handleClosePopup}
                        onSave={handleCreate}
                    />
                )
            }

        </div >
    );
};

export default ResourcesPage;
