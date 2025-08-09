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
        refetch,
        archived,
        setArchived,
    } = useFetchUnits();

    const handleToggleArchive = () => {
        setArchived(!archived);
    };

    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [creating, setCreating] = useState(false);

    const handleRowClick = async (selectedUnit: Unit) => {
        setSelectedUnit(selectedUnit);
        setShowPopup(true);
    };


    const handleCreate = async (newUnit: Unit) => {
        console.log("Creating unit:", newUnit);
        createUnit(newUnit);
        setShowPopup(false);
        refetch();
    };

    const handleSave = async (updatedUnit: Unit) => {
        console.log("Saving unit:", updatedUnit);
        updateUnit(updatedUnit.id, updatedUnit);
        setShowPopup(false);
        refetch();
    };

    const handleDelete = async (unitToDelete: Unit) => {
        console.log("Deleting unit:", unitToDelete);
        deleteUnit(unitToDelete.id);
        setShowPopup(false);
        refetch();
    };

    const handleArchive = async (unitToArchive: Unit) => {
        console.log("Archiving unit:", unitToArchive);
        archiveUnit(unitToArchive.id);
        setShowPopup(false);
        refetch();
    };


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
                            onClick={() => {
                                setCreating(true);
                                setShowPopup(true);
                            }}
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
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

            {
                !loading && !error &&
                <Grid
                    headers={headers}
                    rows={units}
                    onRowClick={(unit) => handleRowClick(unit)}
                />
            }

            {
                showPopup && selectedUnit && (
                    <ActionPopup<Unit>
                        title={`Редактировать: ${selectedUnit.name}`}
                        fields={unitFields}
                        data={selectedUnit}
                        showArchive={true}
                        onClose={() => setShowPopup(false)}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                    />
                )
            }

            {
                showPopup && creating && (
                    <ActionPopup<Unit>
                        title={`Создать: Новая единица измерения}`}
                        fields={unitFields}
                        showArchive={false}
                        onClose={() => { setShowPopup(false); setCreating(false); }}
                        onSave={handleCreate}
                    />
                )
            }

        </div >
    );
};

export default UnitsPage;
