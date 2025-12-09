
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, HRRequest, SectorTask } from '../../types';
import { Clock, CheckCircle, PlayCircle, Eye, Search, Filter, X, FileText, AlertCircle } from 'lucide-react';

interface Props {
    user: User;
    onNavigate?: (path: string) => void;
}

const SectorMonitoring: React.FC<Props> = ({ user, onNavigate }) => {
    // State
    const [allTasks, setAllTasks] = useState<SectorTask[]>([]);
    const [uniqueRequests, setUniqueRequests] = useState<HRRequest[]>([]);
    const [selectedReqId, setSelectedReqId] = useState<string>('');
    const [viewingTask, setViewingTask] = useState<SectorTask | null>(null);

    // Refresh Data
    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = () => {
        if (!user.province) return;

        // Get all requests for the province
        const allReqs = db.getRequests(user.province);
        
        // Find requests that have tasks assigned
        const activeRequests: HRRequest[] = [];
        let tasks: SectorTask[] = [];

        allReqs.forEach(req => {
            const t = db.getSectorTasks(req.id, user.province!);
            if (t.length > 0) {
                activeRequests.push(req);
                tasks = [...tasks, ...t];
            }
        });

        setUniqueRequests(activeRequests);
        setAllTasks(tasks);
    };

    const handleSimulate = (taskId: string) => {
        // Find the task and simulate submission
        const task = allTasks.find(t => t.taskId === taskId);
        if (task) {
            db.submitSectorTask(
                taskId, 
                `Simulated response data for ${task.sectorName}. Compliance targets met.`, 
                'http://simulated-doc-url.com'
            );
            loadData(); // Refresh UI
        }
    };

    // Filter Logic
    const filteredTasks = selectedReqId 
        ? allTasks.filter(t => t.reqId === selectedReqId)
        : allTasks;

    const getRowColor = (status: string) => {
        return status === 'submitted' ? 'bg-green-50' : 'bg-white';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-[#01411C]">Sector Monitoring</h2>
                    <p className="text-gray-500 text-sm">Track progress and view responses from assigned sectors.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Filter size={18} /> Filter by Request:
                </div>
                <select 
                    value={selectedReqId}
                    onChange={(e) => setSelectedReqId(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01411C] min-w-[300px]"
                >
                    <option value="">All Active Requests</option>
                    {uniqueRequests.map(r => (
                        <option key={r.id} value={r.id}>{r.id} - {r.title}</option>
                    ))}
                </select>
                {selectedReqId && (
                    <button 
                        onClick={() => setSelectedReqId('')}
                        className="text-sm text-red-600 hover:text-red-800"
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Request ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Sector Name</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Assigned Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <tr key={task.taskId} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${getRowColor(task.status)}`}>
                                    <td className="p-4 text-xs font-mono text-gray-500">{task.reqId}</td>
                                    <td className="p-4 font-medium text-gray-800">{task.sectorName}</td>
                                    <td className="p-4 text-sm text-gray-600">{task.assignedDate}</td>
                                    <td className="p-4">
                                        {task.status === 'submitted' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle size={12} /> Submitted
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                <Clock size={12} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {task.status === 'submitted' ? (
                                            <button 
                                                onClick={() => setViewingTask(task)}
                                                className="btn btn-secondary py-1 px-3 text-xs flex items-center gap-1 mx-auto bg-white border border-gray-300"
                                                title="View Response Content"
                                            >
                                                <Eye size={14} /> View Response
                                            </button>
                                        ) : (
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleSimulate(task.taskId)}
                                                    className="text-blue-600 hover:bg-blue-50 p-2 rounded text-xs flex items-center gap-1"
                                                    title="Simulate Submission (Demo)"
                                                >
                                                    <PlayCircle size={14} /> Simulate
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-500">
                                    No active monitoring tasks found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Response Modal */}
            {viewingTask && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-[#01411C]">Sector Response</h3>
                                <p className="text-sm text-gray-500">{viewingTask.sectorName}</p>
                            </div>
                            <button onClick={() => setViewingTask(null)} className="text-gray-400 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <div className="text-xs text-green-700 font-bold uppercase mb-1">Submitted Content</div>
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    {viewingTask.responseData}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500 text-xs">Submission Date</span>
                                    <span className="font-medium">{viewingTask.submissionDate}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">Attachment</span>
                                    {viewingTask.attachmentUrl ? (
                                        <a href="#" className="text-blue-600 hover:underline truncate block">View Document</a>
                                    ) : (
                                        <span className="text-gray-400">None</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button onClick={() => setViewingTask(null)} className="btn btn-secondary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectorMonitoring;
