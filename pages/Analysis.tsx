
import React, { useState, useEffect, useRef } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Filter, RefreshCcw, Download, Image as ImageIcon, FileText, Calendar } from 'lucide-react';
import { CONVENTIONS, INDICATORS, SDGS } from '../constants';

// --- Types & Constants ---
const COLORS = ['#FFC107', '#4CAF50', '#2196F3', '#FF5722', '#9C27B0', '#00BCD4', '#795548'];
const STATUS_COLORS = ['#FFB300', '#4CAF50'];

// --- Helper for Image Export (SVG to PNG) ---
const downloadChartAsImage = (chartId: string, title: string) => {
    const container = document.getElementById(chartId);
    if (!container) return;

    const svg = container.querySelector('svg');
    if (!svg) {
        alert('Chart not ready for export.');
        return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Set dimensions based on SVG
    const svgData = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgData);

    img.onload = () => {
        // Add white background (charts are transparent by default)
        canvas.width = img.width + 40; // Add padding
        canvas.height = img.height + 60; // Add padding
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add Title text
            ctx.font = 'bold 16px sans-serif';
            ctx.fillStyle = '#01411C';
            ctx.fillText(title, 20, 30);

            ctx.drawImage(img, 20, 50);
            
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${title.replace(/\s+/g, '_')}_Analysis.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(url);
    };
    img.src = url;
};

const Analysis: React.FC = () => {
    // --- Filter State ---
    const [filters, setFilters] = useState({
        convention: 'All',
        status: 'All',
        province: 'All',
        dateFrom: '',
        dateTo: '',
        hri: 'All',
        sdg: 'All'
    });

    // --- Data State (Reactive) ---
    const [chartData, setChartData] = useState({
        conventions: [] as any[],
        status: [] as any[],
        timeline: [] as any[],
        provinces: [] as any[],
        sdgs: [] as any[]
    });

    const [loading, setLoading] = useState(false);

    // --- Data Generation Logic (Simulates API filtering) ---
    const generateData = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            // Randomizer helper to simulate different data sets based on filters
            const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
            const factor = filters.province !== 'All' ? 0.4 : 1; // Reduce numbers if filtering by province

            setChartData({
                conventions: [
                    { name: 'ICERD', records: rand(30, 60) * factor, compliance: rand(60, 85) },
                    { name: 'ICCPR', records: rand(25, 50) * factor, compliance: rand(55, 75) },
                    { name: 'ICESCR', records: rand(20, 45) * factor, compliance: rand(50, 70) },
                    { name: 'CEDAW', records: rand(40, 70) * factor, compliance: rand(60, 80) },
                    { name: 'CAT', records: rand(15, 35) * factor, compliance: rand(50, 65) },
                    { name: 'CRC', records: rand(35, 55) * factor, compliance: rand(58, 78) },
                    { name: 'CRPD', records: rand(20, 40) * factor, compliance: rand(45, 65) },
                ].filter(c => filters.convention === 'All' || filters.convention === c.name), // Filter logic

                status: [
                    { name: 'Ongoing', value: rand(80, 150) * factor },
                    { name: 'Accomplished', value: rand(100, 200) * factor },
                ],

                timeline: [
                    { name: 'Jan', requests: rand(10, 20), completed: rand(5, 15) },
                    { name: 'Feb', requests: rand(15, 25), completed: rand(10, 20) },
                    { name: 'Mar', requests: rand(12, 22), completed: rand(8, 18) },
                    { name: 'Apr', requests: rand(20, 30), completed: rand(15, 25) },
                    { name: 'May', requests: rand(18, 28), completed: rand(12, 22) },
                    { name: 'Jun', requests: rand(25, 35), completed: rand(20, 30) },
                ],

                provinces: [
                    { name: 'Punjab', value: rand(70, 90) },
                    { name: 'Sindh', value: rand(50, 70) },
                    { name: 'KPK', value: rand(35, 55) },
                    { name: 'Balochistan', value: rand(20, 40) },
                    { name: 'Islamabad', value: rand(15, 25) },
                    { name: 'GB', value: rand(10, 20) },
                    { name: 'AJK', value: rand(10, 20) },
                ].filter(p => filters.province === 'All' || filters.province === p.name),

                sdgs: [
                    { subject: 'No Poverty', A: rand(100, 140), fullMark: 150 },
                    { subject: 'Health', A: rand(90, 130), fullMark: 150 },
                    { subject: 'Education', A: rand(80, 120), fullMark: 150 },
                    { subject: 'Gender Eq', A: rand(90, 140), fullMark: 150 },
                    { subject: 'Work', A: rand(70, 110), fullMark: 150 },
                    { subject: 'Inequality', A: rand(60, 100), fullMark: 150 },
                ].filter(s => filters.sdg === 'All' || s.subject.includes(filters.sdg.substring(0, 5)))
            });
            setLoading(false);
        }, 600);
    };

    // Initial Load
    useEffect(() => {
        generateData();
    }, []);

    const handleReset = () => {
        setFilters({
            convention: 'All',
            status: 'All',
            province: 'All',
            dateFrom: '',
            dateTo: '',
            hri: 'All',
            sdg: 'All'
        });
    };

    // --- Chart Container Wrapper Component ---
    const ChartCard = ({ title, id, children, fullWidth = false }: { title: string, id: string, children: React.ReactNode, fullWidth?: boolean }) => (
        <div id={id} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 card relative group ${fullWidth ? 'lg:col-span-2' : ''} h-96 flex flex-col`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-700">{title}</h3>
                
                {/* Export Toolbar (Visible on Hover) */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-100 p-1.5 rounded-lg">
                    <button 
                        onClick={() => downloadChartAsImage(id, title)}
                        className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-blue-600" 
                        title="Save as Image"
                    >
                        <ImageIcon size={16} />
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-red-600" 
                        title="Print / Save PDF"
                    >
                        <FileText size={16} />
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01411C]"></div>
                </div>
            ) : (
                <div className="flex-1 min-h-0">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#01411C]">Data Analytics & Performance</h1>

            {/* --- TOP FILTERS BAR --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#01411C]">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                    <Filter className="text-[#01411C]" size={20} />
                    <h3 className="font-bold text-gray-800 text-lg">Filters Configuration</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Convention</label>
                        <select 
                            value={filters.convention}
                            onChange={e => setFilters({...filters, convention: e.target.value})}
                            className="p-2 border rounded-md text-sm"
                        >
                            <option value="All">All Conventions</option>
                            {CONVENTIONS.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                        <select 
                            value={filters.status}
                            onChange={e => setFilters({...filters, status: e.target.value})}
                            className="p-2 border rounded-md text-sm"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Accomplished">Accomplished</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Date Range</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input 
                                    type="date" 
                                    value={filters.dateFrom}
                                    onChange={e => setFilters({...filters, dateFrom: e.target.value})}
                                    className="w-full p-2 border rounded-md text-xs"
                                />
                            </div>
                            <div className="relative flex-1">
                                <input 
                                    type="date" 
                                    value={filters.dateTo}
                                    onChange={e => setFilters({...filters, dateTo: e.target.value})}
                                    className="w-full p-2 border rounded-md text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">Province</label>
                        <select 
                            value={filters.province}
                            onChange={e => setFilters({...filters, province: e.target.value})}
                            className="p-2 border rounded-md text-sm"
                        >
                            <option value="All">All Provinces</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Sindh">Sindh</option>
                            <option value="KPK">KPK</option>
                            <option value="Balochistan">Balochistan</option>
                            <option value="Islamabad">Islamabad</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">HR Indicator (HRI)</label>
                        <select 
                            value={filters.hri}
                            onChange={e => setFilters({...filters, hri: e.target.value})}
                            className="p-2 border rounded-md text-sm"
                        >
                            <option value="All">All Indicators</option>
                            {INDICATORS.map(i => <option key={i.title} value={i.title}>{i.title}</option>)}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase">SDG Goal</label>
                        <select 
                            value={filters.sdg}
                            onChange={e => setFilters({...filters, sdg: e.target.value})}
                            className="p-2 border rounded-md text-sm"
                        >
                            <option value="All">All Goals</option>
                            {SDGS.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                    </div>

                    <div className="lg:col-span-2 flex items-end gap-3 justify-end">
                        <button 
                            onClick={handleReset}
                            className="btn btn-secondary py-2 px-4 text-sm h-[40px]"
                        >
                            <RefreshCcw size={16} /> Reset
                        </button>
                        <button 
                            onClick={generateData}
                            className="btn btn-primary py-2 px-6 text-sm h-[40px]"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CHARTS GRID --- */}
            
            {/* Row 1: Timeline & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ChartCard title="Monthly Progress Trend" id="chart-timeline" fullWidth>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.timeline}>
                            <defs>
                                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#1E88E5" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="requests" stroke="#1E88E5" fillOpacity={1} fill="url(#colorReq)" name="Requests Sent" />
                            <Area type="monotone" dataKey="completed" stroke="#4CAF50" fillOpacity={1} fill="url(#colorComp)" name="Completed" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Status Distribution" id="chart-status">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData.status}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.status.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Row 2: Conventions & Provinces */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Records by Convention" id="chart-conventions">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.conventions} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                            <Tooltip />
                            <Bar dataKey="records" fill="#01411C" radius={[0, 4, 4, 0]} name="Total Records" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Provincial Activity Volume" id="chart-provinces">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData.provinces}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.provinces.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Row 3: SDG Radar & Detailed Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ChartCard title="SDG Alignment" id="chart-sdg">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.sdgs}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 10}} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} />
                            <Radar name="SDG Compliance" dataKey="A" stroke="#00ACC1" fill="#00ACC1" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Detailed Metrics Table - Custom container as it's not a recharts component */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2 border border-gray-100 flex flex-col h-96">
                    <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                         <h3 className="text-lg font-bold text-gray-700">Detailed Implementation Metrics</h3>
                         <button onClick={() => window.print()} className="text-gray-500 hover:text-[#01411C] btn btn-secondary py-1 px-3 text-xs"><Download size={14}/> Export Data</button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-[#1E88E5] text-white sticky top-0">
                                <tr>
                                    <th className="p-4 font-semibold text-sm">Convention</th>
                                    <th className="p-4 font-semibold text-sm">Total Records</th>
                                    <th className="p-4 font-semibold text-sm">Compliance Score</th>
                                    <th className="p-4 font-semibold text-sm">Ongoing</th>
                                    <th className="p-4 font-semibold text-sm">Accomplished</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.conventions.length > 0 ? chartData.conventions.map((row, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{row.name}</td>
                                        <td className="p-4">{Math.floor(row.records)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${row.compliance}%`}}></div>
                                                </div>
                                                <span className="text-xs font-mono">{row.compliance}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-yellow-600 font-bold">{Math.floor(row.records * 0.4)}</td>
                                        <td className="p-4 text-green-600 font-bold">{Math.floor(row.records * 0.6)}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No data matches current filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
