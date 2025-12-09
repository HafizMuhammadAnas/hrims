
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, Menu, UserCircle, Settings } from 'lucide-react';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    toggleSidebar: () => void;
    onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar, onNavigate }) => {
    return (
        <header className="header">
            <div className="header-content">
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    {user && (
                        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white">
                            <Menu size={24} />
                        </button>
                    )}
                    <div>
                        <h1>Human Rights Information Management System</h1>
                        <p style={{fontSize: '12px', opacity: 0.8}}>Islamic Republic of Pakistan</p>
                    </div>
                </div>

                {user && (
                    <div className="user-info">
                        <div style={{display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '20px'}}>
                            <button style={{padding: '6px 14px', border: 'none', background: '#fff', color: '#01411C', borderRadius: '16px', fontSize: '13px', cursor: 'pointer'}}>English</button>
                            <button style={{padding: '6px 14px', border: 'none', background: 'transparent', color: '#fff', borderRadius: '16px', fontSize: '13px', cursor: 'pointer'}} className="urdu">اردو</button>
                        </div>

                        <div style={{textAlign: 'right', cursor: 'pointer'}} onClick={() => onNavigate('/profile')}>
                            <div style={{fontSize: '14px', fontWeight: 500}}>{user.name}</div>
                            <div style={{fontSize: '12px', opacity: 0.8}}>{user.role === UserRole.FEDERAL_ADMIN ? 'Federal Admin' : `${user.province} Admin`}</div>
                        </div>
                        
                        <button 
                            onClick={() => onNavigate('/profile')}
                            className="back-btn"
                            title="Profile Settings"
                        >
                            <UserCircle size={18} />
                        </button>

                        <button 
                            onClick={onLogout}
                            className="back-btn"
                            style={{background: '#D32F2F', border: 'none'}}
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;