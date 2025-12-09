
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { CONVENTIONS } from '../constants';
import { Download, Printer, PieChart, Filter } from 'lucide-react';

const ReportGenerator: React.FC = () => {
    // Report Configuration State
    const [reportType, setReportType] = useState<'requests' | 'responses'>('requests');
    const [filters, setFilters] = useState({
        province: '',
        status: '',
        convention: '',
        dateFrom: '',
        dateTo: ''
    });
    
    // Result State
    const [generatedData, setGeneratedData] = useState<any[]>([]);
    const [isReportGenerated, setIsReportGenerated] = useState(false);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        
        let data: any[] = [];
        
        // Fetch base data
        if (reportType === 'requests') {
            data = db.getRequests();
        } else {
            data = db.getResponses();
        }

        // Apply Filters
        if (filters.province) {
            data = data.filter(item => (item.prov || item.province) === filters.province);
        }
        if (filters.status) {
            data = data.filter(item => (item.status || item.reviewStatus) === filters.status);
        }
        if (filters.convention) {
            // Note: Responses don't directly store convention, would need join logic in real DB
            // Here assuming simple filter for Requests or filtering by Title for Responses if applicable
            data = data.filter(item => 
                (item.conv === filters.convention) || 
                (item.title && item.title.includes(filters.convention))
            );
        }
        if (filters.dateFrom) {
            data = data.filter(item => 
                new Date(item.date || item.submissionDate) >= new Date(filters.dateFrom)
            );
        }
        if (filters.dateTo) {
            data = data.filter(item => 
                new Date(item.date || item.submissionDate) <= new Date(filters.dateTo)
            );
        }

        setGeneratedData(data);
        setIsReportGenerated(true);
    };

    const handleExport = () => {
        if (!generatedData.length) return;
        
        // Dynamic CSV generation
        const headers = Object.keys(generatedData[0]);
        const csvContent = [
            headers.join(','),
            ...generatedData.map(row => headers.map(fieldName => {
                const val = row[fieldName];
                return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `custom_report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                <PieChart size={28} /> Dynamic Report Generator
            </h1>

            {/* Query Builder Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#01411C]">
                <h3 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
                    <Filter size={20} /> Report Configuration
                </h3>
                <form onSubmit={handleGenerate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="form-field">
                            <label className="text-sm font-medium text-gray-700 mb-1">Data Source</label>
                            <select 
                                value={reportType} 
                                onChange={(e) => { setReportType(e.target.value as 'requests' | 'responses'); setIsReportGenerated(false); }}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            >
                                <option value="requests">Request Data</option>
                                <option value="responses">Response Data</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="text-sm font-medium text-gray-700 mb-1">Province</label>
                            <select 
                                value={filters.province} 
                                onChange={(e) => setFilters({...filters, province: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            >
                                <option value="">All Provinces</option>
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
                            <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select 
                                value={filters.status} 
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            >
                                <option value="">All Statuses</option>
                                {reportType === 'requests' ? (
                                    <>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="overdue">Overdue</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="pending">Pending Review</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="needs-modification">Needs Modification</option>
                                        <option value="rejected">Rejected</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="text-sm font-medium text-gray-700 mb-1">Convention / Keyword</label>
                            <select 
                                value={filters.convention} 
                                onChange={(e) => setFilters({...filters, convention: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            >
                                <option value="">All Conventions</option>
                                {CONVENTIONS.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="text-sm font-medium text-gray-700 mb-1">Date From</label>
                            <input 
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="form-field">
                            <label className="text-sm font-medium text-gray-700 mb-1">Date To</label>
                            <input 
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button type="submit" className="btn btn-primary">
                            Generate Report
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            {isReportGenerated && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-700">Generated Results</h3>
                            <p className="text-sm text-gray-500">{generatedData.length} records found matching criteria.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-secondary" onClick={handleExport}>
                                <Download size={16} /> Export CSV
                            </button>
                            <button className="btn btn-secondary" onClick={() => window.print()}>
                                <Printer size={16} /> Print Report
                            </button>
                        </div>
                    </div>

                    {generatedData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        {/* Dynamic Headers based on data keys */}
                                        {Object.keys(generatedData[0]).slice(0, 6).map(key => (
                                            <th key={key} className="p-3 font-semibold text-gray-600 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {generatedData.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                            {Object.values(item).slice(0, 6).map((val: any, vIdx) => (
                                                <td key={vIdx} className="p-3 text-sm text-gray-700">
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No records found for the selected configuration.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;