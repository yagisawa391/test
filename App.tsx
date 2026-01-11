
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, CreditCard, Sparkles, MessageSquare, Send, Settings } from 'lucide-react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AIStylist from './components/AIStylist';
import AdminDashboard from './components/AdminDashboard';
import { AppSection, Product, CartItem, ChatMessage } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { chatWithSupport } from './services/geminiService';

const App: React.FC = () => {
  const [section, setSection] = useState<AppSection>(AppSection.Home);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState('すべて');

  // 初期読み込み: localStorage または constants から
  useEffect(() => {
    const savedProducts = localStorage.getItem('lumina_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('lumina_products', JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('lumina_products', JSON.stringify(newProducts));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    
    setIsTyping(true);
    try {
      const response = await chatWithSupport(msg, products);
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', text: "申し訳ございません。現在コンシェルジュが席を外しております。後ほど再度お声がけください。" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredProducts = activeCategory === 'すべて' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar currentSection={section} setSection={setSection} cartCount={cartCount} />

      <main className="pt-20">
        {section === AppSection.Home && (
          <div className="relative">
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=2000"
                  className="w-full h-full object-cover opacity-30 grayscale scale-110"
                  alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
              </div>

              <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-[120px] font-serif italic font-bold tracking-tighter leading-none mb-8 animate-float">
                  Beyond <br/> <span className="text-white/20">The Horizon</span>
                </h1>
                <p className="text-white/60 text-lg md:text-xl font-light tracking-widest uppercase mb-12">
                  技術的ラグジュアリーと独創的な職人技の共演
                </p>
                <button 
                  onClick={() => setSection(AppSection.Shop)}
                  className="px-10 py-5 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                  コレクションを探しに行く
                </button>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-32">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-white/40 mb-4">最新セレクション</h2>
                  <h3 className="text-4xl font-serif italic">注目の逸品</h3>
                </div>
                <button 
                  onClick={() => setSection(AppSection.Shop)}
                  className="text-sm font-medium border-b border-white/20 pb-1 hover:border-white transition-colors"
                >
                  すべての商品を見る
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.slice(0, 3).map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                ))}
              </div>
            </div>
          </div>
        )}

        {section === AppSection.Shop && (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="mb-20">
              <h2 className="text-5xl font-serif italic mb-4">全ラインナップ</h2>
              <div className="flex gap-4 flex-wrap">
                {['すべて', '香水', '化粧品'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        )}

        {section === AppSection.Stylist && (
          <AIStylist products={products} onAddToCart={addToCart} />
        )}

        {section === AppSection.Admin && (
          <AdminDashboard products={products} onSave={handleUpdateProducts} />
        )}

        {section === AppSection.Cart && (
          <div className="max-w-3xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-serif italic mb-12">あなたのセレクション</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20 border border-white/5 rounded-3xl">
                <ShoppingCart size={48} className="mx-auto mb-6 text-white/20" />
                <p className="text-white/40 mb-8">カートは空です。新しい体験を見つけに行きましょう。</p>
                <button 
                  onClick={() => setSection(AppSection.Shop)}
                  className="px-8 py-4 bg-white text-black font-bold rounded-full"
                >
                  ショッピングを再開
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-6 items-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <img src={item.image} className="w-24 h-24 object-cover rounded-xl" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-sm text-white/40 font-light">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">¥{item.price.toLocaleString()}</div>
                      <div className="text-xs text-white/40">数量: {item.quantity}</div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-400 mt-2 hover:underline"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-12 p-8 bg-white text-black rounded-3xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm uppercase tracking-widest font-bold opacity-50">合計 (税込)</span>
                    <span className="text-4xl font-bold font-serif italic">¥{cartTotal.toLocaleString()}</span>
                  </div>
                  <button className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all">
                    <CreditCard size={20} /> 購入手続きに進む
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <button 
          onClick={() => setSection(AppSection.Admin)}
          className={`p-3 rounded-full border transition-all ${section === AppSection.Admin ? 'bg-white text-black border-white' : 'bg-black/40 text-white/20 border-white/10 hover:text-white/60'}`}
          title="管理モード"
        >
          <Settings size={20} />
        </button>

        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageSquare size={28} />
          </button>
        ) : (
          <div className="w-[350px] h-[500px] bg-black border border-white/20 rounded-3xl flex flex-col shadow-[0_32px_64px_-16px_rgba(255,255,255,0.1)] overflow-hidden">
            <div className="p-6 bg-white/10 border-b border-white/10 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm tracking-tight">Lumina Concierge</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">オンライン</span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-10">
                  <Sparkles size={32} className="mx-auto mb-4 text-white/20" />
                  <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest font-bold">
                    ようこそ。Luminaコンシェルジュです。<br/>何かお探しでしょうか？
                  </p>
                </div>
              )}
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 text-sm leading-relaxed ${
                    chat.role === 'user' 
                      ? 'bg-white text-black rounded-2xl rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 rounded-2xl rounded-tl-none'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black">
              <div className="relative">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="ご質問をどうぞ..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-white/40"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-xl flex items-center justify-center hover:bg-white/80 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-white/10 py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-serif italic font-bold mb-6">LUMINA LUXE</h2>
            <p className="text-white/40 max-w-sm font-light leading-relaxed">
              私たちは、真のラグジュアリーが知性、持続可能性、そして類まれなクラフトマンシップから生まれると信じています。
              時代を先駆ける人々のためのキュレーションサイトです。
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-6">ナビゲーション</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><button onClick={() => setSection(AppSection.Shop)} className="hover:text-white">全商品</button></li>
              <li><button onClick={() => setSection(AppSection.Stylist)} className="hover:text-white">AIコンシェルジュ</button></li>
              <li><button onClick={() => setSection(AppSection.Admin)} className="hover:text-white">管理モード</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-6">ソーシャル</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><button className="hover:text-white">Instagram</button></li>
              <li><button className="hover:text-white">Twitter</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-white/20">
          <p>© 2024 LUMINA LUXE INTERNATIONAL</p>
          <p>BUILT WITH INTELLIGENCE</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
