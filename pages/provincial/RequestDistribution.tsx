
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, HRRequest } from '../../types';
import { DEPARTMENTS } from '../../constants';
import { Search, FileText, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';

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
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Assigning: {selectedRequest.title}</h2>
                            <p className="text-gray-600">{selectedRequest.details || "Please gather relevant data from departments."}</p>
                        </div>
                        <button onClick={() => setSelectedRequest(null)} className="text-sm text-gray-500 hover:text-gray-800 underline">
                            Cancel
                        </button>
                    </div>

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
            )}
        </div>
    );
};

export default RequestDistribution;
