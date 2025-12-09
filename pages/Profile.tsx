
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Save, UserCircle, Key } from 'lucide-react';

interface ProfileProps {
    user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile details updated successfully!');
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-[#01411C] flex items-center gap-2">
                <UserCircle size={28} /> User Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Details Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#01411C]">
                    <h3 className="text-lg font-bold mb-6 text-gray-700 flex items-center gap-2">
                        Basic Information
                    </h3>
                    <form onSubmit={handleSaveProfile}>
                        <div className="space-y-4">
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    value={user.username} 
                                    disabled 
                                    className="w-full p-2 border bg-gray-100 rounded-md text-gray-500"
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700 mb-1">Role</label>
                                <input 
                                    type="text" 
                                    value={user.role === UserRole.FEDERAL_ADMIN ? 'Federal Administrator' : 'Provincial Administrator'} 
                                    disabled 
                                    className="w-full p-2 border bg-gray-100 rounded-md text-gray-500"
                                />
                            </div>
                            {user.province && (
                                <div className="form-field">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Province</label>
                                    <input 
                                        type="text" 
                                        value={user.province} 
                                        disabled 
                                        className="w-full p-2 border bg-gray-100 rounded-md text-gray-500"
                                    />
                                </div>
                            )}
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="pt-4 text-right">
                                <button type="submit" className="btn btn-primary">
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Change Password Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#1E88E5]">
                    <h3 className="text-lg font-bold mb-6 text-gray-700 flex items-center gap-2">
                        <Key size={20} /> Security Settings
                    </h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="space-y-4">
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="pt-4 text-right">
                                <button type="submit" className="btn btn-secondary">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;