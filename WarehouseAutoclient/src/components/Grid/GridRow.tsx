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
        <tr
            key={row.id}
            onClick={onRowClick ? () => onRowClick(row) : undefined}>
            {headers.map((header, i) => {
                const value = (row as Record<string, unknown>)[header.accessor];
                const isButton = buttonColumn && header.accessor === buttonColumn.key;

                return (
                    <td key={i}>
                        {isButton ? (
                            <button onClick={() => buttonColumn!.onClick(row)}>
                                {buttonColumn!.label}
                            </button>
                        ) : (
                            String(value ?? "")
                        )}
                    </td>
                );
            })}
        </tr>
    );
}