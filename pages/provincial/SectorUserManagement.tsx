
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { User, UserRole } from '../../types';
import { SECTORS } from '../../constants';
import { Users, Plus, Trash2, UserPlus, Shield } from 'lucide-react';

interface Props {
    user: User;
}

const SectorUserManagement: React.FC<Props> = ({ user }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [selectedSectorId, setSelectedSectorId] = useState(SECTORS[0].id);

    useEffect(() => {
        refreshUsers();
    }, [user]);

    const refreshUsers = () => {
        if (user.province) {
            setUsers(db.getSectorUsers(user.province));
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const sector = SECTORS.find(s => s.id === selectedSectorId);
        if (!sector) return;

        const newUser: User = {
            id: `USR-${Math.floor(Math.random() * 10000)}`,
            username: newUsername,
            name: newName,
            role: UserRole.SECTOR_ADMIN,
            province: user.province,
            sectorId: sector.id,
            sectorName: sector.name
        };

        db.addSectorUser(newUser);
        refreshUsers();
        setIsCreating(false);
        setNewName('');
        setNewUsername('');
    };

    const handleDelete = (id: string) => {
        if(confirm("Are you sure you want to remove this user access?")) {
            db.deleteSectorUser(id);
            refreshUsers();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                        <Users /> Sector User Management
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
                            <div className="form-field md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Department / Sector</label>
                                <select 
                                    value={selectedSectorId}
                                    onChange={e => setSelectedSectorId(e.target.value)}
                                    className="p-2 border rounded-md w-full"
                                >
                                    {SECTORS.map(s => (
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
                            <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Username</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Sector</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <td className="p-4 text-gray-800 font-medium">{u.name}</td>
                                <td className="p-4 text-gray-600 font-mono text-xs">{u.username}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                                        {u.sectorName}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm flex items-center gap-1">
                                    <Shield size={12} /> Sector Admin
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

export default SectorUserManagement;