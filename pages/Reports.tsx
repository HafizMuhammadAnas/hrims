
import React, { useState } from 'react';
import { CONVENTIONS, INDICATORS, SDGS, UPR_STATS } from '../constants';
import { Convention, Indicator, SDG, UPRStat } from '../types';
import { ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

// --- Shared Components ---

const DetailHeader: React.FC<{ 
    title: string; 
    subtitle?: string; 
    urdu?: string; 
    icon: React.ReactNode; 
    onBack: () => void;
    stats: { label: string; value: string }[] 
}> = ({ title, subtitle, urdu, icon, onBack, stats }) => (
    <div className="conv-hero">
        <button onClick={onBack} className="back-btn" style={{background: 'var(--pk-green)', marginBottom: '20px'}}>
            <ArrowLeft size={16} /> Back to List
        </button>
        <div className="conv-header">
            <div className="conv-icon-lg">{icon}</div>
            <div className="conv-title-section">
                <h1 className="conv-title">{title}</h1>
                <p className="conv-subtitle">{subtitle}</p>
                {urdu && <p className="conv-urdu">{urdu}</p>}
            </div>
        </div>
        <div className="key-info-grid">
            {stats.map((s, i) => (
                <div key={i} className="key-info-item">
                    <div className="key-info-label">{s.label}</div>
                    <div className="key-info-value">{s.value}</div>
                </div>
            ))}
        </div>
    </div>
);

const Tabs: React.FC<{ 
    tabs: string[]; 
    activeTab: string; 
    onTabChange: (t: string) => void 
}> = ({ tabs, activeTab, onTabChange }) => (
    <div className="tabs-nav">
        {tabs.map(t => (
            <button 
                key={t} 
                className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                onClick={() => onTabChange(t)}
            >
                {t}
            </button>
        ))}
    </div>
);

// --- CONVENTIONS SECTION ---

const ConventionDetail: React.FC<{ data: Convention; onBack: () => void }> = ({ data, onBack }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div>
            <DetailHeader 
                title={data.title}
                subtitle={data.fullName}
                urdu={data.urdu}
                icon={data.icon}
                onBack={onBack}
                stats={[
                    { label: 'Adopted', value: data.adopted },
                    { label: 'Ratified', value: data.ratified },
                    { label: 'Articles', value: data.articles },
                    { label: 'Implementation', value: `${data.implementation}%` }
                ]}
            />

            <Tabs 
                tabs={['Overview', 'Recommendations', 'Implementation', 'Challenges', 'Resources']} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />

            {activeTab === 'Overview' && (
                <div className="overview-section">
                    <h2 className="section-title">Convention Overview</h2>
                    <p className="overview-text">
                        {data.fullName} is a key international human rights treaty that Pakistan has ratified. The convention establishes standards and obligations for the protection and promotion of specific rights within its scope.
                    </p>
                    <p className="overview-text">
                        In the Pakistani context, this convention is particularly relevant for ensuring the protection of vulnerable groups and promoting equal treatment of all citizens in accordance with international standards.
                    </p>
                    
                    <h3 style={{marginTop: '30px', marginBottom: '20px', color: 'var(--pk-green)', fontWeight: 600, fontSize: '18px'}}>Key Articles</h3>
                    <div className="articles-grid">
                        <div className="article-card">
                            <div className="article-num">Article 2</div>
                            <div className="article-title">State Obligations</div>
                            <div className="article-desc">General obligations to respect and ensure rights without discrimination.</div>
                        </div>
                        <div className="article-card">
                            <div className="article-num">Article 5</div>
                            <div className="article-title">Equal Rights</div>
                            <div className="article-desc">Guarantee of equality before the law and equal protection.</div>
                        </div>
                        <div className="article-card">
                            <div className="article-num">Article 7</div>
                            <div className="article-title">Education</div>
                            <div className="article-desc">Measures in education and awareness to combat prejudice.</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Recommendations' && (
                <div className="rec-container">
                    <h2 className="section-title">Pakistan-Specific Recommendations</h2>
                    <div className="rec-card">
                        <div className="rec-header">
                            <h3 className="rec-title">Legislative Framework Enhancement</h3>
                            <span className="priority-badge priority-high">High Priority</span>
                        </div>
                        <p className="rec-details">Enact comprehensive legislation to strengthen implementation mechanisms and address gaps in current legal framework.</p>
                        <div className="rec-meta">
                            <span className="meta-item">📅 2024-2025</span>
                            <span className="meta-item">🏛️ Ministry of Law</span>
                            <span className="meta-item">📊 In Progress</span>
                        </div>
                    </div>
                    <div className="rec-card">
                        <div className="rec-header">
                            <h3 className="rec-title">Protection Mechanisms</h3>
                            <span className="priority-badge priority-high">High Priority</span>
                        </div>
                        <p className="rec-details">Strengthen mechanisms to protect vulnerable groups and ensure equal access to services.</p>
                        <div className="rec-meta">
                            <span className="meta-item">📅 Ongoing</span>
                            <span className="meta-item">🏛️ Ministry of Human Rights</span>
                            <span className="meta-item">📊 Active</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Implementation' && (
                <div className="impl-status">
                    <h2 className="section-title">Implementation Status</h2>
                    <div className="status-grid">
                        <div className="status-card"><div className="status-icon">📋</div><div className="status-title">Total Recs</div><div className="status-value">48</div></div>
                        <div className="status-card"><div className="status-icon">✅</div><div className="status-title">Implemented</div><div className="status-value">32</div></div>
                        <div className="status-card"><div className="status-icon">⏳</div><div className="status-title">In Progress</div><div className="status-value">12</div></div>
                        <div className="status-card"><div className="status-icon">📝</div><div className="status-title">Pending</div><div className="status-value">4</div></div>
                    </div>
                    <div className="progress-container">
                        <div className="progress-label"><span>Overall Progress</span><span style={{fontWeight:'bold', color:'var(--pk-green)'}}>{data.implementation}%</span></div>
                        <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: `${data.implementation}%`}}></div></div>
                    </div>
                </div>
            )}

            {activeTab === 'Challenges' && (
                <div className="overview-section">
                    <h2 className="section-title">Key Challenges</h2>
                    <div className="challenge-grid">
                        <div className="challenge-item">
                            <div className="challenge-icon">⚠️</div>
                            <div className="challenge-content">
                                <div className="challenge-title">Legislative Gaps</div>
                                <div className="challenge-desc">Absence of comprehensive legislation addressing all aspects of the convention.</div>
                            </div>
                        </div>
                        <div className="challenge-item">
                            <div className="challenge-icon">⚠️</div>
                            <div className="challenge-content">
                                <div className="challenge-title">Resource Constraints</div>
                                <div className="challenge-desc">Insufficient allocation of resources for implementation and monitoring.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Resources' && (
                <div className="overview-section">
                    <h2 className="section-title">Resources & Documents</h2>
                    <div className="resources-grid">
                        <a href="#" className="resource-link" onClick={(e) => e.preventDefault()}><span className="resource-icon">📄</span><div className="resource-text"><div className="resource-title">{data.title} Full Text</div><div className="resource-type">Official Document</div></div></a>
                        <a href="#" className="resource-link" onClick={(e) => e.preventDefault()}><span className="resource-icon">📊</span><div className="resource-text"><div className="resource-title">Pakistan's State Report</div><div className="resource-type">PDF Report</div></div></a>
                        <a href="#" className="resource-link" onClick={(e) => e.preventDefault()}><span className="resource-icon">📑</span><div className="resource-text"><div className="resource-title">Committee Observations</div><div className="resource-type">UN Document</div></div></a>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ConventionsInfo: React.FC = () => {
    const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);

    if (selectedConvention) {
        return <ConventionDetail data={selectedConvention} onBack={() => setSelectedConvention(null)} />;
    }

    return (
        <section className="section">
            <div className="section-header">
                <h2 className="section-title">Seven Core Human Rights Conventions</h2>
            </div>
            <div className="cards-grid">
                {CONVENTIONS.map(c => (
                    <div key={c.id} className="card" onClick={() => setSelectedConvention(c)}>
                        <div className="card-icon">{c.icon}</div>
                        <h3 className="card-title">{c.title}</h3>
                        <p className="card-desc">{c.fullName}</p>
                        <div className="card-stats">
                            <div className="stat">
                                <div className="stat-value">{c.articles}</div>
                                <div className="stat-label">Articles</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{c.implementation}%</div>
                                <div className="stat-label">Implementation</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- INDICATORS SECTION ---

const IndicatorDetail: React.FC<{ data: Indicator; onBack: () => void }> = ({ data, onBack }) => {
    const [activeTab, setActiveTab] = useState('Trends');
    
    // Mock Data for chart
    const chartData = [
        { year: '2019', value: 40 },
        { year: '2020', value: 45 },
        { year: '2021', value: 55 },
        { year: '2022', value: 60 },
        { year: '2023', value: parseInt(data.v1) || 70 },
    ];

    return (
        <div>
            <DetailHeader 
                title={data.title}
                subtitle={data.desc}
                icon={data.icon}
                onBack={onBack}
                stats={[
                    { label: data.l1, value: data.v1 },
                    { label: data.l2, value: data.v2 },
                    { label: 'Year', value: '2024' },
                    { label: 'Trend', value: '↗ Positive' }
                ]}
            />
            <Tabs tabs={['Trends', 'Provincial Data', 'Policies']} activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'Trends' && (
                <div className="overview-section">
                    <h2 className="section-title">Performance Trend (5 Years)</h2>
                    <div className="chart-wrapper" style={{height: '300px', marginTop: '20px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#01411C" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{marginTop: '30px'}}>
                        <h3 style={{fontSize:'18px', fontWeight:600, color:'var(--pk-green)', marginBottom:'15px'}}>Analysis</h3>
                        <p style={{lineHeight: 1.6, color: 'var(--txt)'}}>
                            The {data.title} indicator has shown consistent improvement over the last 5 years. Government initiatives and increased funding have contributed to the positive trend.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'Provincial Data' && (
                <div className="overview-section">
                    <h2 className="section-title">Provincial Breakdown</h2>
                    <div className="status-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '20px'}}>
                        <div className="status-card"><div className="status-title">Punjab</div><div className="status-value">72%</div><div className="stat-label">Above National Avg</div></div>
                        <div className="status-card"><div className="status-title">Sindh</div><div className="status-value">65%</div><div className="stat-label">On Track</div></div>
                        <div className="status-card"><div className="status-title">KPK</div><div className="status-value">58%</div><div className="stat-label">Improving</div></div>
                        <div className="status-card"><div className="status-title">Balochistan</div><div className="status-value">42%</div><div className="stat-label" style={{color:'var(--err)'}}>Attention Needed</div></div>
                    </div>
                </div>
            )}

            {activeTab === 'Policies' && (
                <div className="rec-container">
                    <h2 className="section-title">Related Policies & Acts</h2>
                    <div className="rec-card">
                        <div className="rec-header"><h3 className="rec-title">National Policy 2021</h3></div>
                        <p className="rec-details">Framework for improving {data.title.toLowerCase()} standards across all provinces.</p>
                    </div>
                    <div className="rec-card">
                        <div className="rec-header"><h3 className="rec-title">Provincial Implementation Acts</h3></div>
                        <p className="rec-details">Specific legislative measures adopted by provincial assemblies.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const IndicatorsInfo: React.FC = () => {
    const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

    if (selectedIndicator) {
        return <IndicatorDetail data={selectedIndicator} onBack={() => setSelectedIndicator(null)} />;
    }

    return (
        <section className="section">
            <div className="section-header">
                <h2 className="section-title">Human Rights Indicators</h2>
            </div>
            <div className="cards-grid">
                {INDICATORS.map((i, idx) => (
                    <div key={idx} className="card" onClick={() => setSelectedIndicator(i)}>
                        <div className="card-icon">{i.icon}</div>
                        <h3 className="card-title">{i.title}</h3>
                        <p className="card-desc">{i.desc}</p>
                        <div className="card-stats">
                            <div className="stat">
                                <div className="stat-value">{i.v1}</div>
                                <div className="stat-label">{i.l1}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{i.v2}</div>
                                <div className="stat-label">{i.l2}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- SDGs SECTION ---

const SDGDetail: React.FC<{ data: SDG; onBack: () => void }> = ({ data, onBack }) => {
    const [activeTab, setActiveTab] = useState('Targets');

    return (
        <div>
            <DetailHeader 
                title={data.title}
                subtitle="Sustainable Development Goal"
                icon={data.icon}
                onBack={onBack}
                stats={[
                    { label: data.l1, value: data.v1 },
                    { label: data.l2, value: data.v2 },
                    { label: 'Status', value: 'On Track' },
                    { label: 'Priority', value: 'High' }
                ]}
            />
            <Tabs tabs={['Targets', 'Progress', 'Initiatives']} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'Targets' && (
                <div className="overview-section">
                    <h2 className="section-title">SDG Targets</h2>
                    <ul style={{listStyle: 'none', padding: 0, display: 'grid', gap: '15px'}}>
                        <li style={{background: '#FAFAFA', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--blue)'}}>
                            <strong>Target 1:</strong> By 2030, ensure equal rights to economic resources.
                        </li>
                        <li style={{background: '#FAFAFA', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--blue)'}}>
                            <strong>Target 2:</strong> Implement national social protection systems.
                        </li>
                        <li style={{background: '#FAFAFA', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--blue)'}}>
                            <strong>Target 3:</strong> Build resilience of the poor and vulnerable.
                        </li>
                    </ul>
                </div>
            )}

            {activeTab === 'Progress' && (
                <div className="impl-status">
                    <h2 className="section-title">Progress Report</h2>
                    <div className="progress-container">
                        <div className="progress-label"><span>Target Achievement</span><span>65%</span></div>
                        <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: '65%'}}></div></div>
                    </div>
                    <div className="chart-wrapper" style={{height: '250px', marginTop: '30px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{name: '2020', v: 40}, {name: '2021', v: 50}, {name: '2022', v: 55}, {name: '2023', v: 65}]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="v" fill="#00ACC1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'Initiatives' && (
                <div className="rec-container">
                    <h2 className="section-title">Key Initiatives</h2>
                    <div className="rec-card">
                        <div className="rec-header"><h3 className="rec-title">Benazir Income Support Programme</h3></div>
                        <p className="rec-details">Social safety net program providing financial assistance to low-income families.</p>
                    </div>
                    <div className="rec-card">
                        <div className="rec-header"><h3 className="rec-title">Ehsaas Programme</h3></div>
                        <p className="rec-details">Poverty alleviation initiative targeting the most vulnerable segments of society.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const SDGsInfo: React.FC = () => {
    const [selectedSDG, setSelectedSDG] = useState<SDG | null>(null);

    if (selectedSDG) {
        return <SDGDetail data={selectedSDG} onBack={() => setSelectedSDG(null)} />;
    }

    return (
        <section className="section">
            <div className="section-header">
                <h2 className="section-title">Sustainable Development Goals - Pakistan</h2>
            </div>
            <div className="cards-grid">
                {SDGS.map((s, idx) => (
                    <div key={idx} className="card" onClick={() => setSelectedSDG(s)}>
                        <div className="card-icon">{s.icon}</div>
                        <h3 className="card-title">{s.title}</h3>
                        <p className="card-desc">{s.desc}</p>
                        <div className="card-stats">
                            <div className="stat">
                                <div className="stat-value">{s.v1}</div>
                                <div className="stat-label">{s.l1}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{s.v2}</div>
                                <div className="stat-label">{s.l2}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- UPR SECTION ---

const UPRDetail: React.FC<{ data: UPRStat; onBack: () => void }> = ({ data, onBack }) => {
    const [activeTab, setActiveTab] = useState('Breakdown');

    return (
        <div>
            <DetailHeader 
                title={data.title}
                subtitle="Universal Periodic Review - 4th Cycle"
                icon={data.icon}
                onBack={onBack}
                stats={[
                    { label: data.l1, value: data.v1 },
                    { label: data.l2, value: data.v2 },
                    { label: 'Cycle', value: '4th' },
                    { label: 'Year', value: '2023' }
                ]}
            />
            <Tabs tabs={['Breakdown', 'Response', 'Action Plan']} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'Breakdown' && (
                <div className="overview-section">
                    <h2 className="section-title">Detailed Breakdown</h2>
                    <div className="status-grid">
                        <div className="status-card"><div className="status-title">Civil Rights</div><div className="status-value">85</div><div className="stat-label">Recommendations</div></div>
                        <div className="status-card"><div className="status-title">Women Rights</div><div className="status-value">62</div><div className="stat-label">Recommendations</div></div>
                        <div className="status-card"><div className="status-title">Child Rights</div><div className="status-value">45</div><div className="stat-label">Recommendations</div></div>
                        <div className="status-card"><div className="status-title">Minorities</div><div className="status-value">28</div><div className="stat-label">Recommendations</div></div>
                    </div>
                </div>
            )}

            {activeTab === 'Response' && (
                <div className="overview-section">
                    <h2 className="section-title">State Response</h2>
                    <p className="overview-text">
                        Pakistan has accepted the majority of recommendations received during the 4th UPR cycle, demonstrating its commitment to international human rights obligations.
                    </p>
                    <div style={{marginTop: '20px', padding: '20px', background: '#E8F5E9', borderRadius: '10px', borderLeft: '5px solid var(--ok)'}}>
                        <h4 style={{margin: 0, color: 'var(--pk-green)'}}>Official Statement</h4>
                        <p style={{margin: '10px 0 0', fontStyle: 'italic'}}>
                            "We are committed to implementing the accepted recommendations through a coordinated effort involving federal and provincial stakeholders."
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'Action Plan' && (
                <div className="rec-container">
                    <h2 className="section-title">Action Plan Steps</h2>
                    <div className="rec-card">
                        <div className="rec-header"><h3 className="rec-title">Phase 1: Dissemination</h3></div>
                        <p className="rec-details">Sharing recommendations with all provincial departments and stakeholders.</p>
                    </div>
                    <div className="rec-card">
                        <div className="rec-header"><h3 className="rec-title">Phase 2: Implementation Matrix</h3></div>
                        <p className="rec-details">Developing a tracking matrix to monitor progress on accepted recommendations.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const UPRInfo: React.FC = () => {
    const [selectedUPR, setSelectedUPR] = useState<UPRStat | null>(null);

    if (selectedUPR) {
        return <UPRDetail data={selectedUPR} onBack={() => setSelectedUPR(null)} />;
    }

    return (
        <section className="section">
            <div className="section-header">
                <h2 className="section-title">Universal Periodic Review - Pakistan (4th Cycle)</h2>
            </div>
            <div className="cards-grid">
                {UPR_STATS.map((u, idx) => (
                    <div key={idx} className="card" onClick={() => setSelectedUPR(u)}>
                        <div className="card-icon">{u.icon}</div>
                        <h3 className="card-title">{u.title}</h3>
                        <p className="card-desc">{u.desc}</p>
                        <div className="card-stats">
                            <div className="stat">
                                <div className="stat-value">{u.v1}</div>
                                <div className="stat-label">{u.l1}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{u.v2}</div>
                                <div className="stat-label">{u.l2}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
