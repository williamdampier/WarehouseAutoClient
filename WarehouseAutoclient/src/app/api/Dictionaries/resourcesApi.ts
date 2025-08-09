import type { Resource } from "../../types";
import { apiFetch } from "../apiClientApi";

export const getResources = () =>
    apiFetch<Resource[]>("dictionaries", "/resources");

export const getResourceById = (id: string) =>
    apiFetch<Resource>("dictionaries", `/resources/${id}`);

export const createResource = (resource: Resource) =>
    apiFetch<Resource>("dictionaries", "/resources", {
        method: "POST",
        body: JSON.stringify(resource),
    });

export const updateResource = (id: string, resource: Resource) =>
    apiFetch<Resource>("dictionaries", `/resources/${id}`, {
        method: "PUT",
        body: JSON.stringify(resource),
    });

export const deleteResource = (id: string) =>
    apiFetch<void>("dictionaries", `/resources/${id}`, {
        method: "DELETE",
    });