export type Option = { value: string; label: string }
export type Guid = string; // обычно Guid представлен как string в TS


export interface Resource {
    Id?: Guid | null;
    Name: string;
    Status?: number | null;
}

export interface Unit {
    Id?: Guid | null;
    Name: string;
    Status?: number | null;
}
export interface Customer {
    Id?: Guid | null;
    Name: string;
    Address: string;
    Status?: number | null; // byte → number
}

export interface BalanceRequest {
    ResourceFilterIds: Guid[];
    UnitFilterIds: Guid[];
}

export interface Balance {
    BalanceId: Guid;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number; // decimal в C# обычно number в TS
}

export interface InboundResource {
    Id?: Guid | null;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number;
}

export interface InboundDocument {
    Id?: Guid | null;
    DocumentNumber: string;
    DateReceived: string; // DateTime обычно string ISO в JSON
    Resources: InboundResource[];
}

export interface OutboundResource {
    Id?: Guid | null;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number;
}

export interface OutboundDocument {
    Id?: Guid | null;
    DocumentNumber: string;
    CustomerId: Guid;
    DateShipped: string;
    Status: number;
    Resources: OutboundResource[];
}



