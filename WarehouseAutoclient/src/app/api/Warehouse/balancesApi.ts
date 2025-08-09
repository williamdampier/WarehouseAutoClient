import { apiFetch } from "../apiClientApi";
import type { Balance, BalanceRequest } from "../../types";

export const getBalances = (request: BalanceRequest) =>
    apiFetch<Balance[]>("warehouse", "/balance", {
        method: "POST",
        body: JSON.stringify(request),
    });