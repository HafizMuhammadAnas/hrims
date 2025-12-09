
import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Analysis from './pages/Analysis';
import { ReviewResponses, CompilationCenter, CompiledRecords } from './pages/FederalActions';
import ReceivedRequests from './pages/provincial/ReceivedRequests';
import RequestDistribution from './pages/provincial/RequestDistribution';
import SectorMonitoring from './pages/provincial/SectorMonitoring';
import ResponseCompilation from './pages/provincial/ResponseCompilation';
import SubmissionHistory from './pages/provincial/SubmissionHistory';
import SectorUserManagement from './pages/provincial/SectorUserManagement';
import SectorTasks from './pages/sector/SectorTasks';
import SectorHistory from './pages/sector/SectorHistory';
import { ConventionsInfo, IndicatorsInfo, SDGsInfo, UPRInfo } from './pages/Reports';
import ReportGenerator from './pages/ReportGenerator';
import Profile from './pages/Profile';
import { User } from './types';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPath, setCurrentPath] = useState('/dashboard');

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentPath('/dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPath('/login');
    };

    const renderContent = () => {
        if (!user) {
            return <Login onLogin={handleLogin} />;
        }

        switch (currentPath) {
            case '/dashboard':
                return <Dashboard user={user} onNavigate={setCurrentPath} />;
            // Federal Routes
            case '/requests':
                return <Requests user={user} />;
            case '/analysis':
                return <Analysis />;
            case '/responses':
                return <ReviewResponses />;
            case '/compilation':
                return <CompilationCenter />;
            case '/compiled-records':
                return <CompiledRecords />;
            
            // Provincial Routes
            case '/province-received':
                return <ReceivedRequests user={user} onNavigate={setCurrentPath} />;
            case '/province-distribution':
                return <RequestDistribution user={user} onNavigate={setCurrentPath} />;
            case '/province-monitoring':
                return <SectorMonitoring user={user} onNavigate={setCurrentPath} />;
            case '/province-compilation':
                return <ResponseCompilation user={user} onNavigate={setCurrentPath} />;
            case '/province-history':
                return <SubmissionHistory user={user} />;
            case '/province-users':
                return <SectorUserManagement user={user} />;

            // Sector Routes
            case '/sector-tasks':
                return <SectorTasks user={user} />;
            case '/sector-history':
                return <SectorHistory user={user} />;

            // Shared Reports
            case '/conventions':
                return <ConventionsInfo />;
            case '/indicators':
                return <IndicatorsInfo />;
            case '/sdgs':
                return <SDGsInfo />;
            case '/upr':
                return <UPRInfo />;
            case '/report-generator':
                return <ReportGenerator />;
            case '/profile':
                return <Profile user={user} />;
            default:
                return <Dashboard user={user} onNavigate={setCurrentPath} />;
        }
    };

    return (
        <Layout 
            user={user} 
            onLogout={handleLogout} 
            currentPath={currentPath} 
            onNavigate={setCurrentPath}
        >
            {renderContent()}
        </Layout>
    );
};

export default App;
