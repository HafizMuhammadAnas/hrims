
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/mockDb';
import { Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const user = db.authenticate(username);

        if (user && password === 'password') { // Hardcoded password for demo
            onLogin(user);
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="logo">HRIMS</div>
                <h1 className="sys-title">Human Rights Information Management System</h1>
                <p className="sys-sub" style={{color: '#757575', marginBottom: '10px'}}>Islamic Republic of Pakistan</p>
                <p className="urdu" style={{marginBottom: '30px'}}>اسلامی جمہوریہ پاکستان</p>

                <form onSubmit={handleLogin} style={{textAlign: 'left'}}>
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <div className="form-field" style={{marginBottom: '15px'}}>
                        <label>Username</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="e.g. federal or punjab admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10 w-full"
                                required
                            />
                            {/* <UserIcon size={18} className="absolute left-3 top-3 text-gray-400" /> */}
                        </div>
                    </div>
                    <div className="form-field" style={{marginBottom: '20px'}}>
                        <label>Password</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                placeholder="default: password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full"
                                required
                            />
                            {/* <Lock size={18} className="absolute left-3 top-3 text-gray-400" /> */}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                        Login / داخل ہوں
                    </button>
                    
                    <div className="mt-4 text-xs text-gray-500 text-center">
                        <p>Demo Credentials:</p>
                        <p>Federal: <b>federal</b></p>
                        <p>Province: <b>punjab admin</b>, <b>sindh admin</b></p>
                        <p>Password: <b>password</b></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
