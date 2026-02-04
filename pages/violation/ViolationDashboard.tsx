import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Filter, RefreshCcw, Calendar } from 'lucide-react';
import { db } from '../../services/mockDb';
import { ViolationEntry } from '../../types';
import { VIOLATION_CATEGORIES } from '../../violationCategories';
import { PROVINCE_DISTRICTS } from '../../provinceDistricts';

type ViewMode = 'graph' | 'table';

const ViolationDashboard: React.FC = () => {
    // Global Filters
    const [filters, setFilters] = useState({
        province: '',
        startDate: '',
        endDate: ''
    });

    // Individual Chart Filters
    const [gbvFilters, setGbvFilters] = useState({
        province: ''
    });
    const [provinceFilters, setProvinceFilters] = useState({
        category: ''
    });
    const [monitoringFilters, setMonitoringFilters] = useState({
        category: ''
    });

    // View modes for each graph
    const [gbvViewMode, setGbvViewMode] = useState<ViewMode>('graph');
    const [provinceViewMode, setProvinceViewMode] = useState<ViewMode>('graph');
    const [monitoringViewMode, setMonitoringViewMode] = useState<ViewMode>('graph');

    // Chart data
    const [gbvData, setGbvData] = useState<any[]>([]);
    const [provinceData, setProvinceData] = useState<any[]>([]);
    const [monitoringData, setMonitoringData] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        generateData();
    }, [filters, gbvFilters, provinceFilters, monitoringFilters]);

    const generateData = () => {
        setLoading(true);
        
        // Simulate loading delay
        setTimeout(() => {
            // Helper function to generate random dummy data
            const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
            // Get filtered entries (combine global and chart-specific filters)
            const allEntries = db.getAllViolationEntries({
                province: filters.province || undefined,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined
            });

            const hasRealData = allEntries.length > 0;
            const factor = filters.province ? 0.6 : 1; // Reduce numbers if filtering by province

            // Generate GBV Data (from Women HRDs category and Transgender Rights)
            // Apply GBV-specific province filter
            let gbvEntries = allEntries;
            if (gbvFilters.province) {
                gbvEntries = gbvEntries.filter(e => e.province === gbvFilters.province);
            }

            const gbvCategories = ['women-hrds', 'transgender-rights'];
            const gbvSubCategories = [
                { id: 'gender-based-violence', name: 'Gender Based Violence' },
                { id: 'cyber-crime', name: 'Cyber Crime' },
                { id: 'harassment-workplace', name: 'Harassment at Workplace' },
                { id: 'gbv', name: 'GBV' }
            ];

            const gbvCounts: { [key: string]: number } = {};
            const hasGbvData = gbvEntries.length > 0;
            const gbvFactor = gbvFilters.province ? 0.5 : factor;
            
            gbvSubCategories.forEach(sub => {
                const realCount = gbvEntries.filter(e => 
                    gbvCategories.includes(e.violationCategory) && 
                    e.violationSubCategory === sub.id
                ).length;
                // Always show data - use real if available, otherwise dummy
                gbvCounts[sub.name] = hasGbvData && realCount > 0 ? realCount : rand(15, 45) * gbvFactor;
            });

            // Ensure we always have data for GBV chart - always show dummy data
            const gbvChartData = gbvSubCategories.map(sub => {
                const count = gbvCounts[sub.name] || 0;
                return {
                    name: sub.name,
                    violations: count > 0 ? count : rand(15, 45) * gbvFactor
                };
            });
            setGbvData(gbvChartData);

            // Generate Province Data
            // Apply province-specific category filter
            let provinceEntries = allEntries;
            if (provinceFilters.category) {
                provinceEntries = provinceEntries.filter(e => e.violationCategory === provinceFilters.category);
            }

            const provinceCounts: { [key: string]: number } = {};
            if (provinceEntries.length > 0) {
                provinceEntries.forEach(entry => {
                    if (entry.province) {
                        provinceCounts[entry.province] = (provinceCounts[entry.province] || 0) + 1;
                    }
                });
            }

            // Generate dummy province data if no real data
            const provinceFactor = provinceFilters.category ? 0.7 : factor;
            const hasProvinceData = provinceEntries.length > 0;
            
            // Ensure we always have data for Province chart - always show dummy data
            const provinceChartData = PROVINCE_DISTRICTS.map(p => {
                const count = provinceCounts[p.name] || 0;
                return {
                    name: p.name,
                    violations: count > 0 ? count : rand(10, 50) * provinceFactor
                };
            });
            setProvinceData(provinceChartData);

            // Generate Monitoring Status Data
            // Apply monitoring-specific category filter (all categories)
            let monitoringEntries = allEntries;
            if (monitoringFilters.category) {
                monitoringEntries = monitoringEntries.filter(e => e.violationCategory === monitoringFilters.category);
            }

            const monitoringStatuses = [
                { value: 'confirmed-verified', label: 'Confirmed/Verified' },
                { value: 'dismissed', label: 'Dismissed' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'not-confirmed', label: 'Not Confirmed' },
                { value: 'resolved', label: 'Resolved' }
            ];

            const monitoringCounts: { [key: string]: number } = {};
            if (monitoringEntries.length > 0) {
                monitoringEntries.forEach(entry => {
                    if (entry.monitoringStatus) {
                        monitoringCounts[entry.monitoringStatus] = (monitoringCounts[entry.monitoringStatus] || 0) + 1;
                    }
                });
            }

            const monitoringFactor = monitoringFilters.category ? 0.7 : factor;
            const hasMonitoringData = monitoringEntries.length > 0;
            
            // Ensure we always have data for Monitoring chart - always show dummy data
            const monitoringChartData = monitoringStatuses.map(status => {
                const count = monitoringCounts[status.value] || 0;
                return {
                    name: status.label,
                    violations: count > 0 ? count : rand(8, 35) * monitoringFactor
                };
            });
            setMonitoringData(monitoringChartData);

            setLoading(false);
        }, 300);
    };

    const handleReset = () => {
        setFilters({
            province: '',
            startDate: '',
            endDate: ''
        });
    };

    const ChartCard = ({ 
        title, 
        id, 
        children, 
        viewMode, 
        onViewModeChange,
        chartFilter,
        onFilterChange
    }: { 
        title: string, 
        id: string, 
        children: React.ReactNode, 
        viewMode: ViewMode,
        onViewModeChange: (mode: ViewMode) => void,
        chartFilter?: React.ReactNode,
        onFilterChange?: () => void
    }) => (
        <div id={id} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 card relative group w-full" style={{minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4 pb-4 border-b border-gray-200">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h3>
                
                {/* Graph/Table Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => onViewModeChange('graph')}
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                            viewMode === 'graph' 
                                ? 'bg-[#01411C] text-white' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Graph
                    </button>
                    <button
                        onClick={() => onViewModeChange('table')}
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                            viewMode === 'table' 
                                ? 'bg-[#01411C] text-white' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Table
                    </button>
                </div>
            </div>

            {/* Chart-specific Filter */}
            {chartFilter && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                    <div className="flex items-center gap-2 mb-3">
                        <Filter size={16} className="text-[#01411C]" />
                        <span className="text-sm font-bold text-gray-700 uppercase">Chart Filter</span>
                    </div>
                    <div className="max-w-md">
                        {chartFilter}
                    </div>
                </div>
            )}
            
            {loading ? (
                <div className="flex-1 flex items-center justify-center" style={{height: '450px'}}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01411C]"></div>
                </div>
            ) : (
                <div className="flex-1" style={{height: '450px', width: '100%'}}>
                    {children}
                </div>
            )}
        </div>
    );

    const TableView = ({ data, columns }: { data: any[], columns: { key: string, label: string }[] }) => (
        <div className="overflow-auto h-full">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        {columns.map(col => (
                            <th key={col.key} className="px-4 py-2 text-left font-semibold text-gray-700">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-2 text-gray-700">
                                        {item[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-bold text-[#01411C]">Violation Database Dashboard</h1>

            {/* Global Filters */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border-l-4 border-[#01411C]">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                    <Filter className="text-[#01411C]" size={20} />
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">Dashboard Filters</h3>
                    <span className="text-xs text-gray-500 ml-auto">Filters apply to all charts below</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Province / صوبہ</label>
                        <select 
                            value={filters.province}
                            onChange={e => setFilters({...filters, province: e.target.value})}
                            className="p-2.5 border-2 border-gray-300 rounded-md text-sm w-full focus:outline-none focus:border-[#01411C] transition-colors"
                        >
                            <option value="">All Provinces / تمام صوبے</option>
                            {PROVINCE_DISTRICTS.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Start Date / شروع کی تاریخ</label>
                        <input 
                            type="date" 
                            value={filters.startDate}
                            onChange={e => setFilters({...filters, startDate: e.target.value})}
                            className="w-full p-2.5 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                        />
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">End Date / اختتامی تاریخ</label>
                        <input 
                            type="date" 
                            value={filters.endDate}
                            onChange={e => setFilters({...filters, endDate: e.target.value})}
                            className="w-full p-2.5 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-600">
                        {filters.province && <span className="inline-block mr-2 px-2 py-1 bg-[#01411C] text-white rounded">Province: {filters.province}</span>}
                        {filters.startDate && <span className="inline-block mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">From: {filters.startDate}</span>}
                        {filters.endDate && <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">To: {filters.endDate}</span>}
                        {!filters.province && !filters.startDate && !filters.endDate && <span className="text-gray-400">No filters applied - showing all data</span>}
                    </div>
                    <button 
                        onClick={handleReset}
                        className="btn btn-secondary py-2 px-4 text-sm h-[40px] w-full sm:w-auto"
                    >
                        <RefreshCcw size={16} /> Reset Filters
                    </button>
                </div>
            </div>

            {/* Charts Grid - One by One */}
            <div className="space-y-6">
                {/* GBV Violations Chart */}
                <ChartCard 
                    title="GBV Violations" 
                    id="chart-gbv"
                    viewMode={gbvViewMode}
                    onViewModeChange={setGbvViewMode}
                    chartFilter={
                        <div className="form-field">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Province / صوبہ</label>
                            <select 
                                value={gbvFilters.province}
                                onChange={e => setGbvFilters({...gbvFilters, province: e.target.value})}
                                className="w-full p-3 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                            >
                                <option value="">All Provinces / تمام صوبے</option>
                                {PROVINCE_DISTRICTS.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    }
                >
                    {gbvViewMode === 'graph' ? (
                        gbvData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart data={gbvData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={120} 
                                        tick={{fontSize: 14, fill: '#374151'}}
                                        interval={0}
                                    />
                                    <YAxis 
                                        label={{ value: 'Number of Violations', angle: -90, position: 'insideLeft', style: {fontSize: 14, fill: '#374151'} }}
                                        tick={{fontSize: 14, fill: '#374151'}}
                                    />
                                    <Tooltip 
                                        contentStyle={{fontSize: '14px', padding: '10px', borderRadius: '8px'}}
                                        cursor={{fill: 'rgba(255, 87, 34, 0.1)'}}
                                    />
                                    <Bar dataKey="violations" fill="#FF5722" radius={[4, 4, 0, 0]} name="Number of Violations" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading chart data...</div>
                        )
                    ) : (
                        <TableView 
                            data={gbvData} 
                            columns={[
                                { key: 'name', label: 'GBV Type' },
                                { key: 'violations', label: 'Number of Violations' }
                            ]} 
                        />
                    )}
                </ChartCard>

                {/* Provinces Chart */}
                <ChartCard 
                    title="Violations by Province" 
                    id="chart-provinces"
                    viewMode={provinceViewMode}
                    onViewModeChange={setProvinceViewMode}
                    chartFilter={
                        <div className="form-field">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Category / زمرہ</label>
                            <select 
                                value={provinceFilters.category}
                                onChange={e => setProvinceFilters({...provinceFilters, category: e.target.value})}
                                className="w-full p-3 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                            >
                                <option value="">All Categories / تمام زمرے</option>
                                {VIOLATION_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    }
                >
                    {provinceViewMode === 'graph' ? (
                        provinceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart data={provinceData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={120} 
                                        tick={{fontSize: 14, fill: '#374151'}}
                                        interval={0}
                                    />
                                    <YAxis 
                                        label={{ value: 'Number of Violations', angle: -90, position: 'insideLeft', style: {fontSize: 14, fill: '#374151'} }}
                                        tick={{fontSize: 14, fill: '#374151'}}
                                    />
                                    <Tooltip 
                                        contentStyle={{fontSize: '14px', padding: '10px', borderRadius: '8px'}}
                                        cursor={{fill: 'rgba(1, 65, 28, 0.1)'}}
                                    />
                                    <Bar dataKey="violations" fill="#01411C" radius={[4, 4, 0, 0]} name="Number of Violations" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading chart data...</div>
                        )
                    ) : (
                        <TableView 
                            data={provinceData} 
                            columns={[
                                { key: 'name', label: 'Province' },
                                { key: 'violations', label: 'Number of Violations' }
                            ]} 
                        />
                    )}
                </ChartCard>

                {/* Monitoring Status Chart */}
                <ChartCard 
                    title="Monitoring Status (All Categories)" 
                    id="chart-monitoring"
                    viewMode={monitoringViewMode}
                    onViewModeChange={setMonitoringViewMode}
                    chartFilter={
                        <div className="form-field">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Category / زمرہ</label>
                            <select 
                                value={monitoringFilters.category}
                                onChange={e => setMonitoringFilters({...monitoringFilters, category: e.target.value})}
                                className="w-full p-3 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                            >
                                <option value="">All Categories / تمام زمرے</option>
                                {VIOLATION_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    }
                >
                    {monitoringViewMode === 'graph' ? (
                        monitoringData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart data={monitoringData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={120} 
                                        tick={{fontSize: 14, fill: '#374151'}}
                                        interval={0}
                                    />
                                    <YAxis 
                                        label={{ value: 'Number of Violations', angle: -90, position: 'insideLeft', style: {fontSize: 14, fill: '#374151'} }}
                                        tick={{fontSize: 14, fill: '#374151'}}
                                    />
                                    <Tooltip 
                                        contentStyle={{fontSize: '14px', padding: '10px', borderRadius: '8px'}}
                                        cursor={{fill: 'rgba(30, 136, 229, 0.1)'}}
                                    />
                                    <Bar dataKey="violations" fill="#1E88E5" radius={[4, 4, 0, 0]} name="Number of Violations" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading chart data...</div>
                        )
                    ) : (
                        <TableView 
                            data={monitoringData} 
                            columns={[
                                { key: 'name', label: 'Monitoring Status' },
                                { key: 'violations', label: 'Number of Violations' }
                            ]} 
                        />
                    )}
                </ChartCard>
            </div>
        </div>
    );
};

export default ViolationDashboard;

