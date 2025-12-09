
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SECTORS } from '../constants';
import { db } from '../services/mockDb';

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [role, setRole] = useState<UserRole>(UserRole.FEDERAL_ADMIN);
    const [province, setProvince] = useState<string>('Punjab');
    const [sectorId, setSectorId] = useState<string>('SEC-HEALTH');
    const [username, setUsername] = useState('');
    
    // For Department Login, try to find existing users from DB to simulate login
    const [availableSectorUsers, setAvailableSectorUsers] = useState<User[]>([]);

    useEffect(() => {
        if (role === UserRole.SECTOR_ADMIN) {
            const users = db.getSectorUsers(province);
            setAvailableSectorUsers(users);
        }
    }, [role, province]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        let user: User;
        
        if (role === UserRole.FEDERAL_ADMIN) {
            user = {
                username: username || 'admin',
                role: role,
                name: 'Federal Administrator',
                province: undefined
            };
        } else if (role === UserRole.PROVINCIAL_ADMIN) {
            user = {
                username: username || 'prov_admin',
                role: role,
                name: `${province} Focal Person`,
                province: province
            };
        } else {
            // SECTOR_ADMIN
            const selectedSector = SECTORS.find(s => s.id === sectorId);
            user = {
                username: username || 'sec_user',
                role: role,
                name: `${selectedSector?.name} User`,
                province: province,
                sectorId: sectorId,
                sectorName: selectedSector?.name
            };
        }
        
        onLogin(user);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="logo">HRIS</div>
                <h1 className="sys-title">Human Rights Information System</h1>
                <p className="sys-sub" style={{color: '#757575', marginBottom: '10px'}}>Islamic Republic of Pakistan</p>
                <p className="urdu" style={{marginBottom: '30px'}}>اسلامی جمہوریہ پاکستان</p>

                <form onSubmit={handleLogin} style={{textAlign: 'left'}}>
                    <div className="form-field" style={{marginBottom: '15px'}}>
                        <label>Login As</label>
                        <select 
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                        >
                            <option value={UserRole.FEDERAL_ADMIN}>Federal Authority (MOHR)</option>
                            <option value={UserRole.PROVINCIAL_ADMIN}>Provincial Department</option>
                            <option value={UserRole.SECTOR_ADMIN}>Sector / Department User</option>
                        </select>
                    </div>

                    {(role === UserRole.PROVINCIAL_ADMIN || role === UserRole.SECTOR_ADMIN) && (
                         <div className="form-field" style={{marginBottom: '15px'}}>
                            <label>Select Province</label>
                            <select 
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            >
                                <option value="Punjab">Punjab</option>
                                <option value="Sindh">Sindh</option>
                                <option value="KPK">KPK</option>
                                <option value="Balochistan">Balochistan</option>
                                <option value="Islamabad">Islamabad</option>
                                <option value="GB">GB</option>
                                <option value="AJK">AJK</option>
                            </select>
                        </div>
                    )}

                    {role === UserRole.SECTOR_ADMIN && (
                         <div className="form-field" style={{marginBottom: '15px'}}>
                            <label>Select Sector / Department</label>
                            <select 
                                value={sectorId}
                                onChange={(e) => setSectorId(e.target.value)}
                            >
                                {SECTORS.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <div className="text-xs text-gray-500 mt-1">
                                {availableSectorUsers.length > 0 ? 
                                    `${availableSectorUsers.length} active users found for ${province}` : 
                                    "System will auto-generate session for demo"
                                }
                            </div>
                        </div>
                    )}

                    <div className="form-field" style={{marginBottom: '15px'}}>
                        <label>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field" style={{marginBottom: '20px'}}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter password"
                            defaultValue="password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                        Login / داخل ہوں
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;