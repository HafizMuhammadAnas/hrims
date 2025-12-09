
import React from 'react';
import { db } from '../../services/mockDb';
import { User } from '../../types';
import { History, FileText, CheckCircle, Clock } from 'lucide-react';

interface Props {
    user: User;
}

const SectorHistory: React.FC<Props> = ({ user }) => {
    const tasks = user.province && user.sectorId 
        ? db.getTasksForSector(user.province, user.sectorId).filter(t => t.status === 'submitted') 
        : [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                    <History /> Submission History
                </h2>
                <p className="text-gray-500 text-sm">Archives of all completed tasks for {user.sectorName}.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Task ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Federal Request</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Assigned</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Submitted</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Response Summary</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Attachment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(t => (
                            <tr key={t.taskId} className="hover:bg-gray-50 border-b border-gray-100">
                                <td className="p-4 font-mono text-xs text-gray-500">{t.taskId}</td>
                                <td className="p-4 text-sm font-bold text-gray-700">{t.reqId}</td>
                                <td className="p-4 text-sm text-gray-600">{t.assignedDate}</td>
                                <td className="p-4 text-sm text-green-700 font-medium">{t.submissionDate}</td>
                                <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={t.responseData}>
                                    {t.responseData}
                                </td>
                                <td className="p-4 text-sm">
                                    {t.attachmentUrl ? (
                                        <a href="#" className="text-blue-600 hover:underline">View File</a>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No history available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SectorHistory;