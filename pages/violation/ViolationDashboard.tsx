import React, { useState, useEffect, useRef } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Filter, RefreshCcw, Calendar, TrendingUp, AlertCircle, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
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
    const [trendData, setTrendData] = useState<any[]>([]);
    
    // Summary statistics
    const [summaryStats, setSummaryStats] = useState({
        totalViolations: 0,
        byCategory: 0,
        byStatus: {} as { [key: string]: number },
        recentEntries: 0
    });

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

            // Calculate summary statistics
            const totalViolationsCount = allEntries.length;
            const categoryCount = new Set(allEntries.map(e => e.violationCategory)).size;
            const statusCounts: { [key: string]: number } = {};
            allEntries.forEach(entry => {
                if (entry.monitoringStatus) {
                    statusCounts[entry.monitoringStatus] = (statusCounts[entry.monitoringStatus] || 0) + 1;
                }
            });
            // Count recent entries (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentEntries = allEntries.filter(e => {
                const entryDate = new Date(e.eventDate);
                return entryDate >= thirtyDaysAgo;
            }).length;

            setSummaryStats({
                totalViolations: totalViolationsCount || rand(150, 300),
                byCategory: categoryCount || 6,
                byStatus: statusCounts,
                recentEntries: recentEntries || rand(10, 50)
            });

            // Generate trend data (monthly violations over last 6 months)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            const trendChartData = months.map((month, index) => {
                // Count real violations for this month if available
                const monthEntries = allEntries.filter(e => {
                    const entryDate = new Date(e.eventDate);
                    const monthIndex = entryDate.getMonth();
                    return monthIndex === index;
                });
                const realCount = monthEntries.length;
                
                // Use real data if available, otherwise generate dummy data
                return {
                    month,
                    violations: realCount > 0 ? realCount : rand(15, 45) * factor
                };
            });
            setTrendData(trendChartData);

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

            // Pastel color palette for main categories - 6 distinct colors
            const mainCategoryColors = [
                '#FFB3BA', // Pastel Pink
                '#BAE1FF', // Pastel Sky Blue
                '#BAFFC9', // Pastel Mint Green
                '#FFDFBA', // Pastel Peach
                '#E6B3FF', // Pastel Lavender
                '#FFFFBA'  // Pastel Yellow
            ];
            
            // Generate chart data - always show all 6 main categories with their exact names
            // Use real data if available, otherwise varied dummy data
            const gbvChartData = VIOLATION_CATEGORIES.map((category, index) => {
                const realCount = categoryCounts[category.name] || 0;
                
                // Always use the exact category name from VIOLATION_CATEGORIES
                // If we have real data, use it; otherwise generate varied dummy data
                if (hasCategoryData && realCount > 0) {
                    return {
                        name: category.name, // Exact name from VIOLATION_CATEGORIES
                        violations: realCount,
                        color: mainCategoryColors[index % mainCategoryColors.length]
                    };
                } else {
                    // Generate varied dummy data for better visualization
                    const baseValue = 20 + (index * 8);
                    const randomVariation = rand(-5, 10);
                    const dummyValue = Math.max(1, baseValue + randomVariation);
                    
                    return {
                        name: category.name, // Exact name from VIOLATION_CATEGORIES
                        violations: Math.floor(dummyValue),
                        color: mainCategoryColors[index % mainCategoryColors.length]
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
            
            // Ensure we have exactly 23 indicators
            if (genderBasedViolationIndicators.length !== 23) {
                console.warn(`Expected 23 indicators but found ${genderBasedViolationIndicators.length}`);
            }
            
            // Pastel color palette for different bars - 23 distinct colors
            const pastelColors = [
                '#FFB3BA', // Pastel Pink
                '#BAFFC9', // Pastel Mint Green
                '#BAE1FF', // Pastel Sky Blue
                '#FFFFBA', // Pastel Yellow
                '#FFDFBA', // Pastel Peach
                '#E6B3FF', // Pastel Lavender
                '#B3FFE6', // Pastel Aqua
                '#FFB3E6', // Pastel Rose
                '#B3D9FF', // Pastel Light Blue
                '#FFE6B3', // Pastel Cream
                '#D4A5FF', // Pastel Purple
                '#A5FFD4', // Pastel Seafoam
                '#FFA5D4', // Pastel Magenta
                '#A5D4FF', // Pastel Blue
                '#FFD4A5', // Pastel Orange
                '#C4B5FF', // Pastel Periwinkle
                '#B5FFC4', // Pastel Green
                '#FFB5C4', // Pastel Coral
                '#B5C4FF', // Pastel Cornflower
                '#FFC4B5', // Pastel Salmon
                '#B3B3FF', // Pastel Indigo
                '#B3FFB3', // Pastel Lime
                '#FFB3B3'  // Pastel Red
            ];
            
            // Check if any filters are applied
            const hasFilters = genderBasedViolationFilters.province || genderBasedViolationFilters.district;
            
            // Count real violations for each indicator from the filtered entries
            // Ensure ALL 23 indicators are included, even if they have 0 violations
            let genderBasedViolationChartData = genderBasedViolationIndicators.map((indicator, index) => {
                // Ensure indicator has a name
                if (!indicator || !indicator.name) {
                    console.warn(`Indicator at index ${index} is missing a name`);
                }
                
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
                        name: indicator.name || `Indicator ${index + 1}`,
                        violations: realCount,
                        color: pastelColors[index % pastelColors.length]
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
                        name: indicator.name || `Indicator ${index + 1}`,
                        violations: Math.floor(dummyValue),
                        color: pastelColors[index % pastelColors.length]
                    };
                }
            });
            
            // Validate that we have exactly 23 bars with names
            if (genderBasedViolationChartData.length !== 23) {
                console.error(`Expected 23 bars but got ${genderBasedViolationChartData.length}`);
            }
            
            // Validate that all bars have names
            const barsWithoutNames = genderBasedViolationChartData.filter(item => !item.name);
            if (barsWithoutNames.length > 0) {
                console.error(`Found ${barsWithoutNames.length} bars without names`);
            }
            
            // Calculate total violations for percentage calculation
            const totalViolations = genderBasedViolationChartData.reduce((sum, item) => sum + item.violations, 0);
            
            // Add percentage to each data point
            genderBasedViolationChartData = genderBasedViolationChartData.map(item => ({
                ...item,
                percentage: totalViolations > 0 ? ((item.violations / totalViolations) * 100).toFixed(1) : '0.0'
            }));
            
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
                { value: 'confirmed-verified', label: 'Confirmed/Verified', color: '#7FC4D9' }, // Darker Pastel Blue
                { value: 'resolved', label: 'Resolved', color: '#A5D4A6' }, // Darker Pastel Green
                { value: 'in-progress', label: 'In Progress', color: '#FFE082' }, // Darker Pastel Yellow
                { value: 'dismissed', label: 'Dismissed', color: '#F19BB8' }, // Darker Pastel Pink
                { value: 'not-confirmed', label: 'Not Confirmed', color: '#81D4FA' } // Darker Pastel Light Blue
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
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-[#01411C]">Violation Database Dashboard</h1>
            </div>

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#01411C] to-[#026d2a] p-6 rounded-xl shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <AlertCircle className="text-white" size={24} />
                        </div>
                        <TrendingUp className="text-white/70" size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1">Total Violations</h3>
                    <p className="text-3xl font-bold">{summaryStats.totalViolations.toLocaleString()}</p>
                    <p className="text-xs text-white/70 mt-2">All categories combined</p>
                </div>

                <div className="bg-gradient-to-br from-[#7FC4D9] to-[#5BA8C4] p-6 rounded-xl shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <FileText className="text-white" size={24} />
                        </div>
                        <TrendingUp className="text-white/70" size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1">Categories</h3>
                    <p className="text-3xl font-bold">{summaryStats.byCategory}</p>
                    <p className="text-xs text-white/70 mt-2">Active violation categories</p>
                </div>

                <div className="bg-gradient-to-br from-[#A5D4A6] to-[#7FC482] p-6 rounded-xl shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <CheckCircle className="text-white" size={24} />
                        </div>
                        <TrendingUp className="text-white/70" size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1">Resolved</h3>
                    <p className="text-3xl font-bold">{summaryStats.byStatus['resolved'] || 0}</p>
                    <p className="text-xs text-white/70 mt-2">Cases resolved</p>
                </div>

                <div className="bg-gradient-to-br from-[#FFE082] to-[#FFC107] p-6 rounded-xl shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Clock className="text-white" size={24} />
                        </div>
                        <TrendingUp className="text-white/70" size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-white/90 mb-1">Recent (30 Days)</h3>
                    <p className="text-3xl font-bold">{summaryStats.recentEntries}</p>
                    <p className="text-xs text-white/70 mt-2">New entries this month</p>
                </div>
            </div>

            {/* Trend Chart - Violations Over Time */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#01411C]/10 p-2 rounded-lg">
                            <TrendingUp className="text-[#01411C]" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800">Violations Trend</h3>
                            <p className="text-sm text-gray-500">Monthly violations over the last 6 months</p>
                        </div>
                    </div>
                </div>
                {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#01411C" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#01411C" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="month" 
                                tick={{fontSize: 12, fill: '#374151'}}
                                stroke="#9ca3af"
                            />
                            <YAxis 
                                tick={{fontSize: 12, fill: '#374151'}}
                                stroke="#9ca3af"
                            />
                            <Tooltip 
                                contentStyle={{
                                    fontSize: '14px', 
                                    padding: '10px', 
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="violations" 
                                stroke="#01411C" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorViolations)" 
                                name="Violations"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="violations" 
                                stroke="#01411C" 
                                strokeWidth={3}
                                dot={{ fill: '#01411C', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-500">Loading trend data...</div>
                )}
            </div>

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
                                    margin={{ top: 20, right: 100, left: 250, bottom: 20 }}
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
                                        cursor={{fill: 'rgba(255, 182, 193, 0.2)'}}
                                    />
                                    <Bar dataKey="violations" radius={[0, 4, 4, 0]} name="Number of Violations">
                                        {gbvData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || '#FFB3BA'} />
                                        ))}
                                    </Bar>
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
                            <ResponsiveContainer width="100%" height={Math.max(450, genderBasedViolationData.length * 18 + 100)}>
                                <BarChart 
                                    data={genderBasedViolationData} 
                                    layout="vertical"
                                    margin={{ top: 20, right: 100, left: 250, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        width={240}
                                        tick={{fontSize: 12, fill: '#374151'}}
                                        interval={0}
                                    />
                                    <Tooltip 
                                        contentStyle={{fontSize: '14px', padding: '10px', borderRadius: '8px'}}
                                        cursor={{fill: 'rgba(221, 160, 221, 0.1)'}}
                                        formatter={(value: number, payload: any) => {
                                            const percentage = payload && payload.payload ? payload.payload.percentage : (payload?.percentage || '0.0');
                                            return [`${value} (${percentage}%)`, 'Violations'];
                                        }}
                                    />
                                    <Bar 
                                        dataKey="violations" 
                                        radius={[0, 4, 4, 0]} 
                                        name="Number of Violations"
                                        label={(props: any) => {
                                            const { x, y, width, height, payload } = props;
                                            if (!payload || width < 30) return null; // Don't show label if bar is too small or payload is missing
                                            const percentage = payload.percentage || '0.0';
                                            return (
                                                <text
                                                    x={x + width + 5}
                                                    y={y + height / 2}
                                                    fill="#374151"
                                                    fontSize={12}
                                                    fontWeight={500}
                                                    textAnchor="start"
                                                    dominantBaseline="middle"
                                                >
                                                    {percentage}%
                                                </text>
                                            );
                                        }}
                                    >
                                        {genderBasedViolationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || '#DDA0DD'} />
                                        ))}
                                    </Bar>
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
                                        cursor={{fill: 'rgba(176, 224, 230, 0.2)'}}
                                    />
                                    <Bar dataKey="violations" fill="#B0E0E6" radius={[4, 4, 0, 0]} name="Number of Violations" />
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
                                                fill="#DDA0DD"
                                                dataKey="value"
                                            >
                                                {monitoringData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || '#DDA0DD'} />
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

