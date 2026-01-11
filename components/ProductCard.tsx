
import React from 'react';
import { Plus, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500">
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-widest font-bold rounded-full border border-white/10">
          {product.category}
        </span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold tracking-tight leading-tight">{product.name}</h3>
          <div className="flex items-center gap-1 text-white/60">
            <Star size={14} className="fill-white/60" />
            <span className="text-xs">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-white/40 text-sm line-clamp-2 mb-4 font-light">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">¥{product.price.toLocaleString()}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-white/80 transition-all transform hover:rotate-90"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
