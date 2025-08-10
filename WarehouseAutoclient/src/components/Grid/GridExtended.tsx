// Grid.tsx
import "./Grid.css";
import { GridRow } from "./GridRow";
import { GridRowExtended } from "./GridRowExtended";

export type HeaderExtended<T, K extends keyof T = keyof T> = {
    label: string;
    accessor: keyof T;
    render?: (value: T[K], row: T) => React.ReactNode;
};

export type GridProps<TParent, TChild> = {
    headers: HeaderExtended<TParent>[];
    rows: TParent[];
    buttonColumn?: {
        key: string;
        label: string;
        onClick: (row: TParent) => void;
    };
    embeddedAccessor: keyof TParent;
    embeddedHeaders: HeaderExtended<TChild>[];
    onRowClick?: (row: TParent) => void;
};

export function GridExtended<TParent, TChild>({
    headers,
    rows,
    embeddedAccessor,
    embeddedHeaders,
    onRowClick
}: GridProps<TParent, TChild>) {
    return (
        <table className="grid-table">
            <thead>
                <tr>
                    {headers.map((h) => (
                        <th key={String(h.accessor)}>{h.label}</th>
                    ))}
                    {embeddedHeaders.map((h) => (
                        <th key={String(h.accessor)}>{h.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <GridRowExtended
                        key={rowIndex}
                        row={row}
                        headers={headers}
                        embeddedHeaders={embeddedHeaders}
                        embeddedAccessor={embeddedAccessor}
                        rowIndex={rowIndex}
                        onRowClick={onRowClick}
                    />
                ))}
            </tbody>
        </table>
    );
}
