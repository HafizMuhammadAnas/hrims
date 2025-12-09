import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { User } from '../types';

interface LayoutProps {
    user: User | null;
    onLogout: () => void;
    currentPath: string;
    onNavigate: (path: string) => void;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, currentPath, onNavigate, children }) => {
    // For mobile responsive toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) return <>{children}</>;

    return (
        <div style={{minHeight: '100vh', background: '#F5F5F5'}}>
            <Header 
                user={user} 
                onLogout={onLogout} 
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                onNavigate={onNavigate}
            />
            
            <div style={{display: 'flex'}}>
                {/* On larger screens, sidebar is fixed width. On mobile it toggles. */}
                <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
                     <Sidebar 
                        user={user} 
                        isOpen={sidebarOpen || (typeof window !== 'undefined' && window.innerWidth > 768)} 
                        currentPath={currentPath}
                        onNavigate={onNavigate}
                    />
                </div>
                
                {/* Main Content */}
                <main style={{
                    flex: 1, 
                    padding: '30px', 
                    marginLeft: (typeof window !== 'undefined' && window.innerWidth > 768) ? '280px' : '0', 
                    width: '100%',
                    transition: 'margin-left 0.3s'
                }}>
                    <div style={{maxWidth: '1600px', margin: '0 auto'}}>
                        {children}
                    </div>
                </main>
            </div>
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 800}}
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;