import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-full w-64 flex-col glass-panel rounded-2xl px-4 py-8">
      <div className="mb-10 flex items-center gap-3 px-2">
        <img src="/logo.png" alt="BizPilot AI" className="h-10 w-10 rounded-xl object-cover neon-glow" />
        <h1 className="text-2xl font-bold tracking-tight text-white">BizPilot AI</h1>
      </div>
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/20 text-primary neon-glow border border-primary/30' 
                  : 'text-muted-foreground hover:bg-white/5 hover:text-white hover:translate-x-1 border border-transparent'
              }`}
            >
              <div className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-white/10">
        <button className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all duration-300">
          <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
      
      <div className="z-10 flex w-full h-screen p-4 gap-4">
        <Sidebar />
        <main className="flex-1 glass-panel rounded-2xl overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
