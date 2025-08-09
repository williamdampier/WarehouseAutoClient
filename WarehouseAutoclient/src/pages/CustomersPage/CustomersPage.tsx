import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchCustomers } from "../../app/hooks/useFetchCustomers";
import type { Customer, FieldConfig } from "../../app/types";
import { useState } from "react";
import { archiveCustomer, createCustomer, deleteCustomer, updateCustomer } from "../../app/api/Dictionaries/customersApi";
import ActionPopup from "../../components/ActionPopup/ActionPopup";

const headers: Header[] = [
    { label: "Имя клиента", accessor: "name" },
    { label: "Адрес", accessor: "address" }
];

const customerFields: FieldConfig<Customer>[] = [
    { key: "name", label: "Название", type: "text" },
    { key: "address", label: "Адрес", type: "text" }
];


const CustomersPage = () => {
    const { customers,
        loading,
        error,
        archived,
        setArchived,
        refetch
    } = useFetchCustomers();

    const handleToggleArchive = () => {
        setArchived(!archived);
    };

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [popupMode, setPopupMode] = useState<"edit" | "create" | null>(null);

    const handleRowClick = async (selectedCustomer: Customer) => {
        setSelectedCustomer(selectedCustomer);
        setPopupMode("edit")
    };


    const handleCreate = async (newCustomer: Customer) => {
        console.log("Creating customer:", newCustomer);
        createCustomer(newCustomer);
        setPopupMode("create")
        refetch();
    };

    const handleSave = async (updatedCustomer: Customer) => {
        console.log("Saving customer:", updatedCustomer);
        if (updatedCustomer.id) {
            updateCustomer(updatedCustomer.id, updatedCustomer);
        } else {
            console.error("Customer id is missing.");
        }

        setPopupMode(null)
        refetch();
    };

    const handleDelete = async (customerToDelete: Customer) => {
        console.log("Deleting customer:", customerToDelete);
        if (customerToDelete.id) {
            deleteCustomer(customerToDelete.id);
        } else {
            console.error("Customer id is missing.");
        }

        setPopupMode(null)
        refetch();
    };

    const handleArchive = async (customerToArchive: Customer) => {
        console.log("Archiving customer:", customerToArchive);
        if (customerToArchive.id) {
            archiveCustomer(customerToArchive.id);
        } else {
            console.error("Customer id is missing.");
        }

        setPopupMode(null)
        refetch();
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedCustomer(null);
    }

    return (
        <div className="page">
            <h1>Клиенты</h1>


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
                    rows={customers.filter((c): c is Customer & { id: string | number } => c.id !== null && c.id !== undefined)}
                    onRowClick={archived ? undefined : (customer) => handleRowClick(customer)}
                />
            }

            {
                popupMode === "edit" && selectedCustomer && (
                    <ActionPopup<Customer>
                        title={`Редактировать: ${selectedCustomer.name}`}
                        fields={customerFields}
                        data={selectedCustomer}
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
                    <ActionPopup<Customer>
                        title={`Создать: Новая единица измерения`}
                        fields={customerFields}
                        showArchive={false}
                        onClose={handleClosePopup}
                        onSave={handleCreate}
                    />
                )
            }
        </div>
    );
};

export default CustomersPage;