
import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { Product } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onSave: (products: Product[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onSave }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['香水', '化粧品'];

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: 0,
      category: '香水',
      description: '',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
      color: 'ホワイト',
      rating: 5.0
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveForm = () => {
    if (editingId === 'new') {
      onSave([...products, formData as Product]);
    } else {
      onSave(products.map(p => p.id === editingId ? (formData as Product) : p));
    }
    setEditingId(null);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('この商品を削除してもよろしいですか？')) {
      onSave(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-serif italic">商品管理パネル</h2>
        <button 
          onClick={startNew}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all"
        >
          <Plus size={20} /> 新規商品を追加
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/40">
              <th className="py-4 px-2">画像</th>
              <th className="py-4 px-2">商品名</th>
              <th className="py-4 px-2">カテゴリ</th>
              <th className="py-4 px-2">価格</th>
              <th className="py-4 px-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(p => (
              <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                <td className="py-4 px-2">
                  <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="py-4 px-2 font-medium">{p.name}</td>
                <td className="py-4 px-2 text-white/40">{p.category}</td>
                <td className="py-4 px-2">¥{p.price.toLocaleString()}</td>
                <td className="py-4 px-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => startEdit(p)} className="p-2 hover:text-white text-white/40 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 hover:text-red-500 text-white/40 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingId(null)} />
          <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/20 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingId === 'new' ? '新規商品' : '商品編集'}</h3>
              <button onClick={() => setEditingId(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40">商品ビジュアル</label>
                <div className="flex flex-col gap-4">
                  <div className="relative group aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={48} className="text-white/10" />
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all backdrop-blur-sm"
                    >
                      <Upload size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">画像をアップロード</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      hidden 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] text-white/20 uppercase font-bold">または直接URLを入力</span>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/40 transition-all"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">商品名</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40"
                    placeholder="商品名を入力"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">価格 (¥)</label>
                    <input 
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">カテゴリ</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">説明文</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 h-24 resize-none"
                    placeholder="商品のストーリーを記述してください..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-white/10 flex gap-4">
              <button onClick={() => setEditingId(null)} className="flex-1 py-4 border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-colors">キャンセル</button>
              <button onClick={saveForm} className="flex-1 py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                <Check size={20} /> 保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
