// Grid.tsx
import "./Grid.css";
import { GridRow } from "./GridRow";

export interface Header {
    label: string;
    accessor: string;
}

export type GridProps<T extends { id: string | number }> = {
    headers: Header[];
    rows: T[];
    buttonColumn?: {
        key: string;
        label: string;
        onClick: (row: T) => void;
    };
};

export default function Grid<T extends { id: string | number }>({
    headers,
    rows,
    buttonColumn,
}: GridProps<T>) {
    return (
        <table className="simple-grid">
            <thead>
                <tr>
                    {headers.map((header, i) => (
                        <th key={i}>{header.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <GridRow
                        key={row.id}
                        row={row}
                        headers={headers}
                        buttonColumn={buttonColumn}
                    />
                ))}
            </tbody>
        </table>
    );
}
