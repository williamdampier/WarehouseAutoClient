import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import BalancePage from './pages/BalancePage/BalancePage'
import InboundDocsPage from './pages/InboundDocsPage/InboundDocsPage'
import OutboundDocsPage from './pages/OutboundDocsPage/OutboundDocsPage'
import CustomersPage from './pages/CustomersPage/CustomersPage'
import UnitsPage from './pages/UnitsPage/UnitsPage'
import ResourcesPage from './pages/ResourcesPage/ResourcesPage'

export default function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="page-content">
        <Routes>
          <Route path="/balance" element={<BalancePage />} />
          <Route path="/inbound" element={<InboundDocsPage />} />
          <Route path="/outbound" element={<OutboundDocsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </div>
    </div>
  )
}