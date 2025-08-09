import type { Header } from "./Grid";

type GridRowProps<T extends { id: string | number }> = {
    row: T;
    headers: Header[];
    buttonColumn?: {
        key: string;
        label: string;
        onClick: (row: T) => void;
    };
    onClick?: (row: T) => void; // Optional onClick for the row
};

export function GridRow<T extends { id: string | number }>({
    row,
    headers,
    buttonColumn,
    onClick,
}: GridRowProps<T>) {
    return (
        <tr
            key={row.id}
            onClick={onClick ? () => onClick(row) : undefined}>
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