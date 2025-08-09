
import type { InboundDocument } from "../../types";
import { apiFetch } from "../apiClientApi";

const basePath = "warehouse";
const resourcePath = "/inbounddocuments";

export const getInboundDocuments = (params: {
    docNumbers?: string[];
    resourceIds?: string[];
    unitIds?: string[];
    startDate?: string;  // ISO date string
    endDate?: string;    // ISO date string
}) => {
    const query = new URLSearchParams();

    if (params.docNumbers?.length)
        params.docNumbers.forEach((v) => query.append("docNumbers", v));

    if (params.resourceIds?.length)
        params.resourceIds.forEach((v) => query.append("resourceIds", v));

    if (params.unitIds?.length)
        params.unitIds.forEach((v) => query.append("unitIds", v));

    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);

    return apiFetch<InboundDocument[]>(
        basePath,
        `${resourcePath}?${query.toString()}`
    );
};

export const getInboundDocumentById = (id: string) =>
    apiFetch<InboundDocument>(basePath, `${resourcePath}/${id}`);

export const createInboundDocument = (doc: InboundDocument) =>
    apiFetch<InboundDocument>(basePath, resourcePath, {
        method: "POST",
        body: JSON.stringify(doc),
    });

export const updateInboundDocument = (
    id: string,
    doc: InboundDocument
) =>
    apiFetch<void>(basePath, `${resourcePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(doc),
    });

export const deleteInboundDocument = (id: string) =>
    apiFetch<void>(basePath, `${resourcePath}/${id}`, {
        method: "DELETE",
    });
