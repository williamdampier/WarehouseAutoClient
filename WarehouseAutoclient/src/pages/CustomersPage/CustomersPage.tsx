import Grid, { type Header } from "../../components/Grid/Grid";
import { useFetchCustomers } from "../../app/hooks/useFetchCustomers";
import type { Customer, FieldConfig } from "../../app/types";
import { useState } from "react";
import { archiveCustomer, createCustomer, deleteCustomer, updateCustomer } from "../../app/api/Dictionaries/customersApi";
import ActionPopup from "../../components/ActionPopup/ActionPopup";
import Toast from "../../components/Toast/Toast";

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
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const handleRowClick = async (selectedCustomer: Customer) => {
        setSelectedCustomer(selectedCustomer);
        setPopupMode("edit")
    };


    const handleCreate = async (newCustomer: Customer) => {
        try {
            await createCustomer(newCustomer);
            showToast("Customer created successfully", "success");
        } catch (error) {
            console.error("Create Customer failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to create Customer", "error");
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleSave = async (updatedCustomer: Customer) => {
        try {
            if (updatedCustomer.id) {
                await updateCustomer(updatedCustomer.id, updatedCustomer);
                showToast("Customer updated successfully", "success");
            } else {
                console.error("Customer id is missing.");
                showToast("Customer id is missing.", "error");
            }
        } catch (error) {
            console.error("Create Customer failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to create Customer", "error");
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleDelete = async (customerToDelete: Customer) => {
        try {
            if (customerToDelete.id) {
                await deleteCustomer(customerToDelete.id);
                showToast("UCustomerit deleted successfully", "success");
            } else {
                console.error("Customer id is missing.");
                showToast("Customer ID is missing", "error");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            showToast(
                error instanceof Error ? error.message :
                    "Failed to delete Customer", "error"
            );
        }
        finally {
            setPopupMode(null)
            refetch();
        }
    };

    const handleArchive = async (customerToArchive: Customer) => {
        try {
            if (customerToArchive.id) {
                await archiveCustomer(customerToArchive.id);
                showToast("Unit archived successfully", "success");
            } else {
                console.error("Customer id is missing.");
                showToast("Customer ID is missing", "error");
            }

        } catch (error) {
            console.error("Archive failed:", error);
            showToast(error instanceof Error ? error.message :
                "Failed to archive Customer", "error");
        }
        finally {
            setPopupMode(null);
            refetch();
        }
    };

    const handleClosePopup = () => {
        setPopupMode(null);
        setSelectedCustomer(null);
    }

    return (
        <div className="page">
            <h1>Клиенты</h1>

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