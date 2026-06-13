import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@bizpilot.com' && password === 'password') {
      const mockUser = { id: '1', email, name: 'Admin User', role: 'admin' };
      const mockToken = 'mock_token_123';
      login(mockToken, mockUser);
      navigate('/');
    } else {
      setError('Invalid credentials. Use admin@bizpilot.com / password');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="z-10 w-full max-w-md p-8 glass-panel rounded-3xl mx-4">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="BizPilot AI Logo" className="h-20 w-20 rounded-2xl mb-4 object-cover neon-glow" />
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
          <p className="text-muted-foreground text-center">Enter your credentials to access the BizPilot Dashboard.</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/20 text-red-400 text-sm text-center border border-destructive/50">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500"
              placeholder="admin@bizpilot.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all neon-glow"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
