
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
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
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

                {/* Mobile Card View */}
                <div className="md:hidden">
                    {tasks.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No history available.</div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {tasks.map(t => {
                                let descPreview = t.responseData;
                                try {
                                    const obj = JSON.parse(t.responseData || '{}');
                                    descPreview = obj.description || 'No description';
                                } catch (e) {}

                                return (
                                    <div key={t.taskId} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-500 mb-1">Task ID</div>
                                                <div className="text-xs font-mono text-gray-500">{t.taskId}</div>
                                            </div>
                                            <button 
                                                onClick={() => handleView(t)}
                                                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-[#01411C] px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-gray-200"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Federal Request</div>
                                            <div className="text-sm font-bold text-gray-700">{t.reqId}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Submitted Date</div>
                                            <div className="text-sm text-green-700 font-medium">{t.submissionDate}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Description Preview</div>
                                            <div className="text-sm text-gray-600 line-clamp-2">{descPreview}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* View Record: full-page responsive detail view instead of overlay */}
            {viewingTask && parsedData && (
                <div className="record-detail">
                    <div className="record-header">
                        <div className="record-title-section">
                            <h1>{linkedRequest?.title || 'Submitted Record'}</h1>
                            <div className="record-meta">
                                <span className="meta-tag">{viewingTask.taskId}</span>
                                <span className="meta-tag">Request: {viewingTask.reqId}</span>
                                <span className="meta-tag">Submitted: {viewingTask.submissionDate}</span>
                            </div>
                        </div>
                        <div className="action-btns" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button className="btn btn-secondary" onClick={() => setViewingTask(null)}>
                                Close
                            </button>
                        </div>
                    </div>

                    <div className="record-content">
                        <div className="content-section">
                            <h3>Request & Mapping Details</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Request ID</div>
                                <div className="detail-value">{viewingTask.reqId}</div>

                                <div className="detail-label">Convention</div>
                                <div className="detail-value">{linkedRequest?.conv || '-'}</div>

                                <div className="detail-label">SDG Goal</div>
                                <div className="detail-value">{parsedData.sdg || '-'}</div>

                                <div className="detail-label">Human Rights Indicator</div>
                                <div className="detail-value">{parsedData.hri || '-'}</div>

                                <div className="detail-label">Relevant Date</div>
                                <div className="detail-value">{linkedRequest?.date || '-'}</div>

                                <div className="detail-label">Accomplishment Date</div>
                                <div className="detail-value">{parsedData.accomplishmentDate || '-'}</div>

                                <div className="detail-label">Status</div>
                                <div className="detail-value">{parsedData.status || 'Submitted'}</div>
                            </div>
                        </div>

                        <div className="content-section">
                            <h3>Description</h3>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{parsedData.description || '-'}</p>
                        </div>

                        <div className="content-section">
                            <h3>Documents & Links</h3>
                            <div className="resources-grid">
                                <div className="resource-link" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span className="resource-icon">📄</span>
                                    <div className="resource-text">
                                        <div className="resource-title">Submitted Attachment</div>
                                        {viewingTask.attachmentUrl ? (
                                            <div className="resource-type" style={{ wordBreak: 'break-all' }}>
                                                {viewingTask.attachmentUrl}
                                            </div>
                                        ) : (
                                            <div className="resource-type">No file uploaded</div>
                                        )}
                                    </div>
                                </div>

                                <div className="resource-link" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span className="resource-icon">🔗</span>
                                    <div className="resource-text">
                                        <div className="resource-title">Links</div>
                                        {parsedData.links && parsedData.links.length > 0 ? (
                                            <ul style={{ paddingLeft: '1rem' }}>
                                                {parsedData.links.map((link: string, idx: number) => (
                                                    <li key={idx} style={{ wordBreak: 'break-all', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                                        {link}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="resource-type">No links added.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentHistory;
