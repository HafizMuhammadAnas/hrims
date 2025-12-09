
import React from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/mockDb';
import { BookOpen, Target, Globe, RefreshCcw, AlertCircle, Clock, CheckCircle, FileText, Send } from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    LineChart, Line, XAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

interface DashboardProps {
    user: User;
    onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    // --- Federal Stats ---
    const requests = db.getRequests(user.role === UserRole.PROVINCIAL_ADMIN ? user.province : undefined);
    const pending = requests.filter(r => r.status === 'pending').length;
    const inProgress = requests.filter(r => r.status === 'in-progress').length;
    const completed = requests.filter(r => r.status === 'completed').length;
    const overdue = requests.filter(r => r.status === 'overdue').length;

    // --- Provincial Specific Stats ---
    const provResponses = user.role === UserRole.PROVINCIAL_ADMIN ? db.getResponses(user.province) : [];
    const needsMod = provResponses.filter(r => r.reviewStatus === 'needs-modification').length;
    const accepted = provResponses.filter(r => r.reviewStatus === 'accepted').length;

    // Hot Actions / Coming Dues
    const urgentRequests = requests
        .filter(r => r.status === 'overdue' || r.status === 'pending')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    // Mini Chart Data
    const dataStatus = [
        { name: 'Pending', value: pending },
        { name: 'In Progress', value: inProgress },
        { name: 'Completed', value: completed },
        { name: 'Overdue', value: overdue },
    ];
    const STATUS_COLORS = ['#FFB300', '#00BCD4', '#4CAF50', '#F44336'];

    const dataTrend = [
        { name: 'M1', req: 40 }, { name: 'M2', req: 30 }, 
        { name: 'M3', req: 55 }, { name: 'M4', req: 45 }, 
        { name: 'M5', req: 60 }, { name: 'M6', req: 50 }
    ];

    return (
        <div>
            {/* --- WELCOME BANNER --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#01411C] mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h2>
                    <p className="text-gray-500">{user.role === UserRole.FEDERAL_ADMIN ? 'Federal Control Center' : `Provincial Dashboard - ${user.province}`}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                    <p>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* --- PROVINCIAL ALERT BOX --- */}
            {user.role === UserRole.PROVINCIAL_ADMIN && needsMod > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-8 flex items-start gap-4">
                    <AlertCircle className="text-orange-600 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-orange-800">Action Required: Responses Returned</h3>
                        <p className="text-orange-700 text-sm mt-1">You have {needsMod} response(s) that require modification based on Federal feedback. Please review and resubmit.</p>
                        <button 
                            className="mt-2 text-sm font-medium text-orange-800 underline"
                            onClick={() => onNavigate('/province-history')}
                        >
                            View Returned Responses
                        </button>
                    </div>
                </div>
            )}

            {/* --- STATS ROW --- */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-card-value">{requests.length}</div>
                    <div className="stat-card-label">{user.role === UserRole.FEDERAL_ADMIN ? 'Requests Sent' : 'Incoming Requests'}</div>
                </div>
                <div className="stat-card" style={{borderLeftColor: '#FFB300'}}>
                    <div className="stat-card-value" style={{color: '#FFB300'}}>{pending}</div>
                    <div className="stat-card-label">Pending Action</div>
                </div>
                <div className="stat-card" style={{borderLeftColor: '#00BCD4'}}>
                    <div className="stat-card-value" style={{color: '#00BCD4'}}>{inProgress}</div>
                    <div className="stat-card-label">In Progress</div>
                </div>
                
                {user.role === UserRole.PROVINCIAL_ADMIN ? (
                    <>
                        <div className="stat-card" style={{borderLeftColor: '#4CAF50'}}>
                            <div className="stat-card-value" style={{color: '#4CAF50'}}>{accepted}</div>
                            <div className="stat-card-label">Accepted Responses</div>
                        </div>
                        <div className="stat-card" style={{borderLeftColor: '#F44336'}}>
                            <div className="stat-card-value" style={{color: '#F44336'}}>{needsMod}</div>
                            <div className="stat-card-label">Needs Modification</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="stat-card" style={{borderLeftColor: '#4CAF50'}}>
                            <div className="stat-card-value" style={{color: '#4CAF50'}}>{completed}</div>
                            <div className="stat-card-label">Completed</div>
                        </div>
                        <div className="stat-card" style={{borderLeftColor: '#F44336'}}>
                            <div className="stat-card-value" style={{color: '#F44336'}}>{overdue}</div>
                            <div className="stat-card-label">Overdue</div>
                        </div>
                    </>
                )}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px'}}>
                {/* Urgent Matters (Hot Actions) */}
                <div className="card" style={{cursor: 'default', height: '100%'}}>
                    <div className="section-header" style={{marginBottom: '15px'}}>
                        <h3 className="section-title" style={{fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Clock size={20} className="text-[#01411C]" />
                            {user.role === UserRole.FEDERAL_ADMIN ? 'Deadlines & Overdue' : 'My Priority Tasks'}
                        </h3>
                        <button className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '12px'}} onClick={() => onNavigate(user.role === UserRole.FEDERAL_ADMIN ? '/requests' : '/province-distribution')}>View All</button>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        {urgentRequests.length > 0 ? urgentRequests.map(r => (
                            <div key={r.id} style={{
                                padding: '12px', 
                                background: r.status === 'overdue' ? '#FFEBEE' : '#FFF8E1', 
                                borderRadius: '8px',
                                borderLeft: `4px solid ${r.status === 'overdue' ? '#F44336' : '#FFB300'}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{fontWeight: 600, fontSize: '14px', color: '#333'}}>{r.title}</div>
                                    <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>
                                        {r.prov} • Due: {r.date}
                                    </div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <span className={`status-badge status-${r.status}`} style={{fontSize: '10px', padding: '2px 8px'}}>
                                        {r.status.toUpperCase().replace('-', ' ')}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                                <CheckCircle size={32} style={{margin: '0 auto 10px'}} />
                                No urgent actions required.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Analytics Graphs */}
                <div className="card" style={{cursor: 'default', height: '100%'}}>
                    <div className="section-header" style={{marginBottom: '15px'}}>
                        <h3 className="section-title" style={{fontSize: '18px'}}>Performance Overview</h3>
                        <button className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '12px'}} onClick={() => onNavigate('/analysis')}>Full Analysis</button>
                    </div>
                    <div style={{display: 'flex', gap: '20px', height: '200px'}}>
                        <div style={{flex: 1}}>
                            <h4 style={{fontSize: '13px', textAlign: 'center', marginBottom: '5px', color: '#666'}}>Status Distribution</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dataStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{flex: 1}}>
                            <h4 style={{fontSize: '13px', textAlign: 'center', marginBottom: '5px', color: '#666'}}>Activity Trend (6M)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="req" stroke="#01411C" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access to Reports */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Reports & Information Overview</h2>
                </div>
                <div className="cards-grid">
                    <div className="card" onClick={() => onNavigate('/conventions')}>
                        <div className="card-icon" style={{background: 'linear-gradient(135deg, #01411C, #0A5F2C)'}}>
                            <BookOpen size={32} color="#fff" />
                        </div>
                        <h3 className="card-title">Core Conventions</h3>
                        <p className="card-desc">Information on the 7 Core Human Rights Conventions ratified by Pakistan.</p>
                        <div style={{marginTop: '15px', color: 'var(--pk-green)', fontWeight: 600, fontSize: '14px', display:'flex', alignItems:'center', gap:'5px'}}>
                            View Details &rarr;
                        </div>
                    </div>

                    <div className="card" onClick={() => onNavigate('/indicators')}>
                        <div className="card-icon" style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)'}}>
                            <Target size={32} color="#fff" />
                        </div>
                        <h3 className="card-title">Human Rights Indicators</h3>
                        <p className="card-desc">Track key performance indicators for health, education, work, and more.</p>
                        <div style={{marginTop: '15px', color: 'var(--pk-green)', fontWeight: 600, fontSize: '14px', display:'flex', alignItems:'center', gap:'5px'}}>
                            View Indicators &rarr;
                        </div>
                    </div>

                    <div className="card" onClick={() => onNavigate('/sdgs')}>
                        <div className="card-icon" style={{background: 'linear-gradient(135deg, #00ACC1, #26C6DA)'}}>
                            <Globe size={32} color="#fff" />
                        </div>
                        <h3 className="card-title">Sustainable Development Goals</h3>
                        <p className="card-desc">Progress tracking for SDGs related to human rights compliance.</p>
                        <div style={{marginTop: '15px', color: 'var(--pk-green)', fontWeight: 600, fontSize: '14px', display:'flex', alignItems:'center', gap:'5px'}}>
                            View SDGs &rarr;
                        </div>
                    </div>

                    <div className="card" onClick={() => onNavigate('/upr')}>
                        <div className="card-icon" style={{background: 'linear-gradient(135deg, #7B1FA2, #AB47BC)'}}>
                            <RefreshCcw size={32} color="#fff" />
                        </div>
                        <h3 className="card-title">Universal Periodic Review</h3>
                        <p className="card-desc">Status of recommendations from Pakistan's 4th UPR Cycle.</p>
                        <div style={{marginTop: '15px', color: 'var(--pk-green)', fontWeight: 600, fontSize: '14px', display:'flex', alignItems:'center', gap:'5px'}}>
                            View UPR Stats &rarr;
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;