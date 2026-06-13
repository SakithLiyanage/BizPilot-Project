import React, { useEffect, useState } from 'react';
import { Save, User, Building2 } from 'lucide-react';
import axios from 'axios';

export default function Settings() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    whatsappNumber: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/settings/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:4000/api/settings/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <div className="text-white p-8">Loading profile...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-white mb-4 border-b border-white/10 pb-2">
              <User size={20} className="text-primary" />
              <h3>Profile Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-white mb-4 border-b border-white/10 pb-2">
              <Building2 size={20} className="text-blue-400" />
              <h3>Business Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Company Name</label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">WhatsApp Number (API)</label>
                <input 
                  type="text" 
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] neon-glow"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
