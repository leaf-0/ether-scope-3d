
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronRight, BarChart2, Wallet, Activity, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Determine if the search query is a wallet address or transaction hash
    const isTransactionHash = searchQuery.length === 66; // Simple heuristic
    
    if (isTransactionHash) {
      window.location.href = `/trace/${searchQuery}`;
    } else {
      window.location.href = `/wallet/${searchQuery}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-apple ${
        scrolled ? 'glass shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
              ETHER-EYE
            </span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" icon={<Globe size={18} />} label="Dashboard" isActive={location.pathname === '/'} />
          <NavLink to="/wallet" icon={<Wallet size={18} />} label="Wallets" isActive={location.pathname.includes('/wallet')} />
          <NavLink to="/trace" icon={<Activity size={18} />} label="Traces" isActive={location.pathname.includes('/trace')} />
          <NavLink to="/analytics" icon={<BarChart2 size={18} />} label="Analytics" isActive={location.pathname.includes('/analytics')} />
        </div>

        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search address or tx..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg glass"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
          </form>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'text-white bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-white/10' 
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
    {isActive && <ChevronRight size={14} className="ml-1" />}
  </Link>
);

export default Navbar;
