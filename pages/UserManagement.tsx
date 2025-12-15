
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { User, UserRole } from '../types';
import { DEPARTMENTS } from '../constants';
import { Users, Plus, Trash2, UserPlus, Shield, Mail, Phone, Eye, Copy, Building2 } from 'lucide-react';

interface Props {
    user: User; // The logged-in admin (Creator)
}

const UserManagement: React.FC<Props> = ({ user }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [userType, setUserType] = useState<'clone' | 'department' | 'viewer'>('department');
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newContact, setNewContact] = useState('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(DEPARTMENTS[0].id);

    // Determine Scope
    const isFederal = user.role === UserRole.FEDERAL_ADMIN;
    const scopeProvince = isFederal ? 'Federal' : user.province;

    useEffect(() => {
        refreshUsers();
    }, [user]);

    const refreshUsers = () => {
        // Fetch users created under this scope (excluding root accounts)
        setUsers(db.getUsersByScope(isFederal ? undefined : user.province));
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        let newUserRole: UserRole;
        let departmentData = {};

        if (userType === 'clone') {
            newUserRole = isFederal ? UserRole.FEDERAL_ADMIN : UserRole.PROVINCIAL_ADMIN;
        } else if (userType === 'viewer') {
            newUserRole = UserRole.VIEWER;
        } else {
            newUserRole = UserRole.DEPARTMENT_ADMIN;
            const dept = DEPARTMENTS.find(d => d.id === selectedDepartmentId);
            if (dept) {
                departmentData = { departmentId: dept.id, departmentName: dept.name };
            }
        }

        const newUser: User = {
            id: `USR-${Math.floor(Math.random() * 10000)}`,
            username: newUsername,
            name: newName,
            role: newUserRole,
            province: scopeProvince,
            email: newEmail,
            contactNumber: newContact,
            ...departmentData
        };

        db.addUser(newUser);
        refreshUsers();
        resetForm();
    };

    const resetForm = () => {
        setIsCreating(false);
        setNewName('');
        setNewUsername('');
        setNewEmail('');
        setNewContact('');
        setUserType('department');
    };

    const handleDelete = (id: string) => {
        if(confirm("Are you sure you want to remove this user access?")) {
            db.deleteUser(id);
            refreshUsers();
        }
    };

    const getTypeLabel = (u: User) => {
        if (u.role === UserRole.VIEWER) return <span className="inline-flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-medium"><Eye size={12}/> Viewer</span>;
        if (u.role === UserRole.DEPARTMENT_ADMIN) return <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium"><Building2 size={12}/> Department</span>;
        return <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium"><Copy size={12}/> Admin Clone</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                        <Users /> User Management ({scopeProvince})
                    </h2>
                    <p className="text-gray-500 text-sm">Create and manage access for your internal team, departments, and viewers.</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)} 
                        className="btn btn-primary"
                    >
                        <Plus size={18} /> Add New User
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#01411C] animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <UserPlus size={20} /> Create New User
                    </h3>
                    <form onSubmit={handleCreate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">User Type</label>
                                <div className="grid grid-cols-3 gap-3 mt-1">
                                    <label className={`border p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${userType === 'clone' ? 'bg-green-50 border-[#01411C] text-[#01411C]' : 'hover:bg-gray-50'}`}>
                                        <input type="radio" name="uType" className="hidden" checked={userType === 'clone'} onChange={() => setUserType('clone')} />
                                        <Copy size={20} className="mb-2" />
                                        <span className="font-bold text-sm">Admin Clone</span>
                                        <span className="text-xs text-center mt-1 text-gray-500">Internal Team Member (Full Access)</span>
                                    </label>
                                    <label className={`border p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${userType === 'department' ? 'bg-blue-50 border-blue-600 text-blue-800' : 'hover:bg-gray-50'}`}>
                                        <input type="radio" name="uType" className="hidden" checked={userType === 'department'} onChange={() => setUserType('department')} />
                                        <Building2 size={20} className="mb-2" />
                                        <span className="font-bold text-sm">Department User</span>
                                        <span className="text-xs text-center mt-1 text-gray-500">Department Focal Person (Task Access)</span>
                                    </label>
                                    <label className={`border p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${userType === 'viewer' ? 'bg-purple-50 border-purple-600 text-purple-800' : 'hover:bg-gray-50'}`}>
                                        <input type="radio" name="uType" className="hidden" checked={userType === 'viewer'} onChange={() => setUserType('viewer')} />
                                        <Eye size={20} className="mb-2" />
                                        <span className="font-bold text-sm">Viewer User</span>
                                        <span className="text-xs text-center mt-1 text-gray-500">Read-Only (Dashboards & Reports)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="e.g. Ali Khan" 
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="e.g. ali.viewer" 
                                    value={newUsername}
                                    onChange={e => setNewUsername(e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            
                            {/* Email and Contact (Optional for internal, useful for Dept) */}
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Email Address (Optional)</label>
                                <input 
                                    type="email" 
                                    placeholder="e.g. ali@gov.pk" 
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Contact Number (Optional)</label>
                                <input 
                                    type="tel" 
                                    placeholder="e.g. 0300-1234567" 
                                    value={newContact}
                                    onChange={e => setNewContact(e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>

                            {userType === 'department' && (
                                <div className="form-field md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Assign Department</label>
                                    <select 
                                        value={selectedDepartmentId}
                                        onChange={e => setSelectedDepartmentId(e.target.value)}
                                        className="p-2 border rounded-md w-full"
                                    >
                                        {DEPARTMENTS.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Account</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Username</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">User Type</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Details</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <td className="p-4">
                                    <div className="font-medium text-gray-800">{u.name}</div>
                                    <div className="flex flex-col text-xs text-gray-500 mt-1 gap-1">
                                        {u.email && <span className="flex items-center gap-1"><Mail size={10} /> {u.email}</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 font-mono text-xs">{u.username}</td>
                                <td className="p-4">
                                    {getTypeLabel(u)}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {u.role === UserRole.DEPARTMENT_ADMIN && u.departmentName}
                                    {u.role === UserRole.VIEWER && "Read-Only Access"}
                                    {(u.role === UserRole.FEDERAL_ADMIN || u.role === UserRole.PROVINCIAL_ADMIN) && "Full Access"}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleDelete(u.id!)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                        title="Remove User"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No users created. Click "Add New User" to create Internal Admins, Department Users, or Viewers.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
