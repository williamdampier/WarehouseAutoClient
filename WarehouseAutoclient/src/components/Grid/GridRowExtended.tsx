import React from "react";

type GridHeader<T> = {
    label: string;
    accessor: keyof T;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type GridRowExtendedProps<TParent, TChild> = {
    row: TParent;
    headers: GridHeader<TParent>[];
    embeddedHeaders: GridHeader<TChild>[];
    embeddedAccessor: keyof TParent;
    rowIndex: number;
    onRowClick?: (row: TParent) => void;
};

export function GridRowExtended<TParent, TChild>({
    row,
    headers,
    embeddedHeaders,
    embeddedAccessor,
    rowIndex,
    onRowClick
}: GridRowExtendedProps<TParent, TChild>) {
    const embeddedRows = row[embeddedAccessor] as unknown as TChild[];

    return (
        <>
            {embeddedRows.length === 0 ? (
                <tr key={`${rowIndex}-empty`} className="grid-embedded-row" onClick={() => onRowClick?.(row)}>
                    {headers.map((h) => (
                        <td key={String(h.accessor)} className="grid-parent-cell">
                            {h.render?.(row[h.accessor], row) ?? (row[h.accessor] as React.ReactNode)}
                        </td>
                    ))}
                    {embeddedHeaders.map((h) => (
                        <td key={String(h.accessor)} className="grid-empty-cell">
                            {/* Optional: show placeholder or leave blank */}
                            <em style={{ color: "#999" }}>—</em>
                        </td>
                    ))}
                </tr>
            ) : (
                embeddedRows.map((child, childIndex) => (
                    <tr key={`${rowIndex}-${childIndex}`} className="grid-embedded-row" onClick={() => onRowClick?.(row)}>
                        {headers.map((h) =>
                            childIndex === 0 ? (
                                <td key={String(h.accessor)} rowSpan={embeddedRows.length} className="grid-parent-cell">
                                    {h.render?.(row[h.accessor], row) ?? (row[h.accessor] as React.ReactNode)}
                                </td>
                            ) : null
                        )}
                        {embeddedHeaders.map((h) => (
                            <td key={String(h.accessor)}>
                                {h.render?.(child[h.accessor], child) ?? (child[h.accessor] as React.ReactNode)}
                            </td>
                        ))}
                    </tr>
                ))
            )}
        </>
    );
}
