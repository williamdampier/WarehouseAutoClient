export type Option = { value: string; label: string }
export type Guid = string; // обычно Guid представлен как string в TS

export interface BalanceRequest {
    ResourceFilterIds: Guid[];
    UnitFilterIds: Guid[];
}

export interface BalanceResponse {
    BalanceId: Guid;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number; // decimal в C# обычно number в TS
}

export interface CustomersRequest {
    Id?: Guid | null;
    Name: string;
    Address: string;
    Status?: number | null; // byte → number
}

export interface CustomersResponse {
    Id: Guid;
    Name: string;
    Address: string;
    Status: number;
}

export interface InboundResourceRequest {
    Id?: Guid | null;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number;
}

export interface InboundResourceResponse {
    Id: Guid;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number;
}

export interface InboundDocumentRequest {
    Id?: Guid | null;
    DocumentNumber: string;
    DateReceived: string; // DateTime обычно string ISO в JSON
    Resources: InboundResourceRequest[];
}

export interface InboundDocumentResponse {
    Id: Guid;
    DocumentNumber: string;
    DateReceived: string;
    Resources: InboundResourceResponse[];
}

export interface OutboundResourceRequest {
    Id?: Guid | null;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number;
}

export interface OutboundResourceResponse {
    Id: Guid;
    ResourceId: Guid;
    UnitId: Guid;
    Quantity: number;
}

export interface OutboundDocumentRequest {
    Id?: Guid | null;
    DocumentNumber: string;
    CustomerId: Guid;
    DateShipped: string;
    Status: number;
    Resources: OutboundResourceRequest[];
}

export interface OutboundDocumentResponse {
    Id: Guid;
    DocumentNumber: string;
    CustomerId: Guid;
    DateShipped: string;
    Status: number;
    Resources: OutboundResourceResponse[];
}

export interface Resources {
    Id?: Guid | null;
    Name: string;
    Status?: number | null;
}

export interface ResourcesResponse {
    Id: Guid;
    Name: string;
    Status: number;
}

export interface Units {
    Id?: Guid | null;
    Name: string;
    Status?: number | null;
}

export interface UnitsResponse {
    Id: Guid;
    Name: string;
    Status: number;
}

