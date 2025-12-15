
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, UserRole } from '../../types';
import { Users, Plus, Trash2, UserPlus, Shield, Mail, Phone, Edit, Save, X } from 'lucide-react';

const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'GB', 'AJK'];

const ProvinceUserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        contactNumber: '',
        province: PROVINCES[0]
    });

    useEffect(() => {
        refreshUsers();
    }, []);

    const refreshUsers = () => {
        setUsers(db.getProvincialUsers());
    };

    const handleEdit = (user: User) => {
        setFormData({
            name: user.name,
            username: user.username,
            email: user.email || '',
            contactNumber: user.contactNumber || '',
            province: user.province || PROVINCES[0]
        });
        setEditingId(user.id || null);
        setIsCreating(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            username: '',
            email: '',
            contactNumber: '',
            province: PROVINCES[0]
        });
        setEditingId(null);
        setIsCreating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingId) {
            // Update Existing
            db.updateProvincialUser(editingId, {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                contactNumber: formData.contactNumber,
                province: formData.province
            });
        } else {
            // Create New
            const newUser: User = {
                id: `USR-PROV-${Math.floor(Math.random() * 10000)}`,
                username: formData.username,
                name: formData.name,
                role: UserRole.PROVINCIAL_ADMIN,
                province: formData.province,
                email: formData.email,
                contactNumber: formData.contactNumber
            };
            db.addProvincialUser(newUser);
        }

        refreshUsers();
        resetForm();
    };

    const handleDelete = (id: string) => {
        if(confirm("Are you sure you want to delete this provincial admin account?")) {
            db.deleteProvincialUser(id);
            refreshUsers();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                        <Users /> Province User Management
                    </h2>
                    <p className="text-gray-500 text-sm">Create and manage access for provincial focal persons.</p>
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
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {editingId ? <Edit size={20} /> : <UserPlus size={20} />} 
                            {editingId ? 'Edit Provincial Account' : 'Create New Provincial Account'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-800">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="e.g. Ali Khan" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="e.g. punjab.focal" 
                                    value={formData.username}
                                    onChange={e => setFormData({...formData, username: e.target.value})}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="e.g. admin@punjab.gov.pk" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700">Contact Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="e.g. 042-1234567" 
                                    value={formData.contactNumber}
                                    onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Province Assignment</label>
                                <select 
                                    value={formData.province}
                                    onChange={e => setFormData({...formData, province: e.target.value})}
                                    className="p-2 border rounded-md w-full"
                                >
                                    {PROVINCES.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? <><Save size={16} /> Update User</> : 'Create Account'}
                            </button>
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
                            <th className="p-4 text-sm font-semibold text-gray-600">Province</th>
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
                                        {u.province}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm flex items-center gap-1">
                                    <Shield size={12} /> Provincial Admin
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleEdit(u)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(u.id!)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No provincial users created yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProvinceUserManagement;
