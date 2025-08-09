import { apiFetch } from "../apiClientApi";
import type { Balance } from "../../types";

export const getBalances = (request: Balance) =>
    apiFetch<Balance[]>("warehouse", "/balance", {
        method: "POST",
        body: JSON.stringify(request),
    });