// components/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = () => {
    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <DashboardSidebar />
            <div className="flex-fill overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;