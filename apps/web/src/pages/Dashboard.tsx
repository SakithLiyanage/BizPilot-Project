import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/dashboard');
        setMetrics(response.data.metrics);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return <DollarSign size={24} className="text-primary" />;
      case 'ShoppingCart': return <ShoppingCart size={24} className="text-blue-400" />;
      case 'Users': return <Users size={24} className="text-green-400" />;
      case 'TrendingUp': return <TrendingUp size={24} className="text-purple-400" />;
      default: return <Package size={24} className="text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here is what's happening with your business today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="text-white">Loading metrics...</p>
        ) : (
          metrics.map((metric) => (
            <div key={metric.name} className="group glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{metric.name}</h3>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:neon-glow transition-all">
                  {getIcon(metric.iconName)}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.change}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 glass-panel rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-medium text-white mb-4">Revenue Overview</h3>
          <div className="h-[300px] flex items-center justify-center border border-white/10 rounded-xl bg-white/5 group-hover:border-primary/50 transition-all">
             <div className="flex flex-col items-center gap-2">
                <TrendingUp size={32} className="text-primary opacity-50" />
                <p className="text-muted-foreground">AI Analytics Chart Module</p>
             </div>
          </div>
        </div>

        <div className="col-span-3 glass-panel rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-medium text-white mb-4">Recent AI Orders</h3>
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-white/5 transition-all">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center text-primary group-hover:neon-glow border border-primary/20 transition-all">
                  <Package size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-white leading-none">Order #{1000 + i}</p>
                  <p className="text-xs text-muted-foreground">Epson L3250 Printer</p>
                </div>
                <div className="font-semibold text-sm text-white">Rs. 48,500</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
