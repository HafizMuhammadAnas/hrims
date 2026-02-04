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
    }, [filters]);

    const generateData = () => {
        setLoading(true);
        
        // Simulate loading delay
        setTimeout(() => {
            // Get filtered entries
            const entries = db.getAllViolationEntries({
                province: filters.province || undefined,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined
            });

            // Helper function to generate random dummy data
            const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
            const hasRealData = entries.length > 0;
            const factor = filters.province ? 0.6 : 1; // Reduce numbers if filtering by province

            // Generate GBV Data (from Women HRDs category and Transgender Rights)
            const gbvCategories = ['women-hrds', 'transgender-rights'];
            const gbvSubCategories = [
                { id: 'gender-based-violence', name: 'Gender Based Violence' },
                { id: 'cyber-crime', name: 'Cyber Crime' },
                { id: 'harassment-workplace', name: 'Harassment at Workplace' },
                { id: 'gbv', name: 'GBV' }
            ];

            const gbvCounts: { [key: string]: number } = {};
            gbvSubCategories.forEach(sub => {
                const realCount = entries.filter(e => 
                    gbvCategories.includes(e.violationCategory) && 
                    e.violationSubCategory === sub.id
                ).length;
                // Use real data if available, otherwise use dummy data
                gbvCounts[sub.name] = hasRealData ? realCount : rand(15, 45) * factor;
            });

            setGbvData(
                gbvSubCategories.map(sub => ({
                    name: sub.name,
                    violations: gbvCounts[sub.name]
                }))
            );

            // Generate Province Data
            const provinceCounts: { [key: string]: number } = {};
            if (hasRealData) {
                entries.forEach(entry => {
                    if (entry.province) {
                        provinceCounts[entry.province] = (provinceCounts[entry.province] || 0) + 1;
                    }
                });
            }

            // Generate dummy province data if no real data
            setProvinceData(
                PROVINCE_DISTRICTS.map(p => ({
                    name: p.name,
                    violations: hasRealData 
                        ? (provinceCounts[p.name] || 0)
                        : rand(10, 50) * factor
                }))
            );

            // Generate Monitoring Status Data
            const monitoringStatuses = [
                { value: 'confirmed-verified', label: 'Confirmed/Verified' },
                { value: 'dismissed', label: 'Dismissed' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'not-confirmed', label: 'Not Confirmed' },
                { value: 'resolved', label: 'Resolved' }
            ];

            const monitoringCounts: { [key: string]: number } = {};
            if (hasRealData) {
                entries.forEach(entry => {
                    if (entry.monitoringStatus) {
                        monitoringCounts[entry.monitoringStatus] = (monitoringCounts[entry.monitoringStatus] || 0) + 1;
                    }
                });
            }

            setMonitoringData(
                monitoringStatuses.map(status => ({
                    name: status.label,
                    violations: hasRealData
                        ? (monitoringCounts[status.value] || 0)
                        : rand(8, 35) * factor
                }))
            );

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
        onViewModeChange 
    }: { 
        title: string, 
        id: string, 
        children: React.ReactNode, 
        viewMode: ViewMode,
        onViewModeChange: (mode: ViewMode) => void
    }) => (
        <div id={id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 card relative group" style={{minHeight: '350px', height: 'auto', display: 'flex', flexDirection: 'column'}}>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                <h3 className="text-base md:text-lg font-bold text-gray-700">{title}</h3>
                
                {/* Graph/Table Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                    <button
                        onClick={() => onViewModeChange('graph')}
                        className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs md:text-sm font-medium transition-colors ${
                            viewMode === 'graph' 
                                ? 'bg-[#01411C] text-white' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Graph
                    </button>
                    <button
                        onClick={() => onViewModeChange('table')}
                        className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs md:text-sm font-medium transition-colors ${
                            viewMode === 'table' 
                                ? 'bg-[#01411C] text-white' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Table
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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* GBV Violations Chart */}
                <ChartCard 
                    title="GBV Violations" 
                    id="chart-gbv"
                    viewMode={gbvViewMode}
                    onViewModeChange={setGbvViewMode}
                >
                    {gbvViewMode === 'graph' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gbvData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="violations" fill="#FF5722" radius={[4, 4, 0, 0]} name="Number of Violations" />
                            </BarChart>
                        </ResponsiveContainer>
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
                >
                    {provinceViewMode === 'graph' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={provinceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="violations" fill="#01411C" radius={[4, 4, 0, 0]} name="Number of Violations" />
                            </BarChart>
                        </ResponsiveContainer>
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
                    title="Monitoring Status" 
                    id="chart-monitoring"
                    viewMode={monitoringViewMode}
                    onViewModeChange={setMonitoringViewMode}
                >
                    {monitoringViewMode === 'graph' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monitoringData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="violations" fill="#1E88E5" radius={[4, 4, 0, 0]} name="Number of Violations" />
                            </BarChart>
                        </ResponsiveContainer>
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

