import type { Customer } from "../../types";
import { apiFetch } from "../apiClientApi";


export const getCustomers = (archived: boolean = false) =>
    apiFetch<Customer[]>("dictionaries", `/customers?status=${archived ? 2 : 1}`);

export const getCustomerById = (id: string) =>
    apiFetch<Customer>("dictionaries", `/customers/${id}`);

export const createCustomer = (customer: Customer) =>
    apiFetch<Customer>("dictionaries", "/customers", {
        method: "POST",
        body: JSON.stringify(customer),
    });

export const updateCustomer = (id: string, customer: Customer) =>
    apiFetch<Customer>("dictionaries", `/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(customer),
    });

export const deleteCustomer = (id: string) =>
    apiFetch<void>("dictionaries", `/customers/${id}`, {
        method: "DELETE",
    });

export const archiveCustomer = (id: string) =>
    apiFetch<void>("dictionaries", `/customers/${id}`, {
        method: "PATCH",
    });