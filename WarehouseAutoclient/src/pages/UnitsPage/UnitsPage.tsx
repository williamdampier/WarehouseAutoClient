import { useState } from "react";
import Grid, { type Header } from "../../components/Grid/Grid";
import ActionPopup from "../../components/ActionPopup/ActionPopup";
import { useFetchUnits } from "../../app/hooks/useFetchUnits";
import type { FieldConfig, Unit } from "../../app/types";
import { archiveUnit, createUnit, deleteUnit, updateUnit } from "../../app/api/Dictionaries/unitsApi";


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

    const handleRowClick = async (selectedUnit: Unit) => {
        setSelectedUnit(selectedUnit);
        setPopupMode("edit")
    };


    const handleCreate = async (newUnit: Unit) => {
        console.log("Creating unit:", newUnit);
        createUnit(newUnit);
        setPopupMode("create")
        refetch();
    };

    const handleSave = async (updatedUnit: Unit) => {
        console.log("Saving unit:", updatedUnit);
        if (updatedUnit.id) {
            updateUnit(updatedUnit.id, updatedUnit);
        } else {
            console.error("Unit id is missing.");
        }

        setPopupMode(null)
        refetch();
    };

    const handleDelete = async (unitToDelete: Unit) => {
        console.log("Deleting unit:", unitToDelete);
        if (unitToDelete.id) {
            deleteUnit(unitToDelete.id);
        } else {
            console.error("Unit id is missing.");
        }

        setPopupMode(null)
        refetch();
    };

    const handleArchive = async (unitToArchive: Unit) => {
        console.log("Archiving unit:", unitToArchive);
        if (unitToArchive.id) {
            archiveUnit(unitToArchive.id);
        } else {
            console.error("Unit id is missing.");
        }

        setPopupMode(null)
        refetch();
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedUnit(null);
    }


    return (
        <div className="page">
            <h1>Единицы измерения</h1>

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
