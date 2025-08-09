import { useEffect, useState } from 'react';
import Grid from '../../components/Grid/Grid';
import { Unit } from '../../types'; // импорт твоих TS типов

const headers = ['Название', 'Статус'];

const UnitsPage = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Функция загрузки единиц измерения с сервера
    const fetchUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dictionaries/units?status=1`);
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            const data: Unit[] = await response.json();
            setUnits(data);
        } catch (err: any) {
            setError(err.message || 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    // Преобразуем Units в формат строк для Grid
    const rows = units.map(u => [
        u.Name,
        u.Status === 1 ? 'Активен' : 'Неактивен'
    ]);

    return (
        <div className="page">
            <h1>Единицы измерения</h1>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

            {!loading && !error && (
                <Grid headers={headers} rows={rows} />
            )}
        </div>
    );
};

export default UnitsPage;
