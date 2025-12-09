
import React from 'react';
import { db } from '../../services/mockDb';
import { User } from '../../types';

interface Props {
    user: User;
}

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-700',
        'accepted': 'bg-green-100 text-green-700',
        'needs-modification': 'bg-orange-100 text-orange-700',
        'rejected': 'bg-red-100 text-red-700'
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status.replace('-', ' ').toUpperCase()}
        </span>
    );
};

const SubmissionHistory: React.FC<Props> = ({ user }) => {
    const responses = db.getResponses(user.province);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#01411C]">Submission History</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Response ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Request Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map(res => (
                            <tr key={res.resId} className="hover:bg-gray-50 border-b border-gray-100">
                                <td className="p-4 text-sm text-gray-800 font-medium">{res.resId}</td>
                                <td className="p-4 text-sm text-gray-600">{res.title}</td>
                                <td className="p-4 text-sm text-gray-600">{res.submissionDate}</td>
                                <td className="p-4">{getStatusBadge(res.reviewStatus)}</td>
                                <td className="p-4 text-sm text-gray-500 italic">{res.comments || '-'}</td>
                            </tr>
                        ))}
                        {responses.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No history available</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubmissionHistory;
