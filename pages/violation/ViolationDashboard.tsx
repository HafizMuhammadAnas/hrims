import React, { useState, useEffect, useRef } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Filter, RefreshCcw, Calendar } from 'lucide-react';
import { db } from '../../services/mockDb';
import { ViolationEntry } from '../../types';
import { VIOLATION_CATEGORIES, getIndicatorsBySubCategory, MONITORING_STATUS_OPTIONS } from '../../violationCategories';
import { PROVINCE_DISTRICTS, getDistrictsByProvince } from '../../provinceDistricts';

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
    const [genderBasedViolationFilters, setGenderBasedViolationFilters] = useState({
        province: '',
        district: ''
    });
    const [provinceFilters, setProvinceFilters] = useState({
        category: ''
    });
    const [monitoringFilters, setMonitoringFilters] = useState({
        category: '',
        monitoringStatus: '',
        startDate: '',
        endDate: ''
    });

    // View modes for each graph
    const [gbvViewMode, setGbvViewMode] = useState<ViewMode>('graph');
    const [genderBasedViolationViewMode, setGenderBasedViolationViewMode] = useState<ViewMode>('graph');
    const [provinceViewMode, setProvinceViewMode] = useState<ViewMode>('graph');
    const [monitoringViewMode, setMonitoringViewMode] = useState<ViewMode>('graph');

    // Chart data
    const [gbvData, setGbvData] = useState<any[]>([]);
    const [genderBasedViolationData, setGenderBasedViolationData] = useState<any[]>([]);
    const [provinceData, setProvinceData] = useState<any[]>([]);
    const [monitoringData, setMonitoringData] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const scrollPositionRef = useRef<number>(0);

    useEffect(() => {
        // Save current scroll position before any changes
        scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        
        generateData();
    }, [filters, gbvFilters, genderBasedViolationFilters, provinceFilters, monitoringFilters]);

    // Separate effect to restore scroll position after render
    useEffect(() => {
        if (scrollPositionRef.current > 0) {
            // Use multiple attempts to ensure scroll is restored
            const restoreScroll = () => {
                window.scrollTo({
                    top: scrollPositionRef.current,
                    behavior: 'instant' as ScrollBehavior
                });
            };
            
            // Try immediately
            restoreScroll();
            
            // Try after a short delay
            setTimeout(restoreScroll, 0);
            setTimeout(restoreScroll, 50);
            setTimeout(restoreScroll, 100);
        }
    }, [gbvData, genderBasedViolationData, provinceData, monitoringData]);

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

            // Generate Main Categories Data - Show strength of all 6 main categories
            // Apply province filter if selected
            let categoryEntries = allEntries;
            if (gbvFilters.province) {
                categoryEntries = categoryEntries.filter(e => e.province === gbvFilters.province);
            }

            // Count violations by main category
            const categoryCounts: { [key: string]: number } = {};
            const hasCategoryData = categoryEntries.length > 0;
            const categoryFactor = gbvFilters.province ? 0.6 : factor;
            
            // Count real violations for each main category
            VIOLATION_CATEGORIES.forEach(category => {
                const realCount = categoryEntries.filter(e => 
                    e.violationCategory === category.id
                ).length;
                categoryCounts[category.name] = realCount;
            });

            // Generate chart data - always show all 6 main categories with their exact names
            // Use real data if available, otherwise varied dummy data
            const gbvChartData = VIOLATION_CATEGORIES.map((category, index) => {
                const realCount = categoryCounts[category.name] || 0;
                
                // Always use the exact category name from VIOLATION_CATEGORIES
                // If we have real data, use it; otherwise generate varied dummy data
                if (hasCategoryData && realCount > 0) {
                    return {
                        name: category.name, // Exact name from VIOLATION_CATEGORIES
                        violations: realCount
                    };
                } else {
                    // Generate varied dummy data for better visualization
                    const baseValue = 20 + (index * 8);
                    const randomVariation = rand(-5, 10);
                    const dummyValue = Math.max(1, baseValue + randomVariation);
                    
                    return {
                        name: category.name, // Exact name from VIOLATION_CATEGORIES
                        violations: Math.floor(dummyValue)
                    };
                }
            });
            setGbvData(gbvChartData);

            // Generate Gender Based Violation Data (23 indicators from Gender Based Violence subcategory)
            // Apply Gender Based Violation-specific province and district filters
            let genderBasedViolationEntries = allEntries;
            if (genderBasedViolationFilters.province) {
                genderBasedViolationEntries = genderBasedViolationEntries.filter(e => e.province === genderBasedViolationFilters.province);
            }
            if (genderBasedViolationFilters.district) {
                genderBasedViolationEntries = genderBasedViolationEntries.filter(e => e.district === genderBasedViolationFilters.district);
            }

            // Get the 23 indicators from Gender Based Violence subcategory
            const genderBasedViolationIndicators = getIndicatorsBySubCategory('women-hrds', 'gender-based-violence');
            
            // Check if any filters are applied
            const hasFilters = genderBasedViolationFilters.province || genderBasedViolationFilters.district;
            
            // Count real violations for each indicator from the filtered entries
            const genderBasedViolationChartData = genderBasedViolationIndicators.map((indicator, index) => {
                // Count real violations for this specific indicator from all filtered entries
                const realCount = genderBasedViolationEntries.filter(e => 
                    e.violationCategory === 'women-hrds' && 
                    e.violationSubCategory === 'gender-based-violence' &&
                    e.violationIndicator === indicator.id
                ).length;
                
                // If filters are applied, always use real data (even if 0)
                // If no filters are applied, show varied dummy data to represent overall strength across all provinces
                if (hasFilters) {
                    // Filters applied - show real filtered data
                    return {
                        name: indicator.name,
                        violations: realCount
                    };
                } else {
                    // No filters - show varied dummy data representing overall strength
                    // This gives a realistic view of the distribution across all provinces
                    const baseMultiplier = 1 + (index % 5);
                    const indexOffset = Math.floor(index / 5);
                    const baseValue = 8 + (indexOffset * 3) + (baseMultiplier * 2);
                    const randomVariation = rand(-3, 5);
                    const dummyValue = Math.max(1, baseValue + randomVariation);
                    
                    return {
                        name: indicator.name,
                        violations: Math.floor(dummyValue)
                    };
                }
            });
            setGenderBasedViolationData(genderBasedViolationChartData);

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
            // Apply monitoring-specific filters
            let monitoringEntries = allEntries;
            if (monitoringFilters.category) {
                monitoringEntries = monitoringEntries.filter(e => e.violationCategory === monitoringFilters.category);
            }
            if (monitoringFilters.monitoringStatus) {
                monitoringEntries = monitoringEntries.filter(e => e.monitoringStatus === monitoringFilters.monitoringStatus);
            }
            if (monitoringFilters.startDate) {
                monitoringEntries = monitoringEntries.filter(e => e.eventDate >= monitoringFilters.startDate);
            }
            if (monitoringFilters.endDate) {
                monitoringEntries = monitoringEntries.filter(e => e.eventDate <= monitoringFilters.endDate);
            }

            const monitoringStatuses = [
                { value: 'confirmed-verified', label: 'Confirmed/Verified', color: '#1976D2' }, // Dark Blue
                { value: 'resolved', label: 'Resolved', color: '#388E3C' }, // Dark Green
                { value: 'in-progress', label: 'In Progress', color: '#FBC02D' }, // Yellow
                { value: 'dismissed', label: 'Dismissed', color: '#D32F2F' }, // Dark Red
                { value: 'not-confirmed', label: 'Not Confirmed', color: '#0288D1' } // Light Blue
            ];

            const monitoringCounts: { [key: string]: number } = {};
            if (monitoringEntries.length > 0) {
                monitoringEntries.forEach(entry => {
                    if (entry.monitoringStatus) {
                        monitoringCounts[entry.monitoringStatus] = (monitoringCounts[entry.monitoringStatus] || 0) + 1;
                    }
                });
            }

            // Generate data for pie chart - use real data if available, otherwise dummy data
            const hasMonitoringData = monitoringEntries.length > 0;
            const monitoringChartData = monitoringStatuses.map(status => {
                const realCount = monitoringCounts[status.value] || 0;
                // If we have real data, use it; otherwise generate varied dummy data
                const count = hasMonitoringData && realCount > 0 
                    ? realCount 
                    : rand(5, 25);
                
                return {
                    name: status.label,
                    value: count,
                    color: status.color
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
                            <th key={col.key} className="px-4 py-2 text-left font-semibold text-white">
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
                            onChange={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                setFilters({...filters, province: e.target.value});
                            }}
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
                            onChange={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                setFilters({...filters, startDate: e.target.value});
                            }}
                            className="w-full p-2.5 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                        />
                    </div>

                    <div className="form-field">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">End Date / اختتامی تاریخ</label>
                        <input 
                            type="date" 
                            value={filters.endDate}
                            onChange={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                setFilters({...filters, endDate: e.target.value});
                            }}
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
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                            handleReset();
                        }}
                        className="btn btn-secondary py-2 px-4 text-sm h-[40px] w-full sm:w-auto"
                    >
                        <RefreshCcw size={16} /> Reset Filters
                    </button>
                </div>
            </div>

            {/* Charts Grid - One by One */}
            <div className="space-y-6">
                {/* Main Categories Violations Chart */}
                <ChartCard 
                    title="Violations by Main Category" 
                    id="chart-gbv"
                    viewMode={gbvViewMode}
                    onViewModeChange={setGbvViewMode}
                    chartFilter={
                        <div className="form-field">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Province / صوبہ</label>
                            <select 
                                value={gbvFilters.province}
                                onChange={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                    setGbvFilters({...gbvFilters, province: e.target.value});
                                }}
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
                                <BarChart 
                                    data={gbvData} 
                                    layout="vertical"
                                    margin={{ top: 20, right: 30, left: 250, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        width={240}
                                        tick={{fontSize: 12, fill: '#374151'}}
                                    />
                                    <Tooltip 
                                        contentStyle={{fontSize: '14px', padding: '10px', borderRadius: '8px'}}
                                        cursor={{fill: 'rgba(255, 87, 34, 0.1)'}}
                                    />
                                    <Bar dataKey="violations" fill="#FF5722" radius={[0, 4, 4, 0]} name="Number of Violations" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading chart data...</div>
                        )
                    ) : (
                        <TableView 
                            data={gbvData} 
                            columns={[
                                { key: 'name', label: 'Category' },
                                { key: 'violations', label: 'Number of Violations' }
                            ]} 
                        />
                    )}
                </ChartCard>

                {/* Gender Based Violation Chart */}
                <ChartCard 
                    title="Gender Based Violation" 
                    id="chart-gender-based-violation"
                    viewMode={genderBasedViolationViewMode}
                    onViewModeChange={setGenderBasedViolationViewMode}
                    chartFilter={
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Province / صوبہ</label>
                                <select 
                                    value={genderBasedViolationFilters.province}
                                    onChange={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                        setGenderBasedViolationFilters({
                                            ...genderBasedViolationFilters, 
                                            province: e.target.value,
                                            district: '' // Reset district when province changes
                                        });
                                    }}
                                    className="w-full p-3 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                                >
                                    <option value="">All Provinces / تمام صوبے</option>
                                    {PROVINCE_DISTRICTS.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by District / ضلع</label>
                                <select 
                                    value={genderBasedViolationFilters.district}
                                    onChange={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                        setGenderBasedViolationFilters({...genderBasedViolationFilters, district: e.target.value});
                                    }}
                                    disabled={!genderBasedViolationFilters.province}
                                    className="w-full p-3 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">All Districts / تمام اضلاع</option>
                                    {genderBasedViolationFilters.province && getDistrictsByProvince(genderBasedViolationFilters.province).map(d => (
                                        <option key={d.id} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    }
                >
                    {genderBasedViolationViewMode === 'graph' ? (
                        genderBasedViolationData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart data={genderBasedViolationData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={140} 
                                        tick={{fontSize: 12, fill: '#374151'}}
                                        interval={0}
                                    />
                                    <YAxis 
                                        label={{ value: 'Number of Violations', angle: -90, position: 'insideLeft', style: {fontSize: 14, fill: '#374151'} }}
                                        tick={{fontSize: 14, fill: '#374151'}}
                                    />
                                    <Tooltip 
                                        contentStyle={{fontSize: '14px', padding: '10px', borderRadius: '8px'}}
                                        cursor={{fill: 'rgba(156, 39, 176, 0.1)'}}
                                    />
                                    <Bar dataKey="violations" fill="#9C27B0" radius={[4, 4, 0, 0]} name="Number of Violations" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading chart data...</div>
                        )
                    ) : (
                        <TableView 
                            data={genderBasedViolationData} 
                            columns={[
                                { key: 'name', label: 'Indicator' },
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
                                onChange={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                    setProvinceFilters({...provinceFilters, category: e.target.value});
                                }}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Monitoring Status</label>
                                <select 
                                    value={monitoringFilters.monitoringStatus}
                                    onChange={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                        setMonitoringFilters({...monitoringFilters, monitoringStatus: e.target.value});
                                    }}
                                    className="w-full p-3 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                                >
                                    <option value="">- Any -</option>
                                    {MONITORING_STATUS_OPTIONS.filter(opt => opt.value !== '').map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block">Start date</label>
                                        <input 
                                            type="date" 
                                            value={monitoringFilters.startDate}
                                            onChange={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                                setMonitoringFilters({...monitoringFilters, startDate: e.target.value});
                                            }}
                                            className="w-full p-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block">End date</label>
                                        <input 
                                            type="date" 
                                            value={monitoringFilters.endDate}
                                            onChange={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                                                setMonitoringFilters({...monitoringFilters, endDate: e.target.value});
                                            }}
                                            className="w-full p-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#01411C] transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                >
                    {monitoringViewMode === 'graph' ? (
                        monitoringData.length > 0 ? (
                            <div style={{display: 'flex', gap: '30px', height: '450px', alignItems: 'center', justifyContent: 'center'}}>
                                <div style={{flex: 1, height: '100%', minHeight: '400px'}}>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                data={monitoringData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({name, percent}) => `${(percent * 100).toFixed(1)}%`}
                                                outerRadius={140}
                                                innerRadius={50}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {monitoringData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{fontSize: '14px', padding: '10px', borderRadius: '8px'}}
                                                formatter={(value: number) => [value, 'Violations']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{flex: 0.5, paddingLeft: '20px', paddingRight: '20px'}}>
                                    <h4 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#374151'}}>Monitoring Status</h4>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                        {monitoringData.map((entry, index) => (
                                            <div key={index} style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                                <div style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderRadius: '50%',
                                                    backgroundColor: entry.color || '#8884d8',
                                                    flexShrink: 0
                                                }}></div>
                                                <span style={{fontSize: '14px', color: '#374151'}}>{entry.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading chart data...</div>
                        )
                    ) : (
                        <TableView 
                            data={monitoringData.map(d => ({ name: d.name, violations: d.value }))} 
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

