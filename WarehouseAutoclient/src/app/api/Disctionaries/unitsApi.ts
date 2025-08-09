import type { Unit } from "../../types";
import { apiFetch } from "../apiClientApi";

export const getUnits = () => apiFetch<Unit[]>("dictionary", "/units");

export const getUnitById = (id: string) =>
    apiFetch<Unit>("dictionary", `/units/${id}`);

export const createUnit = (unit: Unit) =>
    apiFetch<Unit>("dictionary", "/units", {
        method: "POST",
        body: JSON.stringify(unit),
    });

export const updateUnit = (id: string, unit: Unit) =>
    apiFetch<Unit>("dictionary", `/units/${id}`, {
        method: "PUT",
        body: JSON.stringify(unit),
    });

export const deleteUnit = (id: string) =>
    apiFetch<void>("dictionary", `/units/${id}`, {
        method: "DELETE",
    });