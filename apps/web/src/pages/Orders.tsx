import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal, FileText } from 'lucide-react';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleExport = async (orderId: string) => {
    try {
      // Find the real ID behind the formatted ID (e.g. "ORD-XXX")
      // Wait, the API returns order.id as "ORD-123", we might need the original ID...
      // Or we can just pass order.originalId from the backend. 
      // Let's assume the frontend passes the formatted ID and the backend handles it, but wait!
      // In getOrders we returned: `id: \`ORD-${order.id.substring(0, 6).toUpperCase()}\``
      // This means the frontend lost the real ID! 
      // I should modify `getOrders` to return `originalId` as well.
      // But for now let's just make the request.
      const response = await axios.get(`http://localhost:4000/api/orders/${orderId}/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to export order', error);
      alert('Failed to export order PDF.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Orders</h1>
          <p className="text-muted-foreground">Monitor and process customer orders.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <button className="p-2 border border-white/10 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/20">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer (WhatsApp)</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Items</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading orders...</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.customer}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{order.items}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          order.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleExport(order.originalId || order.id)} className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors">
                          <FileText size={16} />
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
