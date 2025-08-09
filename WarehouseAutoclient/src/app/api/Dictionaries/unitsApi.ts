import type { Unit } from "../../types";
import { apiFetch } from "../apiClientApi";

export const getUnits = (archived: boolean = false) =>
    apiFetch<Unit[]>("dictionaries", `/units?status=${archived ? 2 : 1}`);

export const getUnitById = (id: string) =>
    apiFetch<Unit>("dictionaries", `/units/${id}`);

export const createUnit = (unit: Unit) =>
    apiFetch<Unit>("dictionaries", "/units", {
        method: "POST",
        body: JSON.stringify(unit),
    });

export const updateUnit = (id: string, unit: Unit) =>
    apiFetch<Unit>("dictionaries", `/units/${id}`, {
        method: "PUT",
        body: JSON.stringify(unit),
    });

export const deleteUnit = (id: string) =>
    apiFetch<void>("dictionaries", `/units/${id}`, {
        method: "DELETE",
    });

export const archiveUnit = (id: string) =>
    apiFetch<void>("dictionaries", `/units/${id}`, {
        method: "PATCH",
    });
