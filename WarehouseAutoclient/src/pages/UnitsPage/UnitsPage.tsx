import { useState } from "react";
import Grid, { type Header } from "../../components/Grid/Grid";
import ActionPopup from "../../components/ActionPopup/ActionPopup";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";
import type { FieldConfig, Unit } from "../../app/types";
import { archiveUnit, createUnit, deleteUnit, updateUnit } from "../../app/api/Dictionaries/unitsApi";
import Toast from "../../components/Toast/Toast";


const headers: Header[] = [
    { label: "Название", accessor: "name" }
];

const unitFields: FieldConfig<Unit>[] = [
    { key: "name", label: "Название", type: "text" }
];

const UnitsPage = () => {
    const {
        units,
        loading,
        error,
        archived,
        setArchived,
        refetch
    } = useFetchUnits();

    const handleToggleArchive = () => {
        setArchived(!archived);
    };

    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [popupMode, setPopupMode] = useState<"edit" | "create" | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const handleRowClick = async (selectedUnit: Unit) => {
        setSelectedUnit(selectedUnit);
        setPopupMode("edit")
    };


    const handleCreate = async (newUnit: Unit) => {
        try {
            await createUnit(newUnit);
            showToast("Unit created successfully", "success");
        } catch (error) {
            console.error("Create unit failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to create unit", "error");
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleSave = async (updatedUnit: Unit) => {
        try {
            if (updatedUnit.id) {
                await updateUnit(updatedUnit.id, updatedUnit);
                showToast("Unit updated successfully", "success");
            } else {
                console.error("Unit id is missing.");
                showToast("Unit id is missing.", "error");
            }
        } catch (error) {
            console.error("Create unit failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to create unit", "error");
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleDelete = async (unitToDelete: Unit) => {
        try {
            if (unitToDelete.id) {
                await deleteUnit(unitToDelete.id);
                showToast("Unit deleted successfully", "success");
            }
            else {
                console.error("Unit id is missing.");
                showToast("Unit ID is missing", "error");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            showToast(
                error instanceof Error ? error.message :
                    "Failed to delete unit", "error"
            );
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleArchive = async (unitToArchive: Unit) => {
        try {
            if (unitToArchive.id) {
                await archiveUnit(unitToArchive.id);
                showToast("Unit archived successfully", "success");
            } else {
                console.error("Unit id is missing.");
                showToast("Unit ID is missing", "error");
            }
        } catch (error) {
            console.error("Archive failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to archive unit", "error");
        }
        finally {
            setPopupMode(null);
            refetch();
        }
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedUnit(null);
    }


    return (
        <div className="page">
            <h1>Единицы измерения</h1>
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
                    rows={units.filter((u): u is Unit & { id: string | number } => u.id !== null && u.id !== undefined)}
                    onRowClick={archived ? undefined : (unit) => handleRowClick(unit)}
                />
            }

            {
                popupMode === "edit" && selectedUnit && (
                    <ActionPopup<Unit>
                        title={`Редактировать: ${selectedUnit.name}`}
                        fields={unitFields}
                        data={selectedUnit}
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
                    <ActionPopup<Unit>
                        title={`Создать: Новая единица измерения`}
                        fields={unitFields}
                        showArchive={false}
                        onClose={handleClosePopup}
                        onSave={handleCreate}
                    />
                )
            }

        </div >
    );
};

export default UnitsPage;
