import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchResources } from "../../app/hooks/useFetchResources";
import type { FieldConfig, Resource } from "../../app/types";
import { useState } from "react";
import { archiveResource, createResource, deleteResource, updateResource } from "../../app/api/Dictionaries/resourcesApi";
import ActionPopup from "../../components/ActionPopup/ActionPopup";


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

    const handleRowClick = async (selectedResource: Resource) => {
        setSelectedResource(selectedResource);
        setPopupMode("edit")
    };


    const handleCreate = async (newResource: Resource) => {
        console.log("Creating Resource:", newResource);
        createResource(newResource);
        setPopupMode("create")
        refetch();
    };

    const handleSave = async (updatedResource: Resource) => {
        console.log("Saving Resource:", updatedResource);
        if (updatedResource.id) {
            updateResource(updatedResource.id, updatedResource);
        } else {
            console.error("Resource id is missing.");
        }
        setPopupMode(null)
        refetch();
    };

    const handleDelete = async (resourceToDelete: Resource) => {
        console.log("Deleting Resource:", resourceToDelete);
        if (resourceToDelete.id) {
            deleteResource(resourceToDelete.id);
        } else {
            console.error("Resource id is missing.");
        }
        setPopupMode(null)
        refetch();
    };

    const handleArchive = async (resourceToArchive: Resource) => {
        console.log("Archiving Resource:", resourceToArchive);
        if (resourceToArchive.id) {
            archiveResource(resourceToArchive.id);
        } else {
            console.error("Resource id is missing.");
        }
        setPopupMode(null)
        refetch();
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedResource(null);
    }


    return (
        <div className="page">
            <h1>Ресурсы</h1>

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
