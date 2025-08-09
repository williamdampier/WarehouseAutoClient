export type Option = { value: string; label: string }
export type Guid = string; // обычно Guid представлен как string в TS


export interface Resource {
    id?: Guid | null;
    name: string;
    status?: number | null;
}

export interface Unit {
    id?: Guid | null;
    name: string;
    status: number;
}

export interface Customer {
    id?: Guid | null;
    name: string;
    address: string;
    status?: number | null; // byte → number
}

export interface BalanceRequest {
    resourceFilterIds: Guid[];
    unitFilterIds: Guid[];
}

export interface Balance {
    balanceId: Guid;
    resourceId: Guid;
    unitId: Guid;
    quantity: number; // decimal → number
}

export interface InboundResource {
    id?: Guid | null;
    resourceId: Guid;
    unitId: Guid;
    quantity: number;
}

export interface InboundDocument {
    id?: Guid | null;
    documentNumber: string;
    dateReceived: string; // ISO string
    resources: InboundResource[];
}

export interface OutboundResource {
    id?: Guid | null;
    resourceId: Guid;
    unitId: Guid;
    quantity: number;
}

export interface OutboundDocument {
    id?: Guid | null;
    documentNumber: string;
    customerId: Guid;
    dateShipped: string;
    status: number;
    resources: OutboundResource[];
}

export interface FieldConfig<T> {
    key: keyof T;
    label: string;
    type: "text" | "number" | "select" | "checkbox";
    options?: string[]; // for select
    hidden?: boolean;
    disabled?: boolean;
}



