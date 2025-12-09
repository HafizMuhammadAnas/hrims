
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, HRRequest } from '../../types';
import { Eye, ArrowRight, CheckCircle, Activity, FileText, X } from 'lucide-react';

interface Props {
    user: User;
    onNavigate: (path: string) => void;
}

type CustomStatus = 'Untouch' | 'Distributed' | 'In Process' | 'Response Delivered';

const ReceivedRequests: React.FC<Props> = ({ user, onNavigate }) => {
    const [requests, setRequests] = useState<HRRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<HRRequest | null>(null);

    useEffect(() => {
        // Fetch all requests targeting this province
        const data = db.getRequests(user.province);
        setRequests(data);
    }, [user]);

    // Helper to calculate the specific status requested
    const getCustomStatus = (req: HRRequest): CustomStatus => {
        const tasks = db.getSectorTasks(req.id, user.province!);
        const response = db.getResponses(user.province).find(r => r.reqId === req.id);

        if (response) return 'Response Delivered';
        
        if (tasks.length > 0) {
            // Check if any task has been submitted
            const anySubmitted = tasks.some(t => t.status === 'submitted');
            return anySubmitted ? 'In Process' : 'Distributed';
        }

        return 'Untouch';
    };

    const getStatusBadge = (status: CustomStatus) => {
        switch (status) {
            case 'Untouch':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Untouch</span>;
            case 'Distributed':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">Distributed</span>;
            case 'In Process':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">In Process</span>;
            case 'Response Delivered':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">Response Delivered</span>;
        }
    };

    const handleAction = (status: CustomStatus, req: HRRequest) => {
        switch (status) {
            case 'Untouch':
                // Proceed for distribution
                onNavigate('/province-distribution');
                break;
            case 'Distributed':
            case 'In Process':
                // View Progress
                onNavigate('/province-monitoring');
                break;
            case 'Response Delivered':
                // View History
                onNavigate('/province-history');
                break;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#01411C]">Received Requests</h2>
                <p className="text-gray-500 text-sm">Master list of all federal requests received by the province.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Request ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Convention</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Received Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => {
                            const status = getCustomStatus(req);
                            return (
                                <tr key={req.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <td className="p-4 font-mono text-xs text-gray-500">{req.id}</td>
                                    <td className="p-4 text-sm text-gray-800 font-medium">{req.title}</td>
                                    <td className="p-4 text-sm text-gray-600">{req.conv}</td>
                                    <td className="p-4 text-sm text-gray-600">{req.date}</td>
                                    <td className="p-4">{getStatusBadge(status)}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => setSelectedRequest(req)}
                                                className="p-2 text-gray-500 hover:text-[#01411C] hover:bg-green-50 rounded-lg transition-colors"
                                                title="View Request Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            
                                            {status === 'Untouch' && (
                                                <button 
                                                    onClick={() => handleAction(status, req)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#01411C] hover:bg-[#0A5F2C] rounded-lg transition-colors"
                                                    title="Proceed for Distribution"
                                                >
                                                    <span>Distribute</span> <ArrowRight size={14} />
                                                </button>
                                            )}
                                            
                                            {(status === 'Distributed' || status === 'In Process') && (
                                                <button 
                                                    onClick={() => handleAction(status, req)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#01411C] bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                                                    title="Monitor Progress"
                                                >
                                                    <Activity size={14} /> <span>Monitor</span>
                                                </button>
                                            )}

                                            {status === 'Response Delivered' && (
                                                <button 
                                                    onClick={() => handleAction(status, req)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors"
                                                    title="View Submitted Response"
                                                >
                                                    <FileText size={14} /> <span>History</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {requests.length === 0 && (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Request Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-[#01411C]">{selectedRequest.title}</h3>
                                <p className="text-sm text-gray-500">ID: {selectedRequest.id}</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Convention</div>
                                    <div className="font-medium text-gray-800">{selectedRequest.conv}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase">Due Date</div>
                                    <div className="font-medium text-gray-800">{selectedRequest.date}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                                    <div className="text-xs text-gray-500 uppercase">Status</div>
                                    <div className="mt-1">{getStatusBadge(getCustomStatus(selectedRequest))}</div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">Details / Instructions</h4>
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 leading-relaxed">
                                    {selectedRequest.details || "No specific details provided. Please refer to standard reporting guidelines for this convention."}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button onClick={() => setSelectedRequest(null)} className="btn btn-secondary">
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceivedRequests;
