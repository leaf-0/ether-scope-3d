
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

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

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === '/' || location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname.includes('/wallet')) return 'Wallet Analysis';
    if (location.pathname.includes('/trace')) return 'Transaction Trace';
    if (location.pathname.includes('/analytics')) return 'Analytics';
    return 'Ethereum Explorer';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300 ease-in-out ${
        scrolled ? 'glass shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="font-medium text-lg">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
