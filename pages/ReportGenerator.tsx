
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { CONVENTIONS, INDICATORS, SDGS } from '../constants';
import { Download, Printer, PieChart, Filter, Sparkles, Cpu, Layers, Activity, BarChart2, Grid, CheckSquare, ChevronDown, ChevronRight, Lightbulb, Settings, Search, Globe, Target, RefreshCcw } from 'lucide-react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    LineChart, Line, Pie, Cell, AreaChart, Area
} from 'recharts';

// --- Mock Data for AI Section ---
const PREBUILT_PROMPTS = [
    {
        category: "Compliance & Trends",
        questions: [
            "Analyze the compliance trend over the last 3 years.",
            "Compare implementation rates against national averages.",
            "Identify the top 3 overdue items and reasons for delay."
        ]
    },
    {
        category: "Demographics & Impact",
        questions: [
            "What is the impact of recent policies on target demographics?",
            "Show distribution in leadership roles.",
            "Analyze regional disparities in access."
        ]
    },
    {
        category: "Resource & Efficiency",
        questions: [
            "Evaluate the correlation between funding and successful completion.",
            "Which department has the highest response efficiency?",
        ]
    },
    {
        category: "International Alignment",
        questions: [
            "Correlate local progress with SDG targets.",
            "Map current status against UPR recommendations.",
        ]
    }
];

const THEMATIC_AREAS = [
    "Civil & Political Rights",
    "Economic, Social & Cultural Rights",
    "Women's Rights & Gender Equality",
    "Rights of the Child",
    "Rights of Persons with Disabilities",
    "Minority Rights",
    "Labor Rights",
    "Access to Justice"
];

const MOCK_AI_CHART_DATA = [
    { name: 'Jan', value: 400, uv: 240 },
    { name: 'Feb', value: 300, uv: 139 },
    { name: 'Mar', value: 200, uv: 980 },
    { name: 'Apr', value: 278, uv: 390 },
    { name: 'May', value: 189, uv: 480 },
    { name: 'Jun', value: 239, uv: 380 },
    { name: 'Jul', value: 349, uv: 430 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface AIResponse {
    type: string;
    title: string;
    intro: string;
    insights: { label: string; text: string }[];
    recommendation: string;
}

const ReportGenerator: React.FC = () => {
    // --- Configuration State ---
    const [filters, setFilters] = useState({
        dataSource: 'requests',
        province: '',
        convention: '',
        thematicArea: '',
        sdg: '',
        indicator: '',
        uprCycle: '',
        dateFrom: '',
        dateTo: ''
    });

    // --- AI Prompt State ---
    const [expandedSection, setExpandedSection] = useState<string | null>(PREBUILT_PROMPTS[0].category);
    const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
    const [customPrompt, setCustomPrompt] = useState('');
    const [chartType, setChartType] = useState<'pie' | 'line' | 'bar' | 'area'>('pie');
    
    // --- Execution State ---
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<AIResponse | null>(null);

    // --- Handlers ---
    const togglePrompt = (prompt: string) => {
        if (selectedPrompts.includes(prompt)) {
            setSelectedPrompts(selectedPrompts.filter(p => p !== prompt));
        } else {
            setSelectedPrompts([...selectedPrompts, prompt]);
        }
    };

    const toggleSection = (category: string) => {
        setExpandedSection(expandedSection === category ? null : category);
    };

    const handleGenerateAI = () => {
        setAiLoading(true);
        setAiResult(null);

        // Simulate AI Processing Delay and Context Integration
        setTimeout(() => {
            setAiLoading(false);
            
            // Construct context string for the simulation (would be sent to API)
            const contextItems = [
                `Source: ${filters.dataSource}`,
                `Province: ${filters.province || 'National'}`,
                `Convention: ${filters.convention || 'All'}`,
                `Theme: ${filters.thematicArea || 'General'}`,
                `SDG: ${filters.sdg || 'All'}`,
                `Indicator: ${filters.indicator || 'All'}`,
                `UPR: ${filters.uprCycle || 'Latest'}`
            ];
            
            const context = contextItems.join(', ');

            // Dynamic Title Generation
            const title = `AI Analysis: ${filters.thematicArea || filters.convention || 'Comprehensive Human Rights'} Report`;

            // Structured Response
            const response: AIResponse = {
                type: chartType,
                title: title,
                intro: `Generating analytical report based on parameters: [${context}]. The system has cross-referenced provincial submissions with international treaty body obligations.`,
                insights: [
                    { label: "Compliance Correlation", text: `Data indicates a strong correlation between ${filters.province || 'provincial'} resource allocation and positive outcomes in ${filters.thematicArea || 'selected thematic areas'}.` },
                    { label: "Gap Analysis", text: `Identified reporting gaps in ${filters.convention || 'convention'} articles specifically related to remote districts.` },
                    { label: "Target Achievement", text: `Current trajectory suggests ${filters.sdg ? 'alignment' : 'partial alignment'} with ${filters.sdg || 'sustainable development goals'} by 2030 based on recent trends.` },
                    { label: "UPR Progress", text: `Implementation of recommendations from the ${filters.uprCycle || '4th'} cycle is on track, with notable improvements in legislative frameworks.` }
                ],
                recommendation: `Enhance data collection granularity for ${filters.indicator || 'key indicators'} to improve the accuracy of the next ${filters.uprCycle || 'UPR'} state report.`
            };

            setAiResult(response);
        }, 2000);
    };

    // --- Render Helpers ---
    const renderChart = () => {
        if (!aiResult) return null;

        const CommonAxis = <><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /></>;

        switch(aiResult.type) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={MOCK_AI_CHART_DATA}>
                            {CommonAxis}
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={MOCK_AI_CHART_DATA}>
                            {CommonAxis}
                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="uv" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={MOCK_AI_CHART_DATA}>
                            {CommonAxis}
                            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'pie':
            default:
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={MOCK_AI_CHART_DATA}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {MOCK_AI_CHART_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                    <Sparkles size={28} /> AI-Powered Report Generator
                </h1>
                <p className="text-sm text-gray-500 italic">
                    Advanced analytics engine for generating insights from federal and provincial data.
                </p>
            </div>

            {/* --- TOP SECTION: Horizontal Configuration Panel --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-600">
                <h3 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Settings size={20} /> Report Configuration Parameters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Row 1 */}
                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Data Source</label>
                        <select 
                            value={filters.dataSource} 
                            onChange={(e) => setFilters({...filters, dataSource: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="requests">Request Data</option>
                            <option value="responses">Response Data</option>
                            <option value="consolidated">Consolidated Records</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Province / Region</label>
                        <select 
                            value={filters.province} 
                            onChange={(e) => setFilters({...filters, province: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">National (All)</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Sindh">Sindh</option>
                            <option value="KPK">KPK</option>
                            <option value="Balochistan">Balochistan</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="GB">GB</option>
                            <option value="AJK">AJK</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Convention</label>
                        <select 
                            value={filters.convention} 
                            onChange={(e) => setFilters({...filters, convention: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Conventions</option>
                            {CONVENTIONS.map(c => <option key={c.id} value={c.title}>{c.title} - {c.fullName.substring(0, 30)}...</option>)}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Thematic Area</label>
                        <select 
                            value={filters.thematicArea} 
                            onChange={(e) => setFilters({...filters, thematicArea: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Areas</option>
                            {THEMATIC_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                        </select>
                    </div>

                    {/* Row 2 */}
                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Globe size={12}/> SDG Goal</label>
                        <select 
                            value={filters.sdg} 
                            onChange={(e) => setFilters({...filters, sdg: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All SDGs</option>
                            {SDGS.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Target size={12}/> HR Indicator</label>
                        <select 
                            value={filters.indicator} 
                            onChange={(e) => setFilters({...filters, indicator: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Indicators</option>
                            {INDICATORS.map(i => <option key={i.title} value={i.title}>{i.title}</option>)}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><RefreshCcw size={12}/> UPR Cycle</label>
                        <select 
                            value={filters.uprCycle} 
                            onChange={(e) => setFilters({...filters, uprCycle: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Any Cycle</option>
                            <option value="4th">4th Cycle (Current)</option>
                            <option value="3rd">3rd Cycle</option>
                            <option value="2nd">2nd Cycle</option>
                            <option value="1st">1st Cycle</option>
                        </select>
                    </div>

                    <div className="form-field flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">From</label>
                            <input 
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">To</label>
                            <input 
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* --- LEFT COLUMN: AI Query Builder (1/4 Width) --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#01411C] h-full">
                        <h3 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
                            <Cpu size={20} /> Query Builder
                        </h3>
                        
                        {/* Pre-built Prompts */}
                        <div className="space-y-2 mb-6">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Suggested Inquiries</label>
                            {PREBUILT_PROMPTS.map((section, idx) => {
                                const isExpanded = expandedSection === section.category;
                                return (
                                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
                                        <button 
                                            onClick={() => toggleSection(section.category)}
                                            className={`w-full flex justify-between items-center p-3 text-xs font-bold text-left transition-colors ${isExpanded ? 'bg-green-50 text-[#01411C]' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Layers size={14} /> {section.category}
                                            </span>
                                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        </button>
                                        
                                        {isExpanded && (
                                            <div className="p-2 bg-white space-y-1 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                                {section.questions.map((q, qIdx) => (
                                                    <label key={qIdx} className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-all text-xs leading-tight hover:bg-gray-50`}>
                                                        <input 
                                                            type="checkbox"
                                                            checked={selectedPrompts.includes(q)}
                                                            onChange={() => togglePrompt(q)}
                                                            className="mt-0.5 w-3 h-3 accent-[#01411C] shrink-0"
                                                        />
                                                        <span className={`text-gray-700 ${selectedPrompts.includes(q) ? 'font-medium text-[#01411C]' : ''}`}>{q}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Custom Prompt */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Custom Instructions</label>
                            <textarea 
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="e.g., Focus specifically on gender disparity..."
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#01411C] h-24 resize-none"
                            ></textarea>
                        </div>

                        {/* Chart Selector */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Visualization Type</label>
                            <div className="relative">
                                <select 
                                    value={chartType} 
                                    onChange={(e) => setChartType(e.target.value as any)}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#01411C] appearance-none"
                                >
                                    <option value="pie">Pie Chart (Distribution)</option>
                                    <option value="line">Line Chart (Trends over Time)</option>
                                    <option value="bar">Bar Chart / Heatmap View</option>
                                    <option value="area">Area Chart (Volume)</option>
                                </select>
                                <Activity className="absolute right-3 top-3 text-gray-400" size={16} />
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerateAI}
                            disabled={aiLoading}
                            className="w-full btn btn-primary flex justify-center items-center gap-2 py-3"
                        >
                            {aiLoading ? (
                                <>Processing...</>
                            ) : (
                                <><Sparkles size={18} /> Generate Analysis</>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Results Panel (3/4 Width) --- */}
                <div className="lg:col-span-3">
                    {aiResult ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 sticky top-6">
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-2xl font-bold text-[#01411C]">{aiResult.title}</h3>
                                <div className="flex gap-2">
                                    <button className="text-gray-500 hover:text-gray-800 p-2 rounded hover:bg-gray-100" title="Print" onClick={() => window.print()}><Printer size={20}/></button>
                                    <button className="text-gray-500 hover:text-gray-800 p-2 rounded hover:bg-gray-100" title="Download PDF"><Download size={20}/></button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    {/* Introduction */}
                                    <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-lg">
                                        <h4 className="text-blue-800 font-bold text-sm mb-2 uppercase">Executive Summary</h4>
                                        <p className="text-gray-800 text-sm leading-relaxed">{aiResult.intro}</p>
                                    </div>

                                    {/* Key Insights Grid */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <CheckSquare size={18} className="text-[#01411C]" /> Key Strategic Insights
                                        </h4>
                                        <div className="space-y-3">
                                            {aiResult.insights.map((insight, idx) => (
                                                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                                                    <h5 className="font-bold text-[#01411C] text-sm mb-1">{idx + 1}. {insight.label}</h5>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{insight.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-5 flex gap-4 items-start">
                                        <div className="bg-white p-2 rounded-full h-fit shadow-sm mt-1">
                                            <Lightbulb className="text-yellow-500" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-green-900 text-sm mb-1">AI Strategic Recommendation</h4>
                                            <p className="text-sm text-green-800 leading-relaxed">
                                                {aiResult.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-full flex flex-col">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                                            <BarChart2 size={16} /> Data Visualization
                                        </h4>
                                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                                            {renderChart()}
                                        </div>
                                        <p className="text-xs text-center text-gray-400 mt-4">
                                            Figure 1.1: {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart representation of filtered dataset.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center text-gray-400 min-h-[500px]">
                            {aiLoading ? (
                                <div className="flex flex-col items-center animate-pulse">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-64 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    <p className="mt-6 text-base font-medium text-[#01411C]">Analyzing cross-departmental data...</p>
                                </div>
                            ) : (
                                <>
                                    <Grid size={64} className="mb-6 opacity-30" />
                                    <h4 className="text-xl font-medium text-gray-500">Ready to Generate Report</h4>
                                    <p className="text-sm max-w-md mt-3 leading-relaxed">
                                        Configure the parameters in the top bar, select specific inquiries from the left panel, or write your own custom prompt to generate a detailed AI analysis.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
