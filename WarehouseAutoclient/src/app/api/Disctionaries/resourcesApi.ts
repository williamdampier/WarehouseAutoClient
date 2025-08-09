import type { Resource } from "../../types";
import { apiFetch } from "../apiClientApi";

export const getResources = () =>
    apiFetch<Resource[]>("dictionary", "/resources");

export const getResourceById = (id: string) =>
    apiFetch<Resource>("dictionary", `/resources/${id}`);

export const createResource = (resource: Resource) =>
    apiFetch<Resource>("dictionary", "/resources", {
        method: "POST",
        body: JSON.stringify(resource),
    });

export const updateResource = (id: string, resource: Resource) =>
    apiFetch<Resource>("dictionary", `/resources/${id}`, {
        method: "PUT",
        body: JSON.stringify(resource),
    });

export const deleteResource = (id: string) =>
    apiFetch<void>("dictionary", `/resources/${id}`, {
        method: "DELETE",
    });