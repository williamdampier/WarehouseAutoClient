type StatusButtonProps = {
    status: number;
    onClick: () => void;
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
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {label}
        </button>
    );
}

// Utility functions
function getStatusLabel(status: number): string {
    switch (status) {
        case 1:
            return "Не подписан";
        case 2:
            return "Подписан";
        default:
            return "Неизвестно";
    }
}

function getStatusColor(status: number): string {
    switch (status) {
        case 1:
            return "#999"; // gray
        case 2:
            return "#5cb85c"; // green
        default:
            return "#d9534f"; // red
    }
}
