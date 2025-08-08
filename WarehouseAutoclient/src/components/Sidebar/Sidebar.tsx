import { NavLink } from 'react-router-dom'
import './Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="app-title">Управление складом</div>

            <div className="sidebar-section">
                <div className="section-title">Склад</div>
                <NavLink to="/balance" className="menu-item">Баланс</NavLink>
                <NavLink to="/inbound" className="menu-item">Поступления</NavLink>
                <NavLink to="/outbound" className="menu-item">Отгрузки</NavLink>
            </div>

            <div className="sidebar-section">
                <div className="section-title">Справочники</div>
                <NavLink to="/customers" className="menu-item">Клиенты</NavLink>
                <NavLink to="/units" className="menu-item">Единицы измерения</NavLink>
                <NavLink to="/resources" className="menu-item">Ресурсы</NavLink>
            </div>
        </div>
    );
}