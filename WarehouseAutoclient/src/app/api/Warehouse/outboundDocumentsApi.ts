
import type { OutboundDocument } from "../../types";
import { apiFetch } from "../apiClientApi";

const basePath = "warehouse";
const resourcePath = "/outbounddocuments";

export const getOutboundDocuments = (params: {
    docNumbers?: string[];
    resourceIds?: string[];
    unitIds?: string[];
    customerIds?: string[];
    startDate?: string; // ISO string
    endDate?: string;   // ISO string
}) => {
    const query = new URLSearchParams();

    params.docNumbers?.forEach((v) => query.append("docNumbers", v));
    params.resourceIds?.forEach((v) => query.append("resourceIds", v));
    params.unitIds?.forEach((v) => query.append("unitIds", v));
    params.customerIds?.forEach((v) => query.append("customerIds", v));
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);

    return apiFetch<OutboundDocument[]>(
        basePath,
        `${resourcePath}?${query.toString()}`
    );
};

export const getOutboundDocumentById = (id: string) =>
    apiFetch<OutboundDocument>(basePath, `${resourcePath}/${id}`);

export const createOutboundDocument = (doc: OutboundDocument) =>
    apiFetch<OutboundDocument>(basePath, resourcePath, {
        method: "POST",
        body: JSON.stringify(doc),
    });

export const updateOutboundDocument = (id: string, doc: OutboundDocument) =>
    apiFetch<OutboundDocument>(basePath, `${resourcePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(doc),
    });

export const signOutboundDocument = (id: string) =>
    apiFetch<void>(basePath, `${resourcePath}/${id}/sign`, { method: "POST" });

export const revokeOutboundDocumentSignature = (id: string) =>
    apiFetch<void>(basePath, `${resourcePath}/${id}/revoke`, { method: "POST" });

export const deleteOutboundDocument = (id: string) =>
    apiFetch<void>(basePath, `${resourcePath}/${id}`, { method: "DELETE" });
