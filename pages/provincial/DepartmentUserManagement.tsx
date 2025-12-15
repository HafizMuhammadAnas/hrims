
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, UserRole } from '../../types';
import { DEPARTMENTS } from '../../constants';
import { Users, Plus, Trash2, UserPlus, Shield, Mail, Phone } from 'lucide-react';

interface Props {
    user: User;
}

const DepartmentUserManagement: React.FC<Props> = ({ user }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newContact, setNewContact] = useState('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(DEPARTMENTS[0].id);

    useEffect(() => {
        refreshUsers();
    }, [user]);

    const refreshUsers = () => {
        if (user.province) {
            setUsers(db.getDepartmentUsers(user.province));
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const dept = DEPARTMENTS.find(s => s.id === selectedDepartmentId);
        if (!dept) return;

        const newUser: User = {
            id: `USR-${Math.floor(Math.random() * 10000)}`,
            username: newUsername,
            name: newName,
            role: UserRole.DEPARTMENT_ADMIN,
            province: user.province,
            departmentId: dept.id,
            departmentName: dept.name,
            email: newEmail,
            contactNumber: newContact
        };

        db.addUser(newUser);
        refreshUsers();
        setIsCreating(false);
        setNewName('');
        setNewUsername('');
        setNewEmail('');
        setNewContact('');
    };

    const handleDelete = (id: string) => {
        if(confirm("Are you sure you want to remove this user access?")) {
            db.deleteUser(id);
            refreshUsers();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                        <Users /> Department User Management
                    </h2>
                    <p className="text-gray-500 text-sm">Create and manage access for department focal persons.</p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)} 
                    className="btn btn-primary"
                >
                    <Plus size={18} /> Add New User
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#01411C] animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <UserPlus size={20} /> Create New Department Account
                    </h3>
                    <form onSubmit={handleCreate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="e.g. Dr. Ahmed Khan" 
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
                                    placeholder="e.g. ahmed.health" 
                                    value={newUsername}
                                    onChange={e => setNewUsername(e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="e.g. ahmed@punjab.gov.pk" 
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Contact Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="e.g. 0300-1234567" 
                                    value={newContact}
                                    onChange={e => setNewContact(e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Department / Sector</label>
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
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsCreating(false)} className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Account</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Name & Contact</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Username</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Department</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
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
                                        {u.contactNumber && <span className="flex items-center gap-1"><Phone size={10} /> {u.contactNumber}</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 font-mono text-xs">{u.username}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                                        {u.departmentName}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm flex items-center gap-1">
                                    <Shield size={12} /> Department Admin
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
                                    No users created yet. Click "Add New User" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DepartmentUserManagement;
