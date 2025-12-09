
import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Mock Data
const dataConventions = [
    { name: 'ICERD', records: 45, compliance: 72 },
    { name: 'ICCPR', records: 38, compliance: 68 },
    { name: 'ICESCR', records: 31, compliance: 55 },
    { name: 'CEDAW', records: 52, compliance: 65 },
    { name: 'CAT', records: 28, compliance: 58 },
    { name: 'CRC', records: 41, compliance: 61 },
    { name: 'CRPD', records: 35, compliance: 52 },
];

const dataStatus = [
    { name: 'Ongoing', value: 112 },
    { name: 'Accomplished', value: 158 },
];

const dataTimeline = [
    { name: 'Jan', requests: 12, completed: 8 },
    { name: 'Feb', requests: 19, completed: 12 },
    { name: 'Mar', requests: 15, completed: 10 },
    { name: 'Apr', requests: 25, completed: 18 },
    { name: 'May', requests: 22, completed: 15 },
    { name: 'Jun', requests: 30, completed: 22 },
    { name: 'Jul', requests: 28, completed: 25 },
    { name: 'Aug', requests: 35, completed: 28 },
    { name: 'Sep', requests: 31, completed: 26 },
    { name: 'Oct', requests: 38, completed: 30 },
    { name: 'Nov', requests: 42, completed: 35 },
    { name: 'Dec', requests: 45, completed: 40 },
];

const dataProvinces = [
    { name: 'Punjab', value: 85 },
    { name: 'Sindh', value: 62 },
    { name: 'KPK', value: 45 },
    { name: 'Balochistan', value: 28 },
    { name: 'Islamabad', value: 19 },
    { name: 'GB', value: 15 },
    { name: 'AJK', value: 16 },
];

const dataSDGs = [
    { subject: 'No Poverty', A: 120, fullMark: 150 },
    { subject: 'Health', A: 98, fullMark: 150 },
    { subject: 'Education', A: 86, fullMark: 150 },
    { subject: 'Gender Eq', A: 99, fullMark: 150 },
    { subject: 'Work', A: 85, fullMark: 150 },
    { subject: 'Inequality', A: 65, fullMark: 150 },
];

const COLORS = ['#FFC107', '#4CAF50', '#2196F3', '#FF5722', '#9C27B0', '#00BCD4', '#795548'];
const STATUS_COLORS = ['#FFB300', '#4CAF50'];

const Analysis: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#01411C]">Data Analytics & Performance</h1>

            {/* Row 1: Timeline & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Line Chart: Monthly Progress */}
                <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2 h-96 card">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Monthly Progress Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataTimeline}>
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
                            <Area type="monotone" dataKey="requests" stroke="#1E88E5" fillOpacity={1} fill="url(#colorReq)" />
                            <Area type="monotone" dataKey="completed" stroke="#4CAF50" fillOpacity={1} fill="url(#colorComp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart: Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-96 card">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Overall Status</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2: Conventions & Provinces */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart: Conventions */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-96 card">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Records by Convention</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataConventions} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={60} />
                            <Tooltip />
                            <Bar dataKey="records" fill="#01411C" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Donut Chart: Provincial Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-96 card">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Provincial Activity Volume</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataProvinces}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {dataProvinces.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 3: SDG Radar & Detailed Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Radar Chart: SDGs */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-96 card">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">SDG Alignment</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataSDGs}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar name="SDG Compliance" dataKey="A" stroke="#00ACC1" fill="#00ACC1" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Detailed Metrics Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2 card">
                    <div className="p-6 border-b">
                         <h3 className="text-lg font-bold text-gray-700">Detailed Implementation Metrics</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#1E88E5] text-white">
                                <tr>
                                    <th className="p-4">Convention</th>
                                    <th className="p-4">Total Records</th>
                                    <th className="p-4">Compliance Score</th>
                                    <th className="p-4">Ongoing</th>
                                    <th className="p-4">Accomplished</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataConventions.map((row, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{row.name}</td>
                                        <td className="p-4">{row.records}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${row.compliance}%`}}></div>
                                                </div>
                                                <span className="text-xs">{row.compliance}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-yellow-600 font-bold">{Math.floor(row.records * 0.4)}</td>
                                        <td className="p-4 text-green-600 font-bold">{Math.floor(row.records * 0.6)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
