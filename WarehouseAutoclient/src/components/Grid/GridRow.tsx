import type { Header } from "./Grid";

type GridRowProps<T extends { id: string | number }> = {
    row: T;
    headers: Header[];
    buttonColumn?: {
        key: string;
        label: string;
        onClick: (row: T) => void;
    };
    onRowClick?: (row: T) => void;
};

export function GridRow<T extends { id: string | number }>({
    row,
    headers,
    buttonColumn,
    onRowClick,
}: GridRowProps<T>) {
    return (
        <tr key={row.id} onClick={onRowClick ? () => onRowClick(row) : undefined}>
            {headers.map((header, i) => {
                const value = (row as Record<string, unknown>)[header.accessor];
                const isButton = buttonColumn && header.accessor === buttonColumn.key;

                return (
                    <td key={i}>
                        {isButton ? (
                            <button onClick={() => buttonColumn!.onClick(row)}>
                                {buttonColumn!.label}
                            </button>
                        ) : Array.isArray(value) && value.length > 0 ? (
                            <table className="embedded-grid" style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        {Object.keys(value[0] ?? {}).map((key) => (
                                            <th key={key} style={{ border: "1px solid #ccc", padding: "4px" }}>
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {value.map((item, index) => (
                                        <tr key={index}>
                                            {Object.entries(item).map(([key, val]) => (
                                                <td key={key} style={{ border: "1px solid #ccc", padding: "4px" }}>
                                                    {String(val ?? "")}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            String(value ?? "")
                        )}
                    </td>
                );
            })}
        </tr>
    );
}