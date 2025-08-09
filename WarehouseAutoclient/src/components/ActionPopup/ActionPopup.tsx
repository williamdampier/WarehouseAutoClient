import { useEffect, useState } from "react";
import "./ActionPopup.css";
import type { FieldConfig } from "../../app/types";



interface ActionPopupProps<T extends object> {
    title: string;
    data?: T;
    fields: FieldConfig<T>[];
    showArchive?: boolean;
    createOnly?: boolean;
    onClose: () => void;
    onSave: (data: T) => Promise<void>;
    onDelete?: (data: T) => Promise<void>;
    onArchive?: (data: T) => Promise<void>;
}

import React from "react";

function ActionPopup<T extends object>({
    title,
    data,
    fields,
    showArchive = false,
    createOnly = false,
    onClose,
    onSave,
    onDelete,
    onArchive,
}: ActionPopupProps<T>): React.ReactElement {
    const [loading, setLoading] = useState<"" | "save" | "delete" | "archive">("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<T>(() => data ? { ...data } : {} as T);

    useEffect(() => {
        if (data) {
            setFormData({ ...data });
        }
    }, [data]);

    const handleAction = async (
        action: "save" | "delete" | "archive",
        fn: (data: T) => Promise<void>
    ) => {
        setLoading(action);
        setError("");
        try {
            await fn(formData);
            onClose();
        } catch {
            setError(`Failed to ${action} item.`);
        } finally {
            setLoading("");
        }
    };

    const handleChange = (key: keyof T, value: unknown) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2>{title}</h2>
                {error && <p className="error-text">{error}</p>}

                <div className="form-fields">
                    {fields.map(({ key, label, type, options, hidden, disabled }) => {
                        if (hidden) return null;

                        const value = formData?.[key] ?? "";

                        return (
                            <div key={String(key)} className="form-field">
                                <label>{label}</label>

                                {type === "select" ? (
                                    <select
                                        value={String(value)}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        disabled={disabled}
                                    >
                                        {options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : type === "checkbox" ? (
                                    <input
                                        type="checkbox"
                                        checked={Boolean(value)}
                                        onChange={(e) => handleChange(key, e.target.checked)}
                                        disabled={disabled}
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        value={String(value)}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        disabled={disabled}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="buttons-container">
                    <button
                        className="apply-button"
                        onClick={() => handleAction("save", onSave)}
                        disabled={loading === "save"}
                    >
                        {loading === "save" ? "Saving..." : "Save"}
                    </button>

                    {!createOnly && onDelete && (
                        <button
                            className="add-button"
                            onClick={() => handleAction("delete", onDelete)}
                            disabled={loading === "delete"}
                        >
                            {loading === "delete" ? "Deleting..." : "Delete"}
                        </button>
                    )}

                    {showArchive && onArchive && !createOnly && (
                        <button
                            className="archive-button"
                            onClick={() => handleAction("archive", onArchive)}
                            disabled={loading === "archive"}
                        >
                            {loading === "archive" ? "Archiving..." : "Archive"}
                        </button>
                    )}

                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ActionPopup;
