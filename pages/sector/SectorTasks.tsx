
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, SectorTask, HRRequest } from '../../types';
import { ClipboardList, Clock, CheckCircle, Upload, Send, FileText, Link as LinkIcon } from 'lucide-react';

interface Props {
    user: User;
}

const SectorTasks: React.FC<Props> = ({ user }) => {
    const [tasks, setTasks] = useState<SectorTask[]>([]);
    const [selectedTask, setSelectedTask] = useState<SectorTask | null>(null);
    const [linkedRequest, setLinkedRequest] = useState<HRRequest | null>(null);
    
    // Response Form
    const [responseData, setResponseData] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');

    useEffect(() => {
        if (user.province && user.sectorId) {
            const t = db.getTasksForSector(user.province, user.sectorId);
            setTasks(t);
        }
    }, [user]);

    const handleSelectTask = (task: SectorTask) => {
        setSelectedTask(task);
        const req = db.getRequestById(task.reqId);
        setLinkedRequest(req || null);
        setResponseData(task.responseData || '');
        setAttachmentUrl(task.attachmentUrl || '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;

        db.submitSectorTask(selectedTask.taskId, responseData, attachmentUrl);
        alert('Task submitted successfully to Provincial Admin.');
        
        // Refresh
        const t = db.getTasksForSector(user.province!, user.sectorId!);
        setTasks(t);
        setSelectedTask(null);
    };

    const pendingTasks = tasks.filter(t => t.status === 'assigned');
    const completedTasks = tasks.filter(t => t.status === 'submitted');

    return (
        <div className="space-y-6">
            {!selectedTask ? (
                <>
                    <div>
                        <h2 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                            <ClipboardList /> Assigned Tasks
                        </h2>
                        <p className="text-gray-500 text-sm">Manage data collection requests from your Provincial Department.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <Clock size={18} className="text-yellow-600" /> Pending Action ({pendingTasks.length})
                            </h3>
                            {pendingTasks.length === 0 && <p className="text-sm text-gray-400 italic">No pending tasks.</p>}
                            {pendingTasks.map(task => (
                                <div 
                                    key={task.taskId} 
                                    onClick={() => handleSelectTask(task)}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-gray-400">{task.taskId}</span>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Pending</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">Request ID: {task.reqId}</h4>
                                    <p className="text-xs text-gray-500">Assigned: {task.assignedDate}</p>
                                    <div className="mt-3 text-sm text-blue-600 font-medium">Click to Respond &rarr;</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <CheckCircle size={18} className="text-green-600" /> Submitted ({completedTasks.length})
                            </h3>
                            {completedTasks.length === 0 && <p className="text-sm text-gray-400 italic">No submitted tasks yet.</p>}
                            {completedTasks.map(task => (
                                <div 
                                    key={task.taskId}
                                    onClick={() => handleSelectTask(task)}
                                    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-l-4 border-l-green-500 opacity-80 hover:opacity-100 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-gray-400">{task.taskId}</span>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Submitted</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">Request ID: {task.reqId}</h4>
                                    <p className="text-xs text-gray-500">Submitted: {task.submissionDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#01411C] animate-in slide-in-from-right-4 fade-in">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Task Response: {selectedTask.taskId}</h2>
                            <p className="text-gray-500 text-sm">Responding to Request: <span className="font-bold text-gray-700">{selectedTask.reqId}</span></p>
                        </div>
                        <button onClick={() => setSelectedTask(null)} className="text-sm text-gray-500 hover:text-gray-800 underline">
                            Cancel
                        </button>
                    </div>

                    {linkedRequest && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                            <h3 className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2"><FileText size={16}/> Request Details</h3>
                            <p className="text-blue-900 font-medium mb-1">{linkedRequest.title}</p>
                            <p className="text-sm text-blue-700">{linkedRequest.details || "No additional details provided."}</p>
                            <div className="mt-2 text-xs text-blue-600">
                                Convention: {linkedRequest.conv} | Due: {linkedRequest.date}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Response Data / Report Content</label>
                            <textarea 
                                required
                                value={responseData}
                                onChange={e => setResponseData(e.target.value)}
                                disabled={selectedTask.status === 'submitted'}
                                className="w-full p-4 border border-gray-300 rounded-lg min-h-[200px] focus:outline-none focus:border-[#01411C]"
                                placeholder="Enter your detailed response here..."
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments / URL</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400"/>
                                    <input 
                                        type="text" 
                                        value={attachmentUrl}
                                        onChange={e => setAttachmentUrl(e.target.value)}
                                        disabled={selectedTask.status === 'submitted'}
                                        placeholder="Paste URL to file (Google Drive, Dropbox, etc)"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <button type="button" disabled={selectedTask.status === 'submitted'} className="btn btn-secondary px-4">
                                    <Upload size={16} /> Upload
                                </button>
                            </div>
                        </div>

                        {selectedTask.status !== 'submitted' ? (
                            <div className="flex justify-end pt-4 border-t">
                                <button type="submit" className="btn btn-primary">
                                    <Send size={16} /> Submit Response
                                </button>
                            </div>
                        ) : (
                            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center font-medium border border-green-200">
                                <CheckCircle size={20} className="inline mr-2" />
                                This task was submitted on {selectedTask.submissionDate}
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};

export default SectorTasks;