import React, { useEffect, useState } from 'react';
import { Package, Search, Plus, Edit, Trash2, X } from 'lucide-react';
import axios from 'axios';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '', sku: '', category: 'General', costPrice: 0, sellingPrice: 0, stockQuantity: 0
  });

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/inventory', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name, sku: item.sku, category: item.category, 
        costPrice: item.costPrice, sellingPrice: item.sellingPrice, stockQuantity: item.stockQuantity
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', sku: '', category: 'General', costPrice: 0, sellingPrice: 0, stockQuantity: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      if (editingItem) {
        await axios.put(`http://localhost:4000/api/inventory/${editingItem.id}`, formData, { headers });
      } else {
        await axios.post('http://localhost:4000/api/inventory', formData, { headers });
      }
      setIsModalOpen(false);
      fetchInventory();
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:4000/api/inventory/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchInventory();
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Inventory</h1>
          <p className="text-muted-foreground">Manage your product catalog and stock levels.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(124,58,ed,0.3)] hover:shadow-[0_0_25px_rgba(124,58,ed,0.5)]">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/20">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium text-right">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading inventory...</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Package size={20} />
                        </div>
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.sku}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">{item.stockQuantity}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">Rs. {item.sellingPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${item.stockQuantity > 10 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          item.stockQuantity > 0 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {item.stockQuantity > 10 ? 'In Stock' : item.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 size={16} />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" placeholder="Product Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white" />
              <input type="text" placeholder="SKU" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white" />
              <div className="flex gap-4">
                <input type="number" placeholder="Cost Price" required value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white" />
                <input type="number" placeholder="Selling Price" required value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
              <input type="number" placeholder="Stock Quantity" required value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white" />
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 font-medium">Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
