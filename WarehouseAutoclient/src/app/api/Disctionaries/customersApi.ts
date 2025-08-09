import type { Customer } from "../../types";
import { apiFetch } from "../apiClientApi";


export const getCustomers = () =>
    apiFetch<Customer[]>("dictionary", "/customers");

export const getCustomerById = (id: string) =>
    apiFetch<Customer>("dictionary", `/customers/${id}`);

export const createCustomer = (customer: Customer) =>
    apiFetch<Customer>("dictionary", "/customers", {
        method: "POST",
        body: JSON.stringify(customer),
    });

export const updateCustomer = (id: string, customer: Customer) =>
    apiFetch<Customer>("dictionary", `/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(customer),
    });

export const deleteCustomer = (id: string) =>
    apiFetch<void>("dictionary", `/customers/${id}`, {
        method: "DELETE",
    });
