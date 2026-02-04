
import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Analysis from './pages/Analysis';
import { ReviewResponses, CompilationCenter, CompiledRecords } from './pages/FederalActions';
import UserManagement from './pages/UserManagement'; // New Unified Page
import ReceivedRequests from './pages/provincial/ReceivedRequests';
import RequestDistribution from './pages/provincial/RequestDistribution';
import DepartmentMonitoring from './pages/provincial/DepartmentMonitoring';
import ResponseCompilation from './pages/provincial/ResponseCompilation';
import SubmissionHistory from './pages/provincial/SubmissionHistory';
import DepartmentTasks from './pages/department/DepartmentTasks';
import DepartmentHistory from './pages/department/DepartmentHistory';
import { ConventionsInfo, IndicatorsInfo, SDGsInfo, UPRInfo } from './pages/Reports';
import ReportGenerator from './pages/ReportGenerator';
import Profile from './pages/Profile';
import ViolationDashboard from './pages/violation/ViolationDashboard';
import ViolationEntries from './pages/violation/ViolationEntries';
import { User, UserRole } from './types';

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
            case '/federal-users-mgmt':
                return <UserManagement user={user} />;
            
            // Federal Department Action Routes (Reusing Provincial Components with 'Federal' scope)
            case '/federal-received':
                return <ReceivedRequests 
                    user={{...user, province: 'Federal'}} 
                    onNavigate={setCurrentPath} 
                    routes={{distribution: '/federal-distribution', monitoring: '/federal-monitoring', history: '/federal-history'}}
                />;
            case '/federal-distribution':
                return <RequestDistribution 
                    user={{...user, province: 'Federal'}} 
                    onNavigate={setCurrentPath} 
                    nextPath="/federal-monitoring"
                />;
            case '/federal-monitoring':
                return <DepartmentMonitoring user={{...user, province: 'Federal'}} onNavigate={setCurrentPath} />;
            case '/federal-compilation':
                return <ResponseCompilation 
                    user={{...user, province: 'Federal'}} 
                    onNavigate={setCurrentPath} 
                    nextPath="/federal-history"
                />;
            case '/federal-users':
                 // This is likely redundant for Federal Admin as they have federal-users-mgmt, but keeping for path safety
                return <UserManagement user={{...user, province: 'Federal'}} />;
            case '/federal-history':
                return <SubmissionHistory user={{...user, province: 'Federal'}} />;
            case '/violation-dashboard':
                return <ViolationDashboard />;
            case '/violation-entries':
                return <ViolationEntries />;
            
            // Provincial Routes
            case '/province-received':
                return <ReceivedRequests user={user} onNavigate={setCurrentPath} />;
            case '/province-distribution':
                return <RequestDistribution user={user} onNavigate={setCurrentPath} />;
            case '/province-monitoring':
                return <DepartmentMonitoring user={user} onNavigate={setCurrentPath} />;
            case '/province-compilation':
                return <ResponseCompilation user={user} onNavigate={setCurrentPath} />;
            case '/province-history':
                return <SubmissionHistory user={user} />;
            case '/provincial-users-mgmt':
                return <UserManagement user={user} />;

            // Department Routes
            case '/department-tasks':
                return <DepartmentTasks user={user} />;
            case '/department-history':
                return <DepartmentHistory user={user} />;

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
