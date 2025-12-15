
import React, { useState } from 'react';
import { db } from '../../services/mockDb';
import { User, DepartmentTask, HRRequest } from '../../types';
import { History, Eye, X, Calendar, Link as LinkIcon, FileText } from 'lucide-react';

interface Props {
    user: User;
}

const DepartmentHistory: React.FC<Props> = ({ user }) => {
    const tasks = user.province && user.departmentId 
        ? db.getTasksForDepartment(user.province, user.departmentId).filter(t => t.status === 'submitted') 
        : [];

    const [viewingTask, setViewingTask] = useState<DepartmentTask | null>(null);
    const [parsedData, setParsedData] = useState<any>(null);
    const [linkedRequest, setLinkedRequest] = useState<HRRequest | null>(null);

    const handleView = (task: DepartmentTask) => {
        const req = db.getRequestById(task.reqId);
        setLinkedRequest(req || null);
        setViewingTask(task);

        // Try to parse JSON data if it exists, otherwise use plain text for description
        try {
            const data = JSON.parse(task.responseData || '{}');
            setParsedData(data);
        } catch (e) {
            // Fallback for old simple string data
            setParsedData({
                description: task.responseData,
                status: 'Completed',
                links: []
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                    <History /> Submission History
                </h2>
                <p className="text-gray-500 text-sm">Archives of all completed tasks for {user.departmentName}.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Task ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Federal Request</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Submitted Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Description Preview</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(t => {
                            let descPreview = t.responseData;
                            try {
                                const obj = JSON.parse(t.responseData || '{}');
                                descPreview = obj.description || 'No description';
                            } catch (e) {}

                            return (
                                <tr key={t.taskId} className="hover:bg-gray-50 border-b border-gray-100">
                                    <td className="p-4 font-mono text-xs text-gray-500">{t.taskId}</td>
                                    <td className="p-4 text-sm font-bold text-gray-700">{t.reqId}</td>
                                    <td className="p-4 text-sm text-green-700 font-medium">{t.submissionDate}</td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                        {descPreview}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleView(t)}
                                            className="inline-flex items-center gap-1 bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-[#01411C] px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-gray-200"
                                        >
                                            <Eye size={14} /> View Record
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No history available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {viewingTask && parsedData && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl my-8">
                         {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-[#01411C]">Submitted Record</h2>
                                <p className="text-gray-500 text-xs mt-1">View Only - Task: {viewingTask.taskId}</p>
                            </div>
                            <button onClick={() => setViewingTask(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Row 1: Request Info */}
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Request No</label>
                                    <div className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{viewingTask.reqId}</div>
                                </div>
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Title</label>
                                    <div className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{linkedRequest?.title || '-'}</div>
                                </div>

                                {/* Row 2 */}
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Convention</label>
                                    <div className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{linkedRequest?.conv || '-'}</div>
                                </div>
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Recommendation</label>
                                    <div className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-gray-800">{parsedData.recommendation || '-'}</div>
                                </div>

                                {/* Row 3 */}
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Thematic Area</label>
                                    <div className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-gray-800">{parsedData.thematicArea || '-'}</div>
                                </div>
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">UPR Recommendation</label>
                                    <div className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-gray-800">{parsedData.upr || '-'}</div>
                                </div>

                                {/* Row 4 */}
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">SDG Goal</label>
                                    <div className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-gray-800">{parsedData.sdg || '-'}</div>
                                </div>
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Human Rights Indicator</label>
                                    <div className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-gray-800">{parsedData.hri || '-'}</div>
                                </div>

                                {/* Row 5 */}
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Relevant Date</label>
                                    <div className="relative">
                                        <div className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-800">{linkedRequest?.date || '-'}</div>
                                        <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Accomplishment Date</label>
                                    <div className="relative">
                                        <div className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-gray-800">{parsedData.accomplishmentDate || '-'}</div>
                                        <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {/* Row 6: Status */}
                                <div className="form-field md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Status</label>
                                    <div className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-gray-800 font-medium">{parsedData.status || 'Submitted'}</div>
                                </div>

                                {/* Row 7: Description */}
                                <div className="form-field md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Description</label>
                                    <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-md min-h-[100px] text-sm text-gray-800 whitespace-pre-wrap">
                                        {parsedData.description}
                                    </div>
                                </div>

                                {/* Row 8: Documents */}
                                <div className="form-field md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Documents</label>
                                    <div className="border border-gray-200 rounded-lg p-4 bg-white flex items-center gap-3">
                                        <div className="bg-gray-100 p-2 rounded">
                                            <FileText className="text-gray-500" size={24} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 block">Submitted Attachment</span>
                                            {viewingTask.attachmentUrl ? (
                                                <a href="#" className="text-xs text-blue-600 hover:underline">Download / View File</a>
                                            ) : (
                                                <span className="text-xs text-gray-400">No file uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Row 9: Links */}
                                <div className="form-field md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">Links</label>
                                    {parsedData.links && parsedData.links.length > 0 ? (
                                        <ul className="space-y-2">
                                            {parsedData.links.map((link: string, idx: number) => (
                                                <li key={idx} className="flex items-center bg-gray-50 p-2 rounded border border-gray-200">
                                                    <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm truncate flex items-center gap-2">
                                                        <LinkIcon size={14} /> {link}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">No links added.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button onClick={() => setViewingTask(null)} className="btn btn-primary px-6">
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentHistory;
