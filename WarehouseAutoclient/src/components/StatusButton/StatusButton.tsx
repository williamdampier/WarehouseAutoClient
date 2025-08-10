type StatusButtonProps = {
    status: number;
    onClick?: () => void;
};

export function StatusButton({ status, onClick }: StatusButtonProps) {
    const label = getStatusLabel(status);
    const color = getStatusColor(status);

    return (
        <button
            style={{
                backgroundColor: color,
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

// Utility functions
function getStatusLabel(status: number): string {
    switch (status) {
        case 0:
            return "Не подписан";
        case 1:
            return "Подписан";
        default:
            return "Неизвестно";
    }
}

function getStatusColor(status: number): string {
    switch (status) {
        case 0:
            return "#d9534f"; // red
        case 1:
            return "#5cb85c"; // green
        default:
            return "#999"; // gray
    }
}
