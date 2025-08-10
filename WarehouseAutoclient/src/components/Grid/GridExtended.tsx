// Grid.tsx
import "./Grid.css";
import { GridRow } from "./GridRow";

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
    buttonColumn,
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
                {rows.map((row, rowIndex) => {
                    const embeddedRows = row[embeddedAccessor] as unknown as TChild[];
                    return embeddedRows.map((child, childIndex) => (
                        <tr key={`${rowIndex}-${childIndex}`} className="grid-embedded-row">
                            {headers.map((h) => (
                                <td key={String(h.accessor)}>
                                    {childIndex === 0
                                        ? h.render?.(row[h.accessor], row) ?? (row[h.accessor] as React.ReactNode)
                                        : null}
                                </td>
                            ))}
                            {embeddedHeaders.map((h) => (
                                <td key={String(h.accessor)}>
                                    {h.render?.(child[h.accessor], child) ?? (child[h.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ));
                })}
            </tbody>
        </table>
    );
}
