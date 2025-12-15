
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, DepartmentTask, HRRequest } from '../../types';
import { CONVENTIONS, SDGS, INDICATORS } from '../../constants';
import { ClipboardList, Clock, CheckCircle, Upload, Send, FileText, Link as LinkIcon, Plus, X, Calendar, AlertCircle } from 'lucide-react';

interface Props {
    user: User;
}

const DepartmentTasks: React.FC<Props> = ({ user }) => {
    const [tasks, setTasks] = useState<DepartmentTask[]>([]);
    const [selectedTask, setSelectedTask] = useState<DepartmentTask | null>(null);
    const [linkedRequest, setLinkedRequest] = useState<HRRequest | null>(null);
    
    // --- Rich Form State ---
    const [formData, setFormData] = useState({
        recommendation: '',
        thematicArea: '',
        uprRecommendation: '',
        sdgGoal: '',
        humanRightsIndicator: '',
        accomplishmentDate: '',
        status: 'Ongoing',
        description: '',
        links: [] as string[],
        tempLink: '' // for the input field
    });

    useEffect(() => {
        if (user.province && user.departmentId) {
            const t = db.getTasksForDepartment(user.province, user.departmentId);
            setTasks(t);
        }
    }, [user]);

    const handleSelectTask = (task: DepartmentTask) => {
        const req = db.getRequestById(task.reqId);
        setLinkedRequest(req || null);
        
        // Reset Form
        setFormData({
            recommendation: '',
            thematicArea: '',
            uprRecommendation: '',
            sdgGoal: '',
            humanRightsIndicator: '',
            accomplishmentDate: '',
            status: 'Ongoing',
            description: task.responseData || '', // If re-opening draft (simple string support)
            links: [],
            tempLink: ''
        });
        
        setSelectedTask(task);
    };

    const handleAddLink = () => {
        if (formData.tempLink) {
            setFormData({
                ...formData, 
                links: [...formData.links, formData.tempLink],
                tempLink: ''
            });
        }
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = [...formData.links];
        newLinks.splice(index, 1);
        setFormData({...formData, links: newLinks});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;

        // Bundle all form data into a JSON string to store in the mock DB's 'responseData' field
        // This allows us to keep the rich structure without changing the TS Interface for this demo.
        const structuredResponse = JSON.stringify({
            recommendation: formData.recommendation,
            thematicArea: formData.thematicArea,
            upr: formData.uprRecommendation,
            sdg: formData.sdgGoal,
            hri: formData.humanRightsIndicator,
            accomplishmentDate: formData.accomplishmentDate,
            description: formData.description,
            links: formData.links,
            status: formData.status
        });

        db.submitDepartmentTask(selectedTask.taskId, structuredResponse, ''); // Attachment URL handled visually
        alert('Record saved and submitted successfully.');
        
        // Refresh
        const t = db.getTasksForDepartment(user.province!, user.departmentId!);
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
                                    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-l-4 border-l-green-500 opacity-80 cursor-default"
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
                <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#01411C] animate-in slide-in-from-right-4 fade-in max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-[#01411C]">Add Record</h2>
                            <p className="text-gray-500 text-xs mt-1">Submit data for Task: {selectedTask.taskId}</p>
                        </div>
                        <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Row 1: Request Info (Read Only) */}
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Request No</label>
                                <input 
                                    type="text" 
                                    value={selectedTask.reqId} 
                                    readOnly 
                                    className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Title *</label>
                                <input 
                                    type="text" 
                                    value={linkedRequest?.title || ''} 
                                    readOnly 
                                    className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            {/* Row 2 */}
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Convention *</label>
                                <input 
                                    type="text" 
                                    value={linkedRequest?.conv || ''} 
                                    readOnly 
                                    className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Recommendation *</label>
                                <select 
                                    value={formData.recommendation}
                                    onChange={e => setFormData({...formData, recommendation: e.target.value})}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                >
                                    <option value="">Select Recommendation</option>
                                    <option value="Legislation">Review Legislation</option>
                                    <option value="Implementation">Improve Implementation</option>
                                    <option value="Awareness">Public Awareness</option>
                                    <option value="Budget">Allocate Budget</option>
                                </select>
                            </div>

                            {/* Row 3 */}
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Thematic Area</label>
                                <input 
                                    type="text" 
                                    value={formData.thematicArea}
                                    onChange={e => setFormData({...formData, thematicArea: e.target.value})}
                                    placeholder="e.g. Women's Rights, Education"
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">UPR Recommendation</label>
                                <select 
                                    value={formData.uprRecommendation}
                                    onChange={e => setFormData({...formData, uprRecommendation: e.target.value})}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                >
                                    <option value="Auto-selected">Auto-selected (Based on context)</option>
                                    <option value="120.1">120.1 - Enhance Protection</option>
                                    <option value="120.5">120.5 - Gender Equality</option>
                                </select>
                            </div>

                            {/* Row 4 */}
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">SDG Goal</label>
                                <select 
                                    value={formData.sdgGoal}
                                    onChange={e => setFormData({...formData, sdgGoal: e.target.value})}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                >
                                    <option value="">Select SDG</option>
                                    {SDGS.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                                </select>
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Human Rights Indicator</label>
                                <select 
                                    value={formData.humanRightsIndicator}
                                    onChange={e => setFormData({...formData, humanRightsIndicator: e.target.value})}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                >
                                    <option value="">Select Indicator</option>
                                    {INDICATORS.map((ind, i) => <option key={i} value={ind.title}>{ind.title}</option>)}
                                </select>
                            </div>

                            {/* Row 5 */}
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Relevant Date *</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        value={linkedRequest?.date || ''} 
                                        readOnly
                                        className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                                    />
                                    <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
                                </div>
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Accomplishment Date</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        value={formData.accomplishmentDate}
                                        onChange={e => setFormData({...formData, accomplishmentDate: e.target.value})}
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                    />
                                    <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
                                </div>
                            </div>

                            {/* Row 6: Status - Full Width */}
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Status *</label>
                                <select 
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                >
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Delayed">Delayed</option>
                                </select>
                            </div>

                            {/* Row 7: Description - Full Width */}
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Description *</label>
                                <textarea 
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-md min-h-[120px] focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                    placeholder="Enter detailed description of the activity or data..."
                                ></textarea>
                            </div>

                            {/* Row 8: Documents */}
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Documents</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                    <Upload className="mx-auto text-gray-400 group-hover:text-[#01411C] mb-2" size={24} />
                                    <p className="text-sm text-gray-600">Click to upload files</p>
                                    <p className="text-xs text-gray-400">PDF, Excel, Word (Max 10MB)</p>
                                </div>
                            </div>

                            {/* Row 9: Links */}
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Links</label>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        type="url" 
                                        value={formData.tempLink}
                                        onChange={e => setFormData({...formData, tempLink: e.target.value})}
                                        placeholder="https://example.com"
                                        className="flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#01411C] focus:border-transparent outline-none"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddLink}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Link
                                    </button>
                                </div>
                                {formData.links.length > 0 && (
                                    <ul className="space-y-2">
                                        {formData.links.map((link, idx) => (
                                            <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                                                <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm truncate flex-1 flex items-center gap-2">
                                                    <LinkIcon size={14} /> {link}
                                                </a>
                                                <button type="button" onClick={() => handleRemoveLink(idx)} className="text-red-500 hover:text-red-700 p-1">
                                                    <X size={14} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setSelectedTask(null)} className="btn btn-secondary px-6">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary px-8">
                                <Send size={16} /> Save Record
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DepartmentTasks;
