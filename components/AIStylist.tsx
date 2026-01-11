
import React, { useState, useRef } from 'react';
import { Sparkles, Camera, Upload, Loader2, ArrowRight } from 'lucide-react';
import { getAIStylistRecommendation } from '../services/geminiService';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface AIStylistProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const AIStylist: React.FC<AIStylistProps> = ({ products, onAddToCart }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetRecommendation = async () => {
    if (!input && !image) return;
    setLoading(true);
    const recommendation = await getAIStylistRecommendation(input || "私に似合う最新のコレクションを提案してください。", products, image || undefined);
    setResult(recommendation);
    setLoading(false);
  };

  const recommendedProducts = result?.recommendedProductIds?.map((id: string) => 
    products.find(p => p.id === id)
  ).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 mb-6">
          <Sparkles size={16} />
          <span className="text-sm font-medium tracking-widest uppercase">インテリジェント・パーソナル・スタイリング</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-serif italic mb-6">個性の再定義</h2>
        <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">
          あなたの気分、特別なイベント、あるいは理想のスタイルを教えてください。写真をアップロードして視覚的な分析を行うことも可能です。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 sticky top-32">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/40 uppercase tracking-widest mb-4">インスピレーションを入力</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例：夜の表参道でのディナーにふさわしい、未来的でシックなスタイルを..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-all resize-none h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-40 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              >
                {image ? (
                  <img src={image} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="text-white/20 group-hover:text-white/40 transition-colors mb-2" size={32} />
                    <span className="text-xs text-white/20 uppercase font-bold">参考写真をアップ</span>
                  </>
                )}
                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
              </div>
              <div className="h-40 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                <Upload className="text-white/20 mb-2" size={32} />
                <span className="text-xs text-white/20 uppercase font-bold">スタイル分析開始</span>
              </div>
            </div>

            <button 
              onClick={handleGetRecommendation}
              disabled={loading || (!input && !image)}
              className="w-full py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>パーソナル提案を受ける <ArrowRight size={20} /></>}
            </button>
          </div>
        </div>

        <div className="space-y-12">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-8 p-8 border-l-2 border-white/20 italic text-2xl font-serif text-white/80">
                "{result.explanation}"
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedProducts?.map((p: Product) => (
                  <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
                ))}
              </div>

              <div className="mt-12 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">スタイリングの秘訣</h4>
                <div className="space-y-3">
                  {result.stylingTips?.map((tip: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                      <p className="text-sm text-white/60">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/5 rounded-3xl opacity-20 grayscale">
              <Sparkles size={64} className="mb-6" />
              <p className="font-serif italic text-2xl">コンシェルジュがあなたの言葉を待っています...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStylist;
