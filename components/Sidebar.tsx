
import React from 'react';
import { User, UserRole } from '../types';
import { LayoutDashboard, Send, BarChart2, BookOpen, Inbox, Layers, FileCheck, Target, Globe, RefreshCcw, PieChart, History, Users, Activity, FileText, ClipboardList, List } from 'lucide-react';

interface SidebarProps {
    user: User;
    isOpen: boolean;
    currentPath: string;
    onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, currentPath, onNavigate }) => {
    const isActive = (path: string) => currentPath === path;

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
                            <NavItem to="/report-generator" icon={PieChart} label="Report Generator" />
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
                            <NavItem to="/province-monitoring" icon={Activity} label="Sector Monitoring" />
                            <NavItem to="/province-compilation" icon={FileText} label="Response Compilation" />
                            <NavItem to="/province-users" icon={Users} label="Sector User Mgmt" />
                            <NavItem to="/province-history" icon={History} label="Submission History" />
                        </div>
                    </>
                )}
                
                {/* Sector Admin Menus */}
                {user.role === UserRole.SECTOR_ADMIN && (
                    <>
                        <div className="nav-section-title">Sector Actions</div>
                        <div className="nav-sub">
                            <NavItem to="/sector-tasks" icon={ClipboardList} label="Assigned Tasks" />
                            <NavItem to="/sector-history" icon={History} label="Submission History" />
                        </div>
                    </>
                )}

                <div className="nav-section-title">Reports & Info</div>
                
                <NavItem to="/analysis" icon={BarChart2} label="Data Analysis" />
                <NavItem to="/conventions" icon={BookOpen} label="Conventions Info" />
                <NavItem to="/indicators" icon={Target} label="Human Rights Indicators" />
                <NavItem to="/sdgs" icon={Globe} label="Sustainable Development Goals" />
                <NavItem to="/upr" icon={RefreshCcw} label="Universal Periodic Review" />
            </div>
        </nav>
    );
};

export default Sidebar;