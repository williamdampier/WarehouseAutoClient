import type { OutboundResource, FieldOption, InboundResource } from "../../app/types";

interface Props {
    resources: OutboundResource[] | InboundResource[];
    onChange: (updated: OutboundResource[] | InboundResource[]) => void;
    resourceOptions: FieldOption[];
    unitOptions: FieldOption[];
}

export default function ResourceEditorTable({
    resources,
    onChange,
    resourceOptions,
    unitOptions,
}: Props) {
    const handleChange = (
        index: number,
        key: string,
        value: unknown
    ) => {
        const updated = [...resources];
        updated[index] = {
            ...updated[index],
            [key]: value,
        };
        onChange(updated);
    };

    const handleRemove = (index: number) => {
        const updated = [...resources];
        updated.splice(index, 1);
        onChange(updated);
    };

    const handleAdd = () => {
        onChange([
            ...resources,
            { resourceId: "", unitId: "", quantity: 0 },
        ]);
    };

    return (
        <div className="resource-table">
            <h3>Ресурсы</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ресурс</th>
                        <th>Ед. изм.</th>
                        <th>Кол-во</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((res, index) => (
                        <tr key={index}>
                            <td>
                                <select
                                    value={res.resourceId}
                                    onChange={(e) =>
                                        handleChange(index, "resourceId", e.target.value)
                                    }
                                >
                                    {resourceOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={res.unitId}
                                    onChange={(e) =>
                                        handleChange(index, "unitId", e.target.value)
                                    }
                                >
                                    {unitOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={res.quantity}
                                    onChange={(e) =>
                                        handleChange(index, "quantity", Number(e.target.value))
                                    }
                                />
                            </td>
                            <td>
                                <button onClick={() => handleRemove(index)}>❌</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAdd}>➕ Добавить ресурс</button>
        </div>
    );
}
