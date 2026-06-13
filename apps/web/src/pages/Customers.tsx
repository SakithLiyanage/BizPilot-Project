import React, { useEffect, useState } from 'react';
import { Search, MessageCircle, Star, MoreVertical } from 'lucide-react';
import axios from 'axios';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Customers</h1>
          <p className="text-muted-foreground">Manage customer relationships and loyalty.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/20">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">WhatsApp</th>
                <th className="px-6 py-4 font-medium text-right">Total Orders</th>
                <th className="px-6 py-4 font-medium text-right">Total Spent</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading customers...</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{customer.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-muted-foreground">VIP Member</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.phone}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">{customer.orders}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">{customer.totalSpent}</td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.lastActive}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors" title="Message on WhatsApp">
                          <MessageCircle size={16} />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
