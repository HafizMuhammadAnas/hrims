
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, HRRequest, ProvinceResponse, SectorTask } from '../../types';
import { FileText, Send, Paperclip, CheckCircle, Search, AlertCircle, Lock, Unlock } from 'lucide-react';

interface Props {
    user: User;
    onNavigate?: (path: string) => void;
}

const ResponseCompilation: React.FC<Props> = ({ user, onNavigate }) => {
    // Mode: 'search' | 'compile'
    const [mode, setMode] = useState<'search' | 'compile'>('search');
    
    // Search State
    const [searchId, setSearchId] = useState('');
    const [activeReqs, setActiveReqs] = useState<HRRequest[]>([]);
    
    // Selection State
    const [selectedReq, setSelectedReq] = useState<HRRequest | null>(null);
    const [tasks, setTasks] = useState<SectorTask[]>([]);
    
    // Compilation Form State
    const [finalContent, setFinalContent] = useState('');

    useEffect(() => {
        // Load all active requests for datalist
        const reqs = db.getRequests(user.province);
        // Filter out completed ones (already responded to Federal)
        const respondedIds = db.getResponses(user.province).map(r => r.reqId);
        const openReqs = reqs.filter(r => !respondedIds.includes(r.id));
        setActiveReqs(openReqs);
    }, [user]);

    const handleSearchSelect = (reqId: string) => {
        setSearchId(reqId);
        const req = activeReqs.find(r => r.id === reqId);
        if (req) {
            setSelectedReq(req);
            // Load tasks
            const t = db.getSectorTasks(req.id, user.province!);
            setTasks(t);
        } else {
            setSelectedReq(null);
            setTasks([]);
        }
    };

    const handleStartCompilation = () => {
        if (!selectedReq) return;
        // Pre-fill content
        const summary = tasks.map(t => `[${t.sectorName} Report]:\n${t.responseData}`).join('\n\n');
        setFinalContent(summary);
        setMode('compile');
    };

    const handleFinalSubmit = () => {
        if (!selectedReq) return;

        const newResponse: ProvinceResponse = {
            resId: `RES-${Math.floor(Math.random() * 10000)}`,
            reqId: selectedReq.id,
            federalId: selectedReq.federalGroupId || 'FED-GEN',
            province: user.province!,
            title: `${selectedReq.title} - ${user.province} Consolidated Report`,
            submissionDate: new Date().toISOString().split('T')[0],
            reviewStatus: 'pending',
            comments: '',
            content: finalContent
        };
        db.addResponse(newResponse);
        alert('Consolidated response submitted to Federal Ministry successfully!');
        
        // Reset and Navigate
        setMode('search');
        setSelectedReq(null);
        setSearchId('');
        if (onNavigate) onNavigate('/province-history');
    };

    // Derived Stats
    const totalSectors = tasks.length;
    const submittedCount = tasks.filter(t => t.status === 'submitted').length;
    const pendingCount = totalSectors - submittedCount;
    const isReady = totalSectors > 0 && pendingCount === 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-[#01411C]">Response Compilation</h2>
                    <p className="text-gray-500 text-sm">Consolidate sector data and submit final report to Federal.</p>
                </div>
            </div>

            {mode === 'search' && (
                <>
                    {/* Search Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Request ID to Compile</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                list="reqIds"
                                value={searchId}
                                onChange={(e) => handleSearchSelect(e.target.value)}
                                placeholder="Search or Select Request ID..." 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01411C] shadow-sm"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <datalist id="reqIds">
                                {activeReqs.map(r => (
                                    <option key={r.id} value={r.id}>{r.title}</option>
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Stats Dashboard (Only if request selected) */}
                    {selectedReq && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                            {/* Request Info */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-blue-900">{selectedReq.title}</h3>
                                    <p className="text-blue-700 text-sm">Due Date: {selectedReq.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-blue-600 uppercase font-bold tracking-wide">Status</span>
                                    <div className="font-medium text-blue-800">{isReady ? 'Ready for Compilation' : 'Pending Sectors'}</div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <div className="text-gray-500 text-sm font-medium">Total Sectors</div>
                                    <div className="text-3xl font-bold text-gray-800 mt-1">{totalSectors}</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 bg-green-50/50">
                                    <div className="text-green-600 text-sm font-medium">Delivered Data</div>
                                    <div className="text-3xl font-bold text-green-700 mt-1">{submittedCount}</div>
                                </div>
                                <div className={`bg-white p-5 rounded-xl shadow-sm border ${pendingCount > 0 ? 'border-red-100 bg-red-50/50' : 'border-gray-100'}`}>
                                    <div className={`${pendingCount > 0 ? 'text-red-600' : 'text-gray-500'} text-sm font-medium`}>Pending</div>
                                    <div className={`text-3xl font-bold mt-1 ${pendingCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>{pendingCount}</div>
                                </div>
                            </div>

                            {/* Sector List */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">Sector Status Details</div>
                                <table className="w-full text-left">
                                    <tbody>
                                        {tasks.length > 0 ? tasks.map(t => (
                                            <tr key={t.taskId} className="border-b border-gray-100 last:border-0">
                                                <td className="p-4">{t.sectorName}</td>
                                                <td className="p-4 text-right">
                                                    {t.status === 'submitted' ? (
                                                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                                            <CheckCircle size={16} /> Data Received
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-orange-500 text-sm font-medium">
                                                            <AlertCircle size={16} /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td className="p-6 text-center text-gray-500">No sectors assigned yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Action Area */}
                            <div className="flex justify-end pt-4">
                                <button 
                                    onClick={handleStartCompilation}
                                    disabled={!isReady}
                                    className={`btn flex items-center gap-2 ${isReady ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {isReady ? <Unlock size={18} /> : <Lock size={18} />}
                                    {isReady ? 'Proceed to Compilation' : 'Waiting for All Sectors'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {mode === 'compile' && selectedReq && (
                <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#01411C] animate-in fade-in slide-in-from-right-8">
                    <div className="mb-6 flex justify-between">
                        <h2 className="text-xl font-bold text-[#01411C] flex items-center gap-2">
                            <FileText size={20} /> Final Compilation: {selectedReq.title}
                        </h2>
                        <button onClick={() => setMode('search')} className="text-gray-500 hover:text-gray-800">
                            Cancel
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="form-field">
                            <label className="text-sm font-medium text-gray-700 mb-1">Consolidated Response Content</label>
                            <textarea 
                                value={finalContent}
                                onChange={(e) => setFinalContent(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#01411C] min-h-[300px] font-mono text-sm leading-relaxed"
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-2">
                                * This content has been auto-populated from submitted sector reports. Please review and edit before final submission.
                            </p>
                        </div>

                        <div className="form-field">
                            <label className="text-sm font-medium text-gray-700 mb-1">Attachments</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <Paperclip className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-500">Attach consolidated PDF/Excel files</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button onClick={handleFinalSubmit} className="btn btn-primary">
                                <Send size={18} /> Submit Final Response to Federal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponseCompilation;
