
import React from 'react';
import { User, UserRole } from '../types';
import { LayoutDashboard, Send, BarChart2, BookOpen, Inbox, Layers, FileCheck, Target, Globe, RefreshCcw, PieChart, History, Users, Activity, FileText, ClipboardList, List, UserCog, Building2, AlertTriangle } from 'lucide-react';

interface SidebarProps {
    user: User;
    isOpen: boolean;
    currentPath: string;
    onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, currentPath, onNavigate }) => {
    const isActive = (path: string) => currentPath === path;
    const isViewer = user.role === UserRole.VIEWER;

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
        <a 
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate(to); }}
            className={`nav-item ${isActive(to) ? 'active' : ''}`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </a>
    );

    return (
        <nav 
            className="sidebar"
            style={{
                position: 'fixed',
                top: '80px',
                left: isOpen ? '0' : '-280px',
                zIndex: 900,
                transition: '0.3s',
                height: 'calc(100vh - 80px)',
                overflowY: 'auto',
            }}
        >
            <div className="nav-menu">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                {/* Federal Only Menus */}
                {user.role === UserRole.FEDERAL_ADMIN && (
                    <>
                        <div className="nav-section-title">Federal Actions</div>
                        <div className="nav-sub">
                            <NavItem to="/requests" icon={Send} label="Request Management" />
                            <NavItem to="/responses" icon={Inbox} label="Review Responses" />
                            <NavItem to="/compilation" icon={Layers} label="Compilation Center" />
                            <NavItem to="/compiled-records" icon={FileCheck} label="Compiled Records" />
                            <NavItem to="/federal-users-mgmt" icon={UserCog} label="User Management" />
                        </div>

                        <div className="nav-section-title">Federal Department Actions</div>
                        <div className="nav-sub">
                             <NavItem to="/federal-received" icon={List} label="Active Requests" />
                             <NavItem to="/federal-distribution" icon={ClipboardList} label="Department Distribution" />
                             <NavItem to="/federal-monitoring" icon={Activity} label="Department Monitoring" />
                             <NavItem to="/federal-compilation" icon={FileText} label="Federal Compilation" />
                             <NavItem to="/federal-history" icon={History} label="Internal History" />
                        </div>
                    </>
                )}

                {/* Provincial Only Menus */}
                {user.role === UserRole.PROVINCIAL_ADMIN && (
                    <>
                         <div className="nav-section-title">Province Actions</div>
                         <div className="nav-sub">
                            <NavItem to="/province-received" icon={List} label="Received Requests" />
                            <NavItem to="/province-distribution" icon={ClipboardList} label="Request Distribution" />
                            <NavItem to="/province-monitoring" icon={Activity} label="Department Monitoring" />
                            <NavItem to="/province-compilation" icon={FileText} label="Response Compilation" />
                            <NavItem to="/provincial-users-mgmt" icon={Users} label="User Management" />
                            <NavItem to="/province-history" icon={History} label="Submission History" />
                        </div>
                    </>
                )}
                
                {/* Department Admin Menus */}
                {user.role === UserRole.DEPARTMENT_ADMIN && (
                    <>
                        <div className="nav-section-title">Department Actions</div>
                        <div className="nav-sub">
                            <NavItem to="/department-tasks" icon={ClipboardList} label="Assigned Tasks" />
                            <NavItem to="/department-history" icon={History} label="Submission History" />
                        </div>
                    </>
                )}

                {/* Viewer Menus (Read Only) */}
                {isViewer && (
                     <>
                        <div className="nav-section-title">Read-Only Access</div>
                        <div className="nav-sub">
                            {user.province === 'Federal' ? (
                                <NavItem to="/federal-history" icon={History} label="History" />
                            ) : (
                                <NavItem to="/province-history" icon={History} label="History" />
                            )}
                        </div>
                     </>
                )}

                {/* Reports & Analysis (New Section) */}
                <div className="nav-section-title">Reports & Analysis</div>
                <NavItem to="/report-generator" icon={PieChart} label="Report Generator" />
                <NavItem to="/analysis" icon={BarChart2} label="Data Analysis" />

                {/* Violation Database - Federal Only */}
                {user.role === UserRole.FEDERAL_ADMIN && (
                    <>
                        <div className="nav-section-title">Violation Database</div>
                        <div className="nav-sub">
                             <NavItem to="/violation-dashboard" icon={LayoutDashboard} label="Dashboard" />
                             <NavItem to="/violation-entries" icon={FileText} label="Violation Entries" />
                        </div>
                    </>
                )}

                {/* Knowledge Hub (Renamed) */}
                <div className="nav-section-title">Knowledge Hub</div>
                <NavItem to="/conventions" icon={BookOpen} label="Conventions Info" />
                <NavItem to="/indicators" icon={Target} label="Human Rights Indicators" />
                <NavItem to="/sdgs" icon={Globe} label="Sustainable Development Goals" />
                <NavItem to="/upr" icon={RefreshCcw} label="Universal Periodic Review" />
            </div>
        </nav>
    );
};

export default Sidebar;
