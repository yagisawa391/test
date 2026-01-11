
import React from 'react';
import { ShoppingBag, Sparkles, Home, Box, Menu, Search } from 'lucide-react';
import { AppSection } from '../types';

interface NavbarProps {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection, setSection, cartCount }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <h1 
              onClick={() => setSection(AppSection.Home)}
              className="text-2xl font-serif italic font-bold tracking-tighter cursor-pointer hover:text-white/80 transition-all"
            >
              LUMINA <span className="text-sm font-sans not-italic font-light tracking-[0.3em] ml-1">LUXE</span>
            </h1>
            
            <div className="hidden md:flex items-center gap-6">
              {[
                { id: AppSection.Home, label: 'ホーム', icon: <Home size={18} /> },
                { id: AppSection.Shop, label: 'コレクション', icon: <Box size={18} /> },
                { id: AppSection.Stylist, label: 'AIスタイリスト', icon: <Sparkles size={18} /> },
              ].map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => setSection(nav.id)}
                  className={`flex items-center gap-2 text-sm font-medium tracking-wide transition-colors ${
                    currentSection === nav.id ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {nav.icon}
                  {nav.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-white/50 hover:text-white transition-colors">
              <Search size={22} />
            </button>
            <button 
              onClick={() => setSection(AppSection.Cart)}
              className="relative p-2 text-white/50 hover:text-white transition-colors"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-white/50 hover:text-white">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
