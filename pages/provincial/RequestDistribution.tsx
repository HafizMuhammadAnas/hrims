
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, HRRequest } from '../../types';
import { DEPARTMENTS, CONVENTIONS } from '../../constants';
import { HRIMS_CATEGORIES } from '../../hrimsCategories';
import { Search, FileText, Clock, Users, ArrowRight, CheckCircle, Calendar, Tag } from 'lucide-react';

interface Props {
    user: User;
    onNavigate?: (path: string) => void;
    nextPath?: string;
}

const RequestDistribution: React.FC<Props> = ({ 
    user, 
    onNavigate,
    nextPath = '/province-monitoring'
}) => {
    const [requests, setRequests] = useState<HRRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<HRRequest | null>(null);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // Filter requests that DO NOT have department tasks yet and DO NOT have a response
        const allReqs = db.getRequests(user.province);
        const newReqs = allReqs.filter(req => {
            const tasks = db.getDepartmentTasks(req.id, user.province!);
            const response = db.getResponses(user.province).find(r => r.reqId === req.id);
            return tasks.length === 0 && !response;
        });
        setRequests(newReqs);
    }, [user]);

    const handleAssign = () => {
        if (!selectedRequest) return;
        if (selectedDepartments.length === 0) return alert('Please select at least one department.');

        selectedDepartments.forEach(deptId => {
            const dept = DEPARTMENTS.find(s => s.id === deptId);
            db.assignDepartmentTask({
                taskId: `TSK-${Math.floor(Math.random() * 10000)}`,
                reqId: selectedRequest.id,
                province: user.province!,
                departmentId: deptId,
                departmentName: dept?.name || 'Unknown',
                status: 'assigned',
                assignedDate: new Date().toISOString().split('T')[0]
            });
        });

        // Update request status to in-progress to signal Federal admin
        db.updateRequest(selectedRequest.id, { status: 'in-progress' });

        alert(`Request distributed to ${selectedDepartments.length} departments.`);
        
        // Refresh list
        const allReqs = db.getRequests(user.province);
        const newReqs = allReqs.filter(req => {
            const tasks = db.getDepartmentTasks(req.id, user.province!);
            const response = db.getResponses(user.province).find(r => r.reqId === req.id);
            return tasks.length === 0 && !response;
        });
        setRequests(newReqs);
        setSelectedRequest(null);
        setSelectedDepartments([]);
        
        if (onNavigate) onNavigate(nextPath);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-[#01411C]">{user.province === 'Federal' ? 'Federal Department Distribution' : 'Request Distribution'}</h2>
                    <p className="text-gray-500 text-sm">Step 1: Assign requests to relevant {user.province === 'Federal' ? 'Federal Ministries/Departments' : 'provincial departments'}.</p>
                </div>
                {!selectedRequest && (
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search requests..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01411C] w-64"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                )}
            </div>

            {!selectedRequest ? (
                <div className="grid grid-cols-1 gap-4">
                    {requests.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300 text-gray-500">
                            <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                            <p>All pending requests have been distributed.</p>
                        </div>
                    ) : (
                        requests
                            .filter(r => r.title.toLowerCase().includes(searchText.toLowerCase()))
                            .map(req => (
                            <div key={req.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">{req.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                ID: {req.id} • Convention: <span className="font-medium text-gray-700">{req.conv}</span>
                                            </p>
                                            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm border text-gray-600 bg-gray-50">
                                                <Clock size={14} /> Due: {req.date}
                                            </div>
                                            {req.status === 'in-progress' && (
                                                <div className="mt-1 text-xs text-blue-600">Currently in progress</div>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedRequest(req)}
                                        className="btn btn-primary"
                                    >
                                        Select for Assignment
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#01411C] mb-2">Request Details</h2>
                            <p className="text-sm text-gray-500">Review the complete request information before assigning to departments</p>
                        </div>
                        <button 
                            onClick={() => setSelectedRequest(null)} 
                            className="text-sm text-gray-500 hover:text-gray-800 underline flex-shrink-0"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Request Details Section */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Request ID */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Request ID</label>
                                <div className="text-sm font-mono text-gray-800 bg-white p-2 rounded border border-gray-200">{selectedRequest.id}</div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Title / عنوان</label>
                                <div className="text-sm font-semibold text-gray-800 bg-white p-2 rounded border border-gray-200">{selectedRequest.title}</div>
                            </div>

                            {/* Convention */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Convention</label>
                                <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                    {selectedRequest.conv}
                                    {CONVENTIONS.find(c => c.title === selectedRequest.conv) && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({CONVENTIONS.find(c => c.title === selectedRequest.conv)?.fullName.substring(0, 50)}...)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Province */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Province / صوبہ</label>
                                <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">{selectedRequest.prov}</div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Due Date</label>
                                <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200 flex items-center gap-2">
                                    <Calendar size={14} className="text-gray-400" />
                                    {selectedRequest.date}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Status</label>
                                <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                        selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        selectedRequest.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                        selectedRequest.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedRequest.status.toUpperCase().replace('-', ' ')}
                                    </span>
                                </div>
                            </div>

                            {/* HRIMS Category */}
                            {selectedRequest.categoryId && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Category / زمرہ</label>
                                    <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                        {HRIMS_CATEGORIES.find(c => c.id === selectedRequest.categoryId)?.name || selectedRequest.categoryId}
                                    </div>
                                </div>
                            )}

                            {/* HRIMS Subcategory */}
                            {selectedRequest.subcategoryId && selectedRequest.categoryId && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Subcategory / ذیلی زمرہ</label>
                                    <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                        {HRIMS_CATEGORIES.find(c => c.id === selectedRequest.categoryId)
                                            ?.subcategories.find(s => s.id === selectedRequest.subcategoryId)?.name || selectedRequest.subcategoryId}
                                    </div>
                                </div>
                            )}

                            {/* HRIMS Indicator */}
                            {selectedRequest.indicatorId && selectedRequest.subcategoryId && selectedRequest.categoryId && (
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Indicator / اشارہ</label>
                                    <div className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                        {HRIMS_CATEGORIES.find(c => c.id === selectedRequest.categoryId)
                                            ?.subcategories.find(s => s.id === selectedRequest.subcategoryId)
                                            ?.indicators.find(i => i.id === selectedRequest.indicatorId)?.text || selectedRequest.indicatorId}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details/Description */}
                        {selectedRequest.details && (
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Request Details / تفصیلات</label>
                                <div className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap">
                                    {selectedRequest.details}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Department Selection Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-[#01411C] mb-4 flex items-center gap-2">
                            <Users size={18} /> Select Target Departments
                        </h3>
                    
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {DEPARTMENTS.map(sec => (
                                <label key={sec.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedDepartments.includes(sec.id) ? 'border-[#01411C] bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedDepartments.includes(sec.id)}
                                        onChange={(e) => {
                                            if(e.target.checked) setSelectedDepartments([...selectedDepartments, sec.id]);
                                            else setSelectedDepartments(selectedDepartments.filter(id => id !== sec.id));
                                        }}
                                        className="w-5 h-5 accent-[#01411C] mr-3"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-800 block">{sec.name}</span>
                                        <span className="text-xs text-gray-500 uppercase">{sec.type}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setSelectedRequest(null)} className="btn btn-secondary">
                                Back
                            </button>
                            <button onClick={handleAssign} className="btn btn-primary" disabled={selectedDepartments.length === 0}>
                                Distribute Request <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestDistribution;
